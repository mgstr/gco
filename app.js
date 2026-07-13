const ICONS = {"Tavaline": "icons/regular.png", "Mõistatus": "icons/mystery.png", "Multi": "icons/multi.png", "Virtuaalne": "icons/virtual.png", "KusMaLäen": "icons/wherigo.png", "Kirjakast": "icons/letterbox.png", "Asukohata": "icons/reverse.png", "Veebikaamera": "icons/webcam.png"};

// ─── Leaflet (shared by cache-detail maps and the coordinate converter) ────
// Loaded eagerly, first thing, so the fetch starts as early as possible —
// this is the one part of the page that needs the network. It lives outside
// initApp() below so the fetch isn't held up waiting on data.json to load.
let leafletLoaded = false;
let leafletLoading = false;
let leafletReadyHandler = null; // wired up by initApp() once its map state exists

function ensureLeaflet() {
  if (leafletLoaded || leafletLoading) return;
  leafletLoading = true;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.onload = function() {
    leafletLoaded = true;
    leafletLoading = false;
    if (leafletReadyHandler) leafletReadyHandler();
  };
  script.onerror = function() {
    leafletLoading = false;
    // No internet — map previews stay unavailable, everything else still works.
  };
  document.head.appendChild(script);
}
ensureLeaflet();

// ─── App init — runs once cache data has loaded from data.json ────────────
function initApp(CACHES) {
let currentView = 'search';
let ccLeafMap = null;
let ccLeafMarker = null;
let pjLeafMap = null;
let pjSMarker = null;
let pjPMarker = null;
let pjLine = null;
let ccPendingLatLon = null;
let pjPendingPoints = null;
let pendingCacheMapDivs = [];
let openCacheMaps = [];
let previousView = 'search';
let fullMap = null;
let fullMapMarker = null;
let searchMap = null;
let searchMapMarkers = [];
let mapViewActive = false;
let lastShown = [];
let customOriginLat = null;
let customOriginLon = null;
let originMarker = null;
let lastMapClickAt = 0;
let cachePinIcons = null;
let userLocationMarker = null;
const ESTONIA_BOUNDS = [[57.5, 21.5], [59.7, 28.3]]; // mainland + islands, incl. Narva/Saaremaa/Hiiumaa
const FULLMAP_ZOOM = 17; // close enough for on-the-spot cache finding

leafletReadyHandler = function() {
  if (currentView === 'coord') {
    ccInitMap();
    if (ccPendingLatLon) ccMapUpdate(ccPendingLatLon.lat, ccPendingLatLon.lon);
  }
  if (currentView === 'proj') {
    pjInitMap();
    if (pjPendingPoints) pjMapUpdate(pjPendingPoints.sLat, pjPendingPoints.sLon, pjPendingPoints.pLat, pjPendingPoints.pLon);
  }
  pendingCacheMapDivs.forEach(ensureCacheMap);
  pendingCacheMapDivs = [];
  if (mapViewActive) { ensureSearchMap(); updateMapMarkers(lastShown); }
};
if (leafletLoaded) leafletReadyHandler();

const qEl = document.getElementById('q');
const ownerChk = document.getElementById('ownerChk');
const regionChk = document.getElementById('regionChk');
const hideFoundWrap = document.getElementById('hideFoundWrap');
const hideFoundChk = document.getElementById('hideFoundChk');
const sortSel = document.getElementById('sortSel');
const distOpt = document.getElementById('distOpt');
const sortDirBtn = document.getElementById('sortDirBtn');
const originSel = document.getElementById('originSel');
const listEl = document.getElementById('list');
const countEl = document.getElementById('count');
const topEl = document.getElementById('top');
const mapviewEl = document.getElementById('mapview');
const mapCanvasEl = document.getElementById('map-canvas');
// Per-column default sort direction: newest first for ID, A-Z for name, nearest first for distance.
const DEFAULT_SORT_DIR = { id: 'desc', name: 'asc', distance: 'asc' };
let sortDir = DEFAULT_SORT_DIR[sortSel.value];
let userChangedSort = false; // once true, geolocation resolving no longer overrides the user's sort choice

const CACHES_BY_NAME = CACHES.slice().sort((a, b) => a.n.localeCompare(b.n, 'et'));
let CACHES_BY_DISTANCE = null;
let userLat = null;
let userLon = null;

// ─── Found-caches storage ───────────────────────────────────────────────
// User-specific "which caches have I found" data never ships with the page
// (it's not part of CACHES), so it lives in local storage instead. Kept
// behind this interface so the backend (e.g. a SQLite file) can change later
// without touching the rest of the app.
const FindsStore = (function() {
  const KEY = 'gcFindsV1';
  function load() {
    let raw;
    try {
      raw = localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !parsed.finds) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }
  function save(finds) {
    localStorage.setItem(KEY, JSON.stringify({ finds: finds, uploadedAt: new Date().toISOString() }));
  }
  function getFinds() {
    const rec = load();
    return rec ? rec.finds : {};
  }
  function getCount() {
    return Object.keys(getFinds()).length;
  }
  function getUploadedAt() {
    const rec = load();
    return rec ? rec.uploadedAt : null;
  }
  function hasData() {
    return getCount() > 0;
  }
  return { save, getFinds, getCount, getUploadedAt, hasData };
})();

// Whether the "hide my finds" checkbox itself was last checked/unchecked —
// separate from the finds data, so it survives independently of it.
const HideFindsPref = (function() {
  const KEY = 'gcHideFindsPrefV1';
  function get() {
    let v;
    try {
      v = localStorage.getItem(KEY);
    } catch (e) {
      return true;
    }
    return v === null ? true : v === '1';
  }
  function set(checked) {
    localStorage.setItem(KEY, checked ? '1' : '0');
  }
  return { get, set };
})();

let FOUND_SET = new Set();
let FOUND_IN_ESTONIA_COUNT = 0;
function rebuildFoundSet() {
  FOUND_SET = new Set(Object.keys(FindsStore.getFinds()));
  FOUND_IN_ESTONIA_COUNT = 0;
  for (let i = 0; i < CACHES.length; i++) {
    if (FOUND_SET.has(CACHES[i].g)) FOUND_IN_ESTONIA_COUNT++;
  }
}
rebuildFoundSet();

function isFound(c) {
  return !!c.g && FOUND_SET.has(c.g);
}

function hideFoundActive() {
  return hideFoundWrap.style.display !== 'none' && hideFoundChk.checked;
}

function refreshHideFoundVisibility() {
  const has = FindsStore.hasData();
  hideFoundWrap.style.display = has ? '' : 'none';
  hideFoundChk.checked = has && HideFindsPref.get();
}
refreshHideFoundVisibility();

const OWNER_COUNTS = {};
for (let i = 0; i < CACHES.length; i++) {
  const o = CACHES[i].o;
  if (o) OWNER_COUNTS[o] = (OWNER_COUNTS[o] || 0) + 1;
}

// Size is stored as an integer (not the Estonian name) so the display text
// can be swapped for other locales later without touching the data.
const SIZE_NAMES = { 0: 'Muu', 1: 'Mikro', 2: 'Väike', 3: 'Normaalne', 4: 'Suur' };
const SIZE_LETTERS = { 0: 'o', 1: 'm', 2: 'v', 3: 'n', 4: 'l' };

// Map-view pin color by cache type (c.ty holds the Estonian type_name — see
// TYPE_NAME_TO_KEY in build_search.py). Only the three most common types get
// their own color; everything else (virtual, wherigo, letterbox, reverse,
// webcam) shares the "other" color.
function cachePinColor(ty) {
  if (ty === 'Tavaline') return 'green';   // traditional
  if (ty === 'Mõistatus') return 'black';  // mystery
  if (ty === 'Multi') return 'orange';     // multi-cache
  return 'yellow';                         // everything else
}

function getCachePinIcon(color) {
  if (!cachePinIcons) {
    cachePinIcons = {};
    ['green', 'black', 'orange', 'yellow'].forEach(function(c) {
      cachePinIcons[c] = L.divIcon({
        className: '',
        html: '<div class="cache-pin-wrap"><div class="cache-pin ' + c + '"></div></div>',
        iconSize: [22, 30], iconAnchor: [11, 30]
      });
    });
  }
  return cachePinIcons[color];
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = deg => deg * Math.PI / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function formatDistance(km) {
  if (km < 1) return Math.round(km * 1000) + ' m';
  if (km < 10) return km.toFixed(1) + ' km';
  return Math.round(km) + ' km';
}

// The origin is a user-facing setting (see Settings → "Kauguse arvutamine"):
// either the device's current location, or a point picked by double-clicking
// the search map (see "Map view" — setMapOrigin() adds/selects the 'map'
// option here). Distance and distance-sort both read whichever is selected.
function currentOrigin() {
  if (originSel.value === 'map' && customOriginLat != null) {
    return { lat: customOriginLat, lon: customOriginLon };
  }
  if (originSel.value === 'current' && userLat != null) {
    return { lat: userLat, lon: userLon };
  }
  return null;
}

function distanceFor(c) {
  const origin = currentOrigin();
  if (!origin || c.lat == null) return null;
  return formatDistance(haversineKm(origin.lat, origin.lon, c.lat, c.lon));
}

function rebuildDistanceSort() {
  const origin = currentOrigin();
  if (!origin) {
    CACHES_BY_DISTANCE = null;
    distOpt.disabled = true;
    return;
  }
  CACHES_BY_DISTANCE = CACHES.slice().sort((a, b) => {
    const da = a.lat != null ? haversineKm(origin.lat, origin.lon, a.lat, a.lon) : Infinity;
    const db = b.lat != null ? haversineKm(origin.lat, origin.lon, b.lat, b.lon) : Infinity;
    return da - db;
  });
  distOpt.disabled = false;
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(pos) {
    userLat = pos.coords.latitude;
    userLon = pos.coords.longitude;
    rebuildDistanceSort();
    updateUserLocationMarker();
    if (!userChangedSort) {
      sortSel.value = 'distance';
      sortDir = DEFAULT_SORT_DIR.distance;
      updateSortDirBtn();
    }
    render(qEl.value.trim());
  });
}

function matchesToken(c, token, searchOwner, searchRegion) {
  const qU = token.toUpperCase();
  const qNoGC = qU.startsWith('GC') ? qU.slice(2) : qU;
  if (c.n.toUpperCase().includes(qU)) return true;
  if (searchOwner && c.o.toUpperCase().includes(qU)) return true;
  if (searchRegion && c.r && c.r.toUpperCase().includes(qU)) return true;
  if (c.g) {
    if (c.g.includes(qU)) return true;
    if (c.g.slice(2).includes(qNoGC)) return true;
  }
  return false;
}

function matches(c, q, searchOwner, searchRegion) {
  const tokens = q.split(/\s+/).filter(Boolean);
  return tokens.every(token => matchesToken(c, token, searchOwner, searchRegion));
}

function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function escAttr(s) {
  return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// iPadOS Safari reports navigator.platform as 'MacIntel' just like a real Mac —
// the maxTouchPoints check is the standard way to tell them apart.
function isIOSDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}
const IS_IOS = isIOSDevice();

// Organic Maps' route deep link requires an explicit source point — there's no
// "use current location" shorthand — so we can only build a real route once
// geolocation has resolved (userLat/userLon). Without it, fall back to a plain
// "show this point" link.
//
// The route link uses the om:// custom scheme rather than the https://omaps.app
// mirror: omaps.app's web fallback (shown when the app isn't installed, or when
// window.open() doesn't hand off to the app) does NOT actually render a route
// preview — it always shows the same fixed placeholder location near the Bering
// Strait regardless of the coordinates given (confirmed by testing several very
// different sll/dll pairs and getting an identical, wrong pin every time). A
// custom-scheme link has no such broken web fallback: if the app is installed it
// opens directly and correctly; if not, the navigation is simply a no-op instead
// of confidently showing the wrong place. The "show this point" fallback below
// uses the https://omaps.app/map endpoint instead, since that one's web preview
// was verified to render the correct location.
function organicMapsUrl(c) {
  const name = encodeURIComponent(c.n);
  if (userLat != null) {
    return 'om://route?v=1&sll=' + userLat + ',' + userLon +
      '&saddr=' + encodeURIComponent('Praegune asukoht') +
      '&dll=' + c.lat + ',' + c.lon + '&daddr=' + name + '&type=pedestrian';
  }
  return 'https://omaps.app/map?v=1&ll=' + c.lat + ',' + c.lon + '&n=' + name;
}

const NAV_LONG_PRESS_MS = 500;
const navMenuEl = document.getElementById('navMenu');
const navBackdropEl = document.getElementById('navBackdrop');

function openNavMenu(btn, alts) {
  const rect = btn.getBoundingClientRect();
  openNavMenuAt(rect.left + rect.width / 2, rect.bottom, alts);
}

function openNavMenuAt(x, y, alts) {
  navMenuEl.innerHTML = alts.map(function(a) {
    return '<a href="' + esc(a.url) + '" target="_blank">' + esc(a.label) + '</a>';
  }).join('');
  const menuW = 200;
  let left = x - menuW / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - menuW - 8));
  navMenuEl.style.left = left + 'px';
  navMenuEl.style.top = (y + 8) + 'px';
  navMenuEl.style.width = menuW + 'px';
  navBackdropEl.classList.add('visible');
  navMenuEl.classList.add('visible');
}

function closeNavMenu() {
  navMenuEl.classList.remove('visible');
  navBackdropEl.classList.remove('visible');
}

navBackdropEl.addEventListener('click', closeNavMenu);
navMenuEl.addEventListener('click', function(e) {
  if (e.target.closest('a')) setTimeout(closeNavMenu, 150);
});

function bindNavButton(btn) {
  const defaultUrl = btn.dataset.default;
  const alts = JSON.parse(btn.dataset.alts);
  let timer = null;
  let longPressed = false;

  function start(e) {
    e.stopPropagation();
    longPressed = false;
    timer = setTimeout(function() {
      longPressed = true;
      openNavMenu(btn, alts);
    }, NAV_LONG_PRESS_MS);
  }
  function end(e) {
    e.stopPropagation();
    clearTimeout(timer);
    if (!longPressed) window.open(defaultUrl, '_blank');
  }
  function cancel() {
    clearTimeout(timer);
    longPressed = false;
  }

  btn.addEventListener('mousedown', start);
  btn.addEventListener('mouseup', end);
  btn.addEventListener('mouseleave', cancel);
  btn.addEventListener('touchstart', function(e) { e.preventDefault(); start(e); }, { passive: false });
  btn.addEventListener('touchend', function(e) { e.preventDefault(); end(e); }, { passive: false });
  btn.addEventListener('touchcancel', cancel);
  btn.addEventListener('click', function(e) { e.stopPropagation(); e.preventDefault(); });
}

const RENDER_CAP = 200;

function render(q) {
  openCacheMaps.forEach(function(m) { m.remove(); });
  openCacheMaps = [];
  const searchOwner = ownerChk.checked;
  const searchRegion = regionChk.checked;
  const hideFound = hideFoundActive();
  const source = sortSel.value === 'name' ? CACHES_BY_NAME
    : (sortSel.value === 'distance' && CACHES_BY_DISTANCE) ? CACHES_BY_DISTANCE
    : CACHES;
  let results = q ? source.filter(c => matches(c, q, searchOwner, searchRegion)) : source.slice();
  if (hideFound) results = results.filter(c => !isFound(c));
  if (sortDir === 'desc') results.reverse();

  const totalCount = hideFound ? CACHES.length - FOUND_IN_ESTONIA_COUNT : CACHES.length;

  const mapPrefix = mapViewActive ? '🗺️ ' : '';

  if (!results.length) {
    countEl.textContent = mapPrefix + '0 / ' + totalCount;
    listEl.innerHTML = '<div id="empty">Tulemusi ei leitud</div>';
    lastShown = [];
    if (mapViewActive) updateMapMarkers(lastShown);
    return;
  }

  const capped = results.length > RENDER_CAP;
  const shown = capped ? results.slice(0, RENDER_CAP) : results;
  lastShown = shown;

  countEl.textContent = mapPrefix + (capped
    ? shown.length + ' / ' + results.length + ' — täpsusta otsingut'
    : (q ? results.length + ' / ' + totalCount : totalCount + ' peitu'));

  const rows = [];
  for (let i = 0; i < shown.length; i++) {
    const c = shown[i];
    const icon = ICONS[c.ty] ? '<img src="' + ICONS[c.ty] + '" alt="">' : '';
    const listDist = distanceFor(c);
    rows.push(
      '<div class="row" onclick="toggle(this)">' +
        '<div class="row-main">' +
          icon +
          '<span class="gc">' + (c.g || '—') + '</span>' +
          '<span class="name">' + esc(c.n) + '</span>' +
          (listDist ? '<span class="dist">' + listDist + '</span>' : '') +
          '<span class="dt">' + c.d + '/' + c.t + (c.sz != null ? '/' + SIZE_LETTERS[c.sz] : '') + '</span>' +
        '</div>' +
        '<div class="detail">' +
          '<div class="title-row"><b>' + esc(c.n) + '</b>' +
            (c.g || c.gp ? '<span class="title-links">' +
              (c.g ? '<a href="https://coord.info/' + c.g + '" target="_blank">GC</a>' : '') +
              (c.gp ? '<a href="https://www.geopeitus.ee/aare/' + c.gp + '" target="_blank">GP</a>' : '') +
              '</span>' : '') + '</div>' +
          '<div><b>Tüüp:</b> ' + esc(c.ty) +
            (c.sz != null ? ' · <b>Suurus:</b> ' + SIZE_NAMES[c.sz].toLowerCase() : '') + '</div>' +
          (c.r ? '<div><b>Aadress:</b> ' + esc(c.r) + '</div>' : '') +
          '<div class="coord"><b>Koordinaadid:</b> ' +
            '<button type="button" class="coordbtn" data-coords="' + esc(c.la + ' ' + c.lo) + '" onclick="event.stopPropagation(); copyCoords(this)">' + c.la + ' · ' + c.lo + ' 📋</button>' +
            (listDist ? ' <span class="dist">' + listDist + '</span>' : '') +
            (c.lat != null ? (function() {
              const wazeUrl = 'https://waze.com/ul?ll=' + c.lat + ',' + c.lon + '&navigate=yes';
              const gmapsUrl = 'https://www.google.com/maps/dir/?api=1&destination=' + c.lat + ',' + c.lon + '&travelmode=driving';
              const maaametUrl = 'https://xgis.maaamet.ee/xgis2/page/app/maainfo?lat=' + c.lat + '&lon=' + c.lon + '&moot=2000';
              const osmUrl = 'https://www.openstreetmap.org/?mlat=' + c.lat + '&mlon=' + c.lon + '&zoom=15';
              const rmkUrl = 'https://rmk-loodusegakoos-veebikaart.rmk.ee/?command=show#map=15/' + c.lat + '/' + c.lon;
              const driveAlts = [{label:'google maps', url: gmapsUrl}, {label:'waze', url: wazeUrl}];
              // Organic Maps' om:// deep link only does anything on a device that has the
              // app installed — on desktop it's just dead weight, so Google Maps takes
              // over as the default there instead, and organic maps drops out of the menu.
              let mapDefault, mapAlts;
              if (IS_IOS) {
                const omUrl = organicMapsUrl(c);
                mapDefault = omUrl;
                mapAlts = [{label:'maaamet', url: maaametUrl}, {label:'rmk', url: rmkUrl}, {label:'osm', url: osmUrl},
                           {label:'google maps', url: gmapsUrl}, {label:'organic maps', url: omUrl}];
              } else {
                mapDefault = gmapsUrl;
                mapAlts = [{label:'maaamet', url: maaametUrl}, {label:'rmk', url: rmkUrl}, {label:'osm', url: osmUrl},
                           {label:'google maps', url: gmapsUrl}];
              }
              return ' <button type="button" class="navbtn" data-default="' + escAttr(wazeUrl) + '" data-alts="' + escAttr(JSON.stringify(driveAlts)) + '">🚗 Sõida</button>' +
                     ' <button type="button" class="navbtn" data-default="' + escAttr(mapDefault) + '" data-alts="' + escAttr(JSON.stringify(mapAlts)) + '">🗺️ Kaart</button>';
            })() : '') +
          '</div>' +
          (c.lat != null ? '<div class="cachemap" id="cache-map-' + i + '" data-lat="' + c.lat + '" data-lon="' + c.lon + '"></div>' : '') +
          '<div><b>Peidetud:</b> ' + c.h + ' by ' + esc(c.o) +
            (OWNER_COUNTS[c.o] ? ' <span class="ownercount">' + OWNER_COUNTS[c.o] + '</span>' : '') + '</div>' +
        '</div>' +
      '</div>'
    );
  }
  listEl.innerHTML = rows.join('');
  listEl.querySelectorAll('.navbtn').forEach(bindNavButton);
  if (mapViewActive) updateMapMarkers(lastShown);
}

function toggle(row) {
  const opening = !row.classList.contains('open');
  row.classList.toggle('open');
  if (opening) {
    const mapDiv = row.querySelector('.cachemap');
    if (mapDiv) ensureCacheMap(mapDiv);
  }
}
// Rows use inline onclick="toggle(this)" (see esc()-built row markup below),
// which resolves names from global scope — expose it since it's declared
// inside initApp()'s function scope now.
window.toggle = toggle;

// Native/Leaflet 'dblclick' doesn't reliably fire from a real double-tap on
// iOS Safari (a double-tap is usually consumed by the browser's own
// double-tap-to-zoom gesture before it becomes a JS event). Instead we
// detect two 'click' events arriving close together ourselves — 'click'
// already fires reliably from a tap once double-tap-to-zoom is disabled via
// `touch-action: manipulation` (see CSS), and this works identically for a
// real mouse double-click.
function bindDoubleTap(el, handler) {
  let lastTap = 0;
  el.addEventListener('click', function(e) {
    e.stopPropagation(); // don't let either tap bubble to the row's onclick
    const now = Date.now();
    if (now - lastTap < 400) {
      lastTap = 0;
      handler(e);
    } else {
      lastTap = now;
    }
  });
}

function ensureCacheMap(mapDiv) {
  if (!mapDiv) return;
  if (mapDiv._map) { mapDiv._map.invalidateSize(); return; }
  if (!leafletLoaded) { pendingCacheMapDivs.push(mapDiv); return; }
  if (!document.body.contains(mapDiv)) return;
  const lat = parseFloat(mapDiv.dataset.lat);
  const lon = parseFloat(mapDiv.dataset.lon);
  const map = L.map(mapDiv, { zoomControl: false, doubleClickZoom: false });
  map.fitBounds(ESTONIA_BOUNDS); // whole-Estonia view, sized to the container; only the marker moves per cache
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);
  L.marker([lat, lon]).addTo(map);
  bindDoubleTap(mapDiv, function() { openFullMap(lat, lon); });
  mapDiv._map = map;
  openCacheMaps.push(map);
}

function ensureFullMap() {
  if (fullMap || !leafletLoaded) return;
  const fullMapEl = document.getElementById('fullmap-map');
  fullMap = L.map(fullMapEl, { doubleClickZoom: false });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(fullMap);
  fullMapMarker = L.marker([58.5, 25.0]).addTo(fullMap);
  bindDoubleTap(fullMapEl, function() { showView(previousView); });
}

function openFullMap(lat, lon) {
  if (!leafletLoaded) return; // no map to show while offline; nothing to do
  previousView = currentView;
  showView('fullmap');
  ensureFullMap();
  fullMap.invalidateSize();
  fullMap.setView([lat, lon], FULLMAP_ZOOM);
  fullMapMarker.setLatLng([lat, lon]);
}

// ─── Map view (all currently matching results on one map) ─────────────────
// #mapview sits below the sticky #top bar rather than as its own full-screen
// view, so the search box/filters/sort stay visible and usable while it's
// showing — its top offset is set to #top's rendered height instead of a
// fixed value since that height varies (owner/region toggles, wrapping).
function positionMapView() {
  mapviewEl.style.top = topEl.offsetHeight + 'px';
}

function ensureSearchMap() {
  if (searchMap) { searchMap.invalidateSize(); return; }
  if (!leafletLoaded) return; // ensureLeaflet's onload finishes the init once it's ready
  searchMap = L.map(mapCanvasEl, { doubleClickZoom: false });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(searchMap);
  searchMap.fitBounds(ESTONIA_BOUNDS);
  // Same click-timing double-tap detection as bindDoubleTap (see there for why
  // Leaflet's own 'dblclick' isn't used) — but bound to the map itself, since
  // we need the actual click's latlng, not just "was the map double-tapped".
  searchMap.on('click', function(e) {
    const now = Date.now();
    if (now - lastMapClickAt < 400) {
      lastMapClickAt = 0;
      setMapOrigin(e.latlng.lat, e.latlng.lng);
    } else {
      lastMapClickAt = now;
    }
  });
  updateUserLocationMarker(); // geolocation may have already resolved before the map existed
}

// Small blue dot for the device's actual current position — distinct from
// `originMarker` above, which marks wherever distances are being calculated
// from (the default 'current' origin has no marker of its own; this dot is
// the only on-map indicator of where the device physically is).
function updateUserLocationMarker() {
  if (!searchMap || userLat == null) return;
  if (!userLocationMarker) {
    // A plain L.marker + divIcon (like the cache pins), not L.circleMarker —
    // circleMarker draws into Leaflet's overlayPane, which sits *below* the
    // markerPane cache pins live in, so it would end up hidden under any
    // overlapping pin. zIndexOffset keeps it on top of other markers too,
    // regardless of Leaflet's default latitude-based marker stacking.
    const dotIcon = L.divIcon({
      className: '', html: '<div class="user-location-dot"></div>',
      iconSize: [14, 14], iconAnchor: [7, 7]
    });
    userLocationMarker = L.marker([userLat, userLon], { icon: dotIcon, zIndexOffset: 1000 }).addTo(searchMap);
    userLocationMarker.bindTooltip('Praegune asukoht');
  } else {
    userLocationMarker.setLatLng([userLat, userLon]);
  }
}

// Double-clicking the map picks a new distance-calculation origin, reflected
// in the Settings → "Kauguse arvutamine" selector as a 'map' option labeled
// with the clicked coordinates. Uses Leaflet's default (blue) marker icon,
// left un-styled so it stays visually distinct from the colored cache pins.
function setMapOrigin(lat, lon) {
  customOriginLat = lat;
  customOriginLon = lon;
  if (!originMarker) {
    originMarker = L.marker([lat, lon]).addTo(searchMap);
    originMarker.bindTooltip('Lähtepunkt');
  } else {
    originMarker.setLatLng([lat, lon]);
  }
  let opt = document.getElementById('originMapOpt');
  if (!opt) {
    opt = document.createElement('option');
    opt.id = 'originMapOpt';
    opt.value = 'map';
    originSel.appendChild(opt);
  }
  opt.textContent = ccFmtDMM(lat, lon);
  originSel.value = 'map';
  rebuildDistanceSort();
  render(qEl.value.trim());
}

function updateMapMarkers(list) {
  if (!searchMap) return;
  searchMapMarkers.forEach(function(m) { m.remove(); });
  searchMapMarkers = [];
  const pts = [];
  list.forEach(function(c) {
    if (c.lat == null) return;
    const marker = L.marker([c.lat, c.lon], { icon: getCachePinIcon(cachePinColor(c.ty)) }).addTo(searchMap);
    marker.bindTooltip(c.n);
    marker.on('click', function(e) {
      const alts = [];
      if (c.g) alts.push({ label: 'Ava GC.com', url: 'https://coord.info/' + c.g });
      if (c.gp) alts.push({ label: 'Ava Geopeitus', url: 'https://www.geopeitus.ee/aare/' + c.gp });
      if (!alts.length) return;
      const pt = searchMap.latLngToContainerPoint(e.latlng);
      const mapRect = mapCanvasEl.getBoundingClientRect();
      openNavMenuAt(mapRect.left + pt.x, mapRect.top + pt.y, alts);
    });
    searchMapMarkers.push(marker);
    pts.push([c.lat, c.lon]);
  });
  if (pts.length) {
    searchMap.fitBounds(pts, { padding: [30, 30], maxZoom: 16 });
  } else {
    searchMap.fitBounds(ESTONIA_BOUNDS);
  }
}

function showMapView() {
  mapViewActive = true;
  listEl.style.display = 'none';
  mapviewEl.style.display = '';
  positionMapView();
  ensureSearchMap();
  render(qEl.value.trim());
}

function showListView() {
  mapViewActive = false;
  mapviewEl.style.display = 'none';
  listEl.style.display = '';
  render(qEl.value.trim());
}

bindDoubleTap(countEl, function() {
  if (mapViewActive) showListView(); else showMapView();
});

window.addEventListener('resize', function() {
  if (!mapViewActive) return;
  positionMapView();
  if (searchMap) searchMap.invalidateSize();
});

function copyCoords(btn) {
  navigator.clipboard.writeText(btn.dataset.coords).then(function() {
    const orig = btn.textContent;
    btn.style.width = btn.offsetWidth + 'px'; // lock width so ✅ doesn't reflow the rest of the line
    btn.textContent = '✅';
    setTimeout(function() {
      btn.textContent = orig;
      btn.style.width = '';
    }, 1200);
  });
}
// Same inline-onclick reasoning as window.toggle above.
window.copyCoords = copyCoords;

function updateSortDirBtn() {
  sortDirBtn.textContent = sortDir === 'desc' ? '⬇️' : '⬆️';
}

let renderTimer = null;
qEl.addEventListener('input', function() {
  clearTimeout(renderTimer);
  const val = qEl.value.trim();
  renderTimer = setTimeout(function() { render(val); }, 100);
});
ownerChk.addEventListener('change', function() { render(qEl.value.trim()); });
regionChk.addEventListener('change', function() { render(qEl.value.trim()); });
hideFoundChk.addEventListener('change', function() {
  HideFindsPref.set(hideFoundChk.checked);
  render(qEl.value.trim());
});
sortSel.addEventListener('change', function() {
  userChangedSort = true;
  sortDir = DEFAULT_SORT_DIR[sortSel.value];
  updateSortDirBtn();
  render(qEl.value.trim());
});
originSel.addEventListener('change', function() { rebuildDistanceSort(); render(qEl.value.trim()); });
sortDirBtn.addEventListener('click', function() {
  userChangedSort = true;
  sortDir = sortDir === 'desc' ? 'asc' : 'desc';
  updateSortDirBtn();
  render(qEl.value.trim());
});
updateSortDirBtn();
render('');

// ─── Views (search / tools menu / coordinate converter / full map) ─────────
// Path-shaped hash routes, e.g. #/tools/coordinates/conversion — a real path
// would need a server-side rewrite for the very first (pre-service-worker)
// load of a deep link, which we can't rely on, so the routing lives entirely
// in the fragment. The empty/root hash just redirects to /search for now —
// kept separate so the root can be repurposed later without touching search's
// own route. 'fullmap' needs a specific lat/lon so it stays a session-only
// overlay, not deep-linkable, and never touches the hash.
const VIEW_TO_PATH = {
  search: '/search',
  menu: '/tools',
  coord: '/tools/coordinates/conversion',
  proj: '/tools/coordinates/projection',
  settings: '/settings',
  origin: '/settings/distance',
  data: '/settings/data',
};
const PATH_TO_VIEW = Object.fromEntries(Object.entries(VIEW_TO_PATH).map(function(e) { return [e[1], e[0]]; }));

function isRootPath(path) { return path === '' || path === '/'; }

function applyView(name) {
  currentView = name;
  document.getElementById('view-search').style.display = name === 'search' ? '' : 'none';
  document.getElementById('view-menu').style.display = name === 'menu' ? '' : 'none';
  document.getElementById('view-coord').style.display = name === 'coord' ? '' : 'none';
  document.getElementById('view-proj').style.display = name === 'proj' ? '' : 'none';
  document.getElementById('view-settings').style.display = name === 'settings' ? '' : 'none';
  document.getElementById('view-origin').style.display = name === 'origin' ? '' : 'none';
  document.getElementById('view-data').style.display = name === 'data' ? '' : 'none';
  document.getElementById('view-fullmap').style.display = name === 'fullmap' ? '' : 'none';
  if (name === 'coord' && leafletLoaded) ccInitMap();
  if (name === 'proj' && leafletLoaded) pjInitMap();
  if (name === 'data') refreshDataView();
}

function showView(name) {
  applyView(name);
  const path = VIEW_TO_PATH[name];
  if (!path) return; // e.g. 'fullmap' — session-only, leave the URL alone
  const target = '#' + path;
  if (location.hash !== target) location.hash = target;
}

window.addEventListener('hashchange', function() {
  const path = location.hash.slice(1);
  if (isRootPath(path)) { location.hash = '#' + VIEW_TO_PATH.search; return; }
  applyView(PATH_TO_VIEW[path] || 'search');
});

document.getElementById('menuBtn').addEventListener('click', function() { showView('menu'); });
document.getElementById('menuBackBtn').addEventListener('click', function() { showView('search'); });
document.getElementById('coordMenuItem').addEventListener('click', function() { showView('coord'); });
document.getElementById('coordBackBtn').addEventListener('click', function() { showView('search'); });
document.getElementById('projMenuItem').addEventListener('click', function() { showView('proj'); });
document.getElementById('projBackBtn').addEventListener('click', function() { showView('search'); });
document.getElementById('settingsMenuItem').addEventListener('click', function() { showView('settings'); });
document.getElementById('settingsBackBtn').addEventListener('click', function() { showView('search'); });
document.getElementById('originMenuItem').addEventListener('click', function() { showView('origin'); });
document.getElementById('originBackBtn').addEventListener('click', function() { showView('settings'); });
document.getElementById('dataMenuItem').addEventListener('click', function() { showView('data'); });
document.getElementById('dataBackBtn').addEventListener('click', function() { showView('settings'); });

// Honor a deep link on initial load instead of always defaulting to search.
(function() {
  const initialPath = location.hash.slice(1);
  if (isRootPath(initialPath)) { location.hash = '#' + VIEW_TO_PATH.search; return; }
  const initialView = PATH_TO_VIEW[initialPath];
  if (initialView) applyView(initialView);
})();

// ─── Settings → Data (found-caches JSON upload) ─────────────────────────
const dataStatusEl = document.getElementById('dataStatus');
const dataMsgEl = document.getElementById('dataMsg');
const dataFileInput = document.getElementById('dataFileInput');
const dataLoadBtn = document.getElementById('dataLoadBtn');

function formatUploadedAt(iso) {
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear() +
    ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function refreshDataView() {
  const count = FindsStore.getCount();
  const uploadedAt = FindsStore.getUploadedAt();
  dataStatusEl.innerHTML = (count ? '<div>' + count + ' leidu</div>' : '<div>Andmeid ei ole</div>') +
    (uploadedAt ? '<div>Laaditud: ' + formatUploadedAt(uploadedAt) + '</div>' : '');
  dataMsgEl.textContent = '';
  dataMsgEl.className = 'data-msg';
}

// Expected shape: { "GC-code": [foundDateString, logText], ... }
function isValidFindsShape(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  for (const key in obj) {
    const v = obj[key];
    if (!Array.isArray(v) || v.length !== 2) return false;
    if (typeof v[0] !== 'string' || typeof v[1] !== 'string') return false;
  }
  return true;
}

dataLoadBtn.addEventListener('click', function() { dataFileInput.click(); });

dataFileInput.addEventListener('change', function() {
  const file = dataFileInput.files[0];
  dataFileInput.value = '';
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function() {
    let parsed;
    try {
      parsed = JSON.parse(reader.result);
    } catch (e) {
      dataMsgEl.textContent = 'Fail ei ole korrektne JSON';
      dataMsgEl.className = 'data-msg err';
      return;
    }
    if (!isValidFindsShape(parsed)) {
      dataMsgEl.textContent = 'Fail ei vasta oodatud vormingule';
      dataMsgEl.className = 'data-msg err';
      return;
    }
    FindsStore.save(parsed);
    rebuildFoundSet();
    refreshHideFoundVisibility();
    refreshDataView();
    dataMsgEl.textContent = 'Andmed laaditud (' + Object.keys(parsed).length + ' leidu)';
    dataMsgEl.className = 'data-msg ok';
    render(qEl.value.trim());
  };
  reader.onerror = function() {
    dataMsgEl.textContent = 'Faili lugemine ebaõnnestus';
    dataMsgEl.className = 'data-msg err';
  };
  reader.readAsText(file);
});

// ─── Coordinate converter map (ported from coordinate-converter.html) ──────
function ccInitMap() {
  if (ccLeafMap) return;
  ccLeafMap = L.map('cc-map', { zoomControl: true }).setView([58.5, 25.0], 7);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(ccLeafMap);
  ccLeafMarker = L.marker([58.5, 25.0]).addTo(ccLeafMap);
}

function ccMapUpdate(lat, lon) {
  ccPendingLatLon = { lat: lat, lon: lon };
  if (!ccLeafMap) return;
  const wrap = document.getElementById('cc-map-wrap');
  if (wrap.style.display === 'none') {
    wrap.style.display = '';
    ccLeafMap.invalidateSize();
  }
  ccLeafMap.setView([lat, lon], 15);
  ccLeafMarker.setLatLng([lat, lon]);
}

// L-EST97 projection (Lambert Conformal Conic, EPSG:3301)
const ccLcc = (function() {
  const a = 6378137.0;
  const f = 1 / 298.257222101;
  const e2 = 2 * f - f * f;
  const e = Math.sqrt(e2);
  const R = Math.PI / 180;
  const phi1 = 59.33333333333334 * R;
  const phi2 = 58.0 * R;
  const phi0 = 57.51755393055556 * R;
  const lam0 = 24.0 * R;
  const E0 = 500000, N0 = 6375000;
  const mFn = function(phi) { return Math.cos(phi) / Math.sqrt(1 - e2 * Math.sin(phi) ** 2); };
  const tFn = function(phi) {
    const sp = Math.sin(phi);
    return Math.tan(Math.PI / 4 - phi / 2) / ((1 - e * sp) / (1 + e * sp)) ** (e / 2);
  };
  const m1 = mFn(phi1), m2 = mFn(phi2);
  const t1 = tFn(phi1), t2 = tFn(phi2);
  const n = (Math.log(m1) - Math.log(m2)) / (Math.log(t1) - Math.log(t2));
  const F = m1 / (n * t1 ** n);
  const r0 = a * F * tFn(phi0) ** n;
  return {
    toXY: function(lat, lon) {
      const phi = lat * R, lam = lon * R;
      const r = a * F * tFn(phi) ** n;
      const th = n * (lam - lam0);
      return { x: Math.round(E0 + r * Math.sin(th)), y: Math.round(N0 + r0 - r * Math.cos(th)) };
    },
    toLatLon: function(x, y) {
      const dx = x - E0;
      const dy = r0 - (y - N0);
      const rp = Math.sign(n) * Math.hypot(dx, dy);
      const tp = (rp / (a * F)) ** (1 / n);
      const lam = Math.atan2(dx, dy) / n + lam0;
      let phi = Math.PI / 2 - 2 * Math.atan(tp);
      for (let i = 0; i < 12; i++) {
        const sp = Math.sin(phi);
        phi = Math.PI / 2 - 2 * Math.atan(tp * ((1 - e * sp) / (1 + e * sp)) ** (e / 2));
      }
      return { lat: phi / R, lon: lam / R };
    }
  };
})();

function ccFmtDMM(lat, lon) {
  const ns = lat >= 0 ? 'N' : 'S', ew = lon >= 0 ? 'E' : 'W';
  const la = Math.abs(lat), lo = Math.abs(lon);
  const ld = Math.floor(la), lm = (la - ld) * 60;
  const od = Math.floor(lo), om = (lo - od) * 60;
  return ns + ' ' + ccPad2(ld) + '° ' + lm.toFixed(3) + '′  ' + ew + ' ' + ccPad3(od) + '° ' + om.toFixed(3) + '′';
}
function ccFmtDD(lat, lon) { return lat.toFixed(6) + ', ' + lon.toFixed(6); }
function ccFmtLEST(x, y) { return x + ', ' + y; }
function ccPad2(n) { return String(n).padStart(2, '0'); }
function ccPad3(n) { return String(n).padStart(3, '0'); }

function ccValidLL(lat, lon) { return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180; }
function ccValidLEST(x, y) { return x >= 300000 && x <= 800000 && y >= 6300000 && y <= 6800000; }

function ccNorm(s) {
  return s
    .replace(/[°º˚]/g, '°')
    .replace(/[′ʹ']/g, "'")
    .replace(/[″ʺ"]/g, '"')
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/\s+/g, ' ')
    .trim();
}

function ccParseDMS(s) {
  const re = /([NS])\s*(\d{1,3})°\s*(\d{1,2})'\s*(\d{1,2}(?:\.\d+)?)"?\s*([EW])\s*(\d{1,3})°\s*(\d{1,2})'\s*(\d{1,2}(?:\.\d+)?)/i;
  const m = s.match(re);
  if (!m) return null;
  const lat = (m[1].toUpperCase() === 'N' ? 1 : -1) * (parseFloat(m[2]) + parseFloat(m[3]) / 60 + parseFloat(m[4]) / 3600);
  const lon = (m[5].toUpperCase() === 'E' ? 1 : -1) * (parseFloat(m[6]) + parseFloat(m[7]) / 60 + parseFloat(m[8]) / 3600);
  return ccValidLL(lat, lon) ? { lat: lat, lon: lon } : null;
}

function ccParseDMM(s) {
  const re1 = /([NS])\s*(\d{1,3})°\s*(\d{1,2}(?:\.\d+)?)'?\s*([EW])\s*(\d{1,3})°\s*(\d{1,2}(?:\.\d+)?)/i;
  let m = s.match(re1);
  if (m) {
    const lat = (m[1].toUpperCase() === 'N' ? 1 : -1) * (parseFloat(m[2]) + parseFloat(m[3]) / 60);
    const lon = (m[4].toUpperCase() === 'E' ? 1 : -1) * (parseFloat(m[5]) + parseFloat(m[6]) / 60);
    if (ccValidLL(lat, lon)) return { lat: lat, lon: lon };
  }
  const re2 = /([NS])\s*(\d{1,3})\s+(\d{1,2}(?:\.\d+)?)\s*([EW])\s*(\d{1,3})\s+(\d{1,2}(?:\.\d+)?)/i;
  m = s.match(re2);
  if (m) {
    const lat = (m[1].toUpperCase() === 'N' ? 1 : -1) * (parseFloat(m[2]) + parseFloat(m[3]) / 60);
    const lon = (m[4].toUpperCase() === 'E' ? 1 : -1) * (parseFloat(m[5]) + parseFloat(m[6]) / 60);
    if (ccValidLL(lat, lon)) return { lat: lat, lon: lon };
  }
  return null;
}

function ccParseDMMNoHemi(s) {
  // DMM without N/S/E/W letters (lat then lon); Estonia is entirely N/E so
  // hemisphere is assumed positive.
  const re1 = /(\d{1,3})°\s*(\d{1,2}(?:\.\d+)?)'?\s+(\d{1,3})°\s*(\d{1,2}(?:\.\d+)?)'?/;
  let m = s.match(re1);
  if (m) {
    const lat = parseFloat(m[1]) + parseFloat(m[2]) / 60;
    const lon = parseFloat(m[3]) + parseFloat(m[4]) / 60;
    if (ccValidLL(lat, lon)) return { lat: lat, lon: lon };
  }
  const re2 = /(\d{1,3})\s+(\d{1,2}(?:\.\d+)?)\s+(\d{1,3})\s+(\d{1,2}(?:\.\d+)?)/;
  m = s.match(re2);
  if (m) {
    const lat = parseFloat(m[1]) + parseFloat(m[2]) / 60;
    const lon = parseFloat(m[3]) + parseFloat(m[4]) / 60;
    if (ccValidLL(lat, lon)) return { lat: lat, lon: lon };
  }
  return null;
}

function ccParseDD(s) {
  const re = /([+-]?\d{1,3}\.\d+)\s*[NS]?\s*[,; ]\s*([+-]?\d{1,3}\.\d+)\s*[EW]?/i;
  const m = s.match(re);
  if (!m) return null;
  const lat = parseFloat(m[1]), lon = parseFloat(m[2]);
  return ccValidLL(lat, lon) ? { lat: lat, lon: lon } : null;
}

function ccParseLEST(s) {
  const re = /\b(\d{5,7})\b\s*[,; ]\s*\b(\d{6,7})\b/;
  const m = s.match(re);
  if (!m) return null;
  const a = parseInt(m[1]), b = parseInt(m[2]);
  if (ccValidLEST(a, b)) return ccLcc.toLatLon(a, b);
  if (ccValidLEST(b, a)) return ccLcc.toLatLon(b, a);
  return null;
}

function ccDetect(raw) {
  if (!raw.trim()) return null;
  const s = ccNorm(raw);
  const r1 = ccParseDD(s);
  if (r1) return Object.assign({}, r1, { fmt: 'DD' });
  if (/°/.test(s) || /[NS].{0,10}[EW]/i.test(s)) {
    const r = ccParseDMM(s);
    if (r) return Object.assign({}, r, { fmt: 'DMM' });
  }
  if (/"/.test(s) || (s.match(/'/g) || []).length >= 2) {
    const r = ccParseDMS(s);
    if (r) return Object.assign({}, r, { fmt: 'DMS' });
  }
  const r4 = ccParseLEST(s);
  if (r4) return Object.assign({}, r4, { fmt: 'L-EST97' });
  const r5 = ccParseDMM(s);
  if (r5) return Object.assign({}, r5, { fmt: 'DMM' });
  if (!/[NSEW]/i.test(s)) {
    const r6 = ccParseDMMNoHemi(s);
    if (r6) return Object.assign({}, r6, { fmt: 'DMM' });
  }
  return null;
}

const ccInpEl = document.getElementById('cc-inp');
const ccStatusEl = document.getElementById('cc-status');
const ccBadgeEl = document.getElementById('cc-badge');
const ccDmmEl = document.getElementById('cc-out-dmm');
const ccDdEl = document.getElementById('cc-out-dd');
const ccLestEl = document.getElementById('cc-out-lest');

function ccClearOutputs() {
  ccDmmEl.value = ccDdEl.value = ccLestEl.value = '';
  ccStatusEl.textContent = '';
  ccStatusEl.className = 'cc-status';
  ccBadgeEl.style.display = 'none';
}

ccInpEl.addEventListener('input', function() {
  const val = ccInpEl.value;
  if (!val.trim()) { ccClearOutputs(); return; }
  const result = ccDetect(val);
  if (result) {
    const xy = ccLcc.toXY(result.lat, result.lon);
    ccDmmEl.value = ccFmtDMM(result.lat, result.lon);
    ccDdEl.value = ccFmtDD(result.lat, result.lon);
    ccLestEl.value = ccFmtLEST(xy.x, xy.y);
    ccMapUpdate(result.lat, result.lon);
    ccStatusEl.textContent = 'Tuvastati: ' + result.fmt;
    ccStatusEl.className = 'cc-status ok';
    ccBadgeEl.textContent = result.fmt;
    ccBadgeEl.style.display = '';
  } else {
    ccClearOutputs();
    ccStatusEl.textContent = 'Formaati ei tuvastatud';
    ccStatusEl.className = 'cc-status err';
  }
});

function ccCopyField(id, btn) {
  const val = document.getElementById(id).value;
  if (!val) return;
  navigator.clipboard.writeText(val).then(function() {
    const orig = btn.textContent;
    btn.textContent = 'Kopeeritud!';
    btn.classList.add('copied');
    setTimeout(function() { btn.textContent = orig; btn.classList.remove('copied'); }, 1500);
  });
}
document.getElementById('cc-copy-dmm-btn').addEventListener('click', function() { ccCopyField('cc-out-dmm', this); });
document.getElementById('cc-copy-dd-btn').addEventListener('click', function() { ccCopyField('cc-out-dd', this); });
document.getElementById('cc-copy-lest-btn').addEventListener('click', function() { ccCopyField('cc-out-lest', this); });

document.getElementById('cc-paste-btn').addEventListener('click', function() {
  navigator.clipboard.readText().then(function(t) {
    ccInpEl.value = t;
    ccInpEl.dispatchEvent(new Event('input'));
  });
});

const ccLocBtn = document.getElementById('cc-loc-btn');
if ('geolocation' in navigator) ccLocBtn.style.display = '';

ccLocBtn.addEventListener('click', function() {
  ccLocBtn.textContent = '…';
  ccLocBtn.disabled = true;
  navigator.geolocation.getCurrentPosition(
    function(pos) {
      ccInpEl.value = ccFmtDD(pos.coords.latitude, pos.coords.longitude);
      ccInpEl.dispatchEvent(new Event('input'));
      ccLocBtn.textContent = '⌖';
      ccLocBtn.disabled = false;
    },
    function(err) {
      ccStatusEl.textContent = 'Asukoht pole saadaval';
      ccStatusEl.className = 'cc-status err';
      ccLocBtn.textContent = '⌖';
      ccLocBtn.disabled = false;
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

// ─── Coordinates projection (start point + bearing/distance → destination) ─
function pjInitMap() {
  if (pjLeafMap) return;
  pjLeafMap = L.map('pj-map', { zoomControl: true }).setView([58.5, 25.0], 7);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(pjLeafMap);
  const sIcon = L.divIcon({
    className: '',
    html: '<div class="sp-pin-wrap"><div class="sp-pin-shape s"></div><div class="sp-pin-letter">S</div></div>',
    iconSize: [30, 40], iconAnchor: [15, 40]
  });
  const pIcon = L.divIcon({
    className: '',
    html: '<div class="sp-pin-wrap"><div class="sp-pin-shape p"></div><div class="sp-pin-letter">P</div></div>',
    iconSize: [30, 40], iconAnchor: [15, 40]
  });
  pjSMarker = L.marker([58.5, 25.0], { icon: sIcon }).addTo(pjLeafMap);
  pjPMarker = L.marker([58.5, 25.0], { icon: pIcon }).addTo(pjLeafMap);
  pjLine = L.polyline([[58.5, 25.0], [58.5, 25.0]], { color: '#0a84ff', weight: 2, dashArray: '4,6' }).addTo(pjLeafMap);
}

function pjMapUpdate(sLat, sLon, pLat, pLon) {
  pjPendingPoints = { sLat: sLat, sLon: sLon, pLat: pLat, pLon: pLon };
  if (!pjLeafMap) return;
  const wrap = document.getElementById('pj-map-wrap');
  if (wrap.style.display === 'none') {
    wrap.style.display = '';
    pjLeafMap.invalidateSize();
  }
  pjSMarker.setLatLng([sLat, sLon]);
  pjPMarker.setLatLng([pLat, pLon]);
  pjLine.setLatLngs([[sLat, sLon], [pLat, pLon]]);
  pjLeafMap.fitBounds([[sLat, sLon], [pLat, pLon]], { padding: [40, 40], maxZoom: 17 });
}

// Destination point given a start point, compass bearing (0-360°, clockwise
// from true north) and distance in metres. Spherical approximation — same
// model haversineKm already uses elsewhere in this app.
function pjDestinationPoint(lat, lon, bearingDeg, distM) {
  const R = 6371000;
  const brng = bearingDeg * Math.PI / 180;
  const lat1 = lat * Math.PI / 180, lon1 = lon * Math.PI / 180;
  const dR = distM / R;
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(dR) + Math.cos(lat1) * Math.sin(dR) * Math.cos(brng));
  const lon2 = lon1 + Math.atan2(
    Math.sin(brng) * Math.sin(dR) * Math.cos(lat1),
    Math.cos(dR) - Math.sin(lat1) * Math.sin(lat2)
  );
  return { lat: lat2 * 180 / Math.PI, lon: ((lon2 * 180 / Math.PI) + 540) % 360 - 180 };
}

const pjInpEl = document.getElementById('pj-inp');
const pjAngleEl = document.getElementById('pj-angle');
const pjDistEl = document.getElementById('pj-dist');
const pjStatusEl = document.getElementById('pj-status');
const pjBadgeEl = document.getElementById('pj-badge');
const pjOutEl = document.getElementById('pj-out');

function pjRecompute() {
  const val = pjInpEl.value;
  if (!val.trim()) {
    pjOutEl.value = '';
    pjStatusEl.textContent = '';
    pjStatusEl.className = 'cc-status';
    pjBadgeEl.style.display = 'none';
    return;
  }
  const result = ccDetect(val);
  if (!result) {
    pjOutEl.value = '';
    pjStatusEl.textContent = 'Formaati ei tuvastatud';
    pjStatusEl.className = 'cc-status err';
    pjBadgeEl.style.display = 'none';
    return;
  }
  pjStatusEl.textContent = 'Tuvastati: ' + result.fmt;
  pjStatusEl.className = 'cc-status ok';
  pjBadgeEl.textContent = result.fmt;
  pjBadgeEl.style.display = '';

  const angle = parseFloat(pjAngleEl.value);
  const dist = parseFloat(pjDistEl.value);
  if (isNaN(angle) || isNaN(dist)) {
    pjOutEl.value = '';
    return;
  }
  const dest = pjDestinationPoint(result.lat, result.lon, angle, dist);
  pjOutEl.value = ccFmtDMM(dest.lat, dest.lon);
  pjMapUpdate(result.lat, result.lon, dest.lat, dest.lon);
}

pjInpEl.addEventListener('input', pjRecompute);
pjAngleEl.addEventListener('input', pjRecompute);
pjDistEl.addEventListener('input', pjRecompute);

document.getElementById('pj-copy-out-btn').addEventListener('click', function() { ccCopyField('pj-out', this); });

document.getElementById('pj-paste-btn').addEventListener('click', function() {
  navigator.clipboard.readText().then(function(t) {
    pjInpEl.value = t;
    pjRecompute();
  });
});

const pjLocBtn = document.getElementById('pj-loc-btn');
if ('geolocation' in navigator) pjLocBtn.style.display = '';

pjLocBtn.addEventListener('click', function() {
  pjLocBtn.textContent = '…';
  pjLocBtn.disabled = true;
  navigator.geolocation.getCurrentPosition(
    function(pos) {
      pjInpEl.value = ccFmtDD(pos.coords.latitude, pos.coords.longitude);
      pjRecompute();
      pjLocBtn.textContent = '⌖';
      pjLocBtn.disabled = false;
    },
    function(err) {
      pjStatusEl.textContent = 'Asukoht pole saadaval';
      pjStatusEl.className = 'cc-status err';
      pjLocBtn.textContent = '⌖';
      pjLocBtn.disabled = false;
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

} // end initApp

const countEl0 = document.getElementById('count');
if (countEl0) countEl0.textContent = 'Laen andmeid…';

function loadData() {
  fetch('./data.json')
    .then(function(res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
    .then(function(data) {
      initApp(data.caches);
      const versionEl = document.getElementById('settingsVersion');
      if (versionEl) versionEl.textContent = data.version;
    })
    .catch(function(err) {
      const listEl0 = document.getElementById('list');
      if (countEl0) countEl0.textContent = '';
      listEl0.innerHTML = '<div id="empty">Andmete laadimine ebaõnnestus.<br>Kontrolli internetiühendust ja proovi uuesti.'
        + '<br><button type="button" id="dataRetryBtn" class="data-load-btn" style="display:inline-block;margin-top:12px">Proovi uuesti</button></div>';
      document.getElementById('dataRetryBtn').addEventListener('click', loadData);
    });
}
loadData();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').catch(function() {});
  });
}
