// Map-pin icons: mirrors geocaching.com's own cache-type artwork and colors
// (glyph + per-type circle color extracted from geocaching.com's live icon
// sprite, /app/ui-icons/sprites/cache-types.svg — Groundspeak-owned, kept
// inline for personal offline use only) so pins look like the icons GC.com
// users already know, instead of the list view's separate icon set above.
// Found caches (see isFound()) get a flat yellow pin regardless of type.
const GC_PIN_TYPES = {
  "traditional": { color: "#02874d", glyph: "<path d=\"M37.43 16.444a.435.435 0 0 0-.429-.441c-.409-.01-11.518.006-11.518.006l-15.117 3.683s-.367.092-.367.736v1.919c0 .708.613.662.613.662l.237.049v6.693c0 1.659 1.138 3.017 2.561 3.017h8.58c.425 0 .819-.133 1.174-.345l.005.015 11.092-4.594c2.279-1.027 2.36-1.854 2.319-3.492 0-.193-.009-.404-.009-.635V18.63c.169-.06.601-.101.61-.11.006-.004.257-.092.257-.423 0-.401-.008-1.221-.008-1.653zM21.588 30.988h-7.749c-.696 0-1.259-.744-1.259-1.66v-6.269h10.268v6.269c0 .915-.564 1.66-1.26 1.66zm13.276-6.963c.03 1.31-.12 1.587-1.535 2.216l-8.814 3.707c.03-.193.049-.391.049-.593l.006-6.297s.658-.373.857-.441c1.846-.633 6.784-2.412 9.424-3.365v4.105c0 .244.005.466.013.668z\" fill=\"#fff\"/>" },
  "multi": { color: "#e98300", glyph: "<path d=\"M31.536 20.961a372.68 372.68 0 0 0-2.624-.005c-2.709 0-6.372.005-6.372.005l-12.061 2.285s-.294.07-.294.568v.918c0 .484.375.514.467.514h.02l.379.045v5.437c0 1.296.924 2.348 2.057 2.348h6.557c.339 0 .656-.105.937-.271l.005.013 8.463-3.065c1.822-.794 1.857-1.541 1.857-2.709l-.003-4.345c.137-.051.59-.064.596-.073.004-.005.226-.073.226-.328V21.21c.001-.177-.2-.249-.21-.249zM18.691 31.333h-4.92c-.55 0-.991-.56-.991-1.276v-4.766h6.912l.003 4.747c0 .717-.452 1.295-1.004 1.295zm10.517-4.883c-.011.569-.095 1.231-1.223 1.72l-6.616 2.264s.051-.231.051-.391v-4.752l7.776-2.121c.003.318.025 2.604.012 3.28zm8.325-10.293l-12.657-1.234s-8.969 1.323-9.291 1.361c-.01 0-.206.095-.21.28v1.416c0 .263.216.309.217.313.013.006.519.03.652.07l.238.016h-.247l.003 1.632 1.732-.232-.006-1.298 10.472.717s.766.035 1.225.035c.118 0 .215-.003.274-.009 2.237-.215 4.047-.436 5.319-.607l-.005 4.035c0 .725-.447.837-.995.888l-1.627.309c.001.162.003.211.009.353.005.218.007.905.001 1.092l2.293-.309c1.122-.102 2.032-1.253 2.032-2.561l.01-4.053.364-.057s.484-.01.484-.566c0-.274 0-.747.003-1.04-.001-.506-.29-.551-.29-.551z\" fill=\"#fff\"/>" },
  "mystery": { color: "#12508c", glyph: "<path d=\"M23.128 11.52c-6.949 0-8.254 4.578-8.251 6.659 0 2.497 1.737 3.329 3.909 3.329 2.268 0 3.04-1.628 3.04-2.497s-.434-2.497-2.606-2.497c0-.869 1.424-1.665 3.909-1.665 2.606 0 3.909 1.665 3.909 3.329 0 1.665-.469 2.456-2.606 4.162-2.606 2.081-3.474 3.329-3.474 4.994-.002.832 0 1.23 0 1.665 0 .416.869.832 1.737.832.869 0 1.737-.416 1.737-.832 0-1.739-.013-2.515 3.909-4.994 3.909-2.497 4.777-3.746 4.777-5.827-.001-2.496-1.304-6.658-9.99-6.658zm-.448 19.961c-1.441 0-2.608 1.119-2.608 2.499s1.168 2.5 2.608 2.5c1.44 0 2.608-1.119 2.608-2.5s-1.168-2.499-2.608-2.499z\" fill=\"#fff\"/>" },
  "virtual": { color: "#009bbb", glyph: "<path d=\"M31.507 19.387c0 .104.005-.104 0 0zm.631 9.216c3.473-3.267 4.14-8.031 2.599-8.414-1.088-.27-1.667.708-3.201 2-.029-1.061-.029-1.932-.029-2.802 0-4.316-2.201-8.022-7.234-8.022s-7.333 3.55-7.333 8.241c.003.09-.111 1.392-.214 2.797-1.734-1.396-2.315-2.5-3.463-2.215-1.615.401-.807 5.616 3.116 8.875l.088.041c-.109 1.722-.323 3.37-.73 4.564-1.432 4.192 3.726 1.362 4.87 1.362 1.312 0 2.598 1.586 4.441 1.604 1.935.019 2.067-1.081 4.037-1.604 1.232-.327 5.606 3.122 4.037-2.407a52.134 52.134 0 0 1-.984-4.02zm-11.531-8.815c0-1.108.542-2.006 1.211-2.006s1.211.898 1.211 2.006c0 1.107-.542 2.006-1.211 2.006s-1.211-.898-1.211-2.006zm3.633 5.558c-.988 0-2.091-.84-2.091-1.504 0-.665 1.103.201 2.091.201s2.019-.908 2.019-.243-1.031 1.546-2.019 1.546zm2.422-3.552c-.669 0-1.211-.898-1.211-2.006 0-1.108.542-2.006 1.211-2.006s1.211.898 1.211 2.006c.001 1.108-.542 2.006-1.211 2.006z\" fill=\"#fff\"/>" },
  "wherigo": { color: "#12508c", glyph: "<g fill=\"#fff\"><path d=\"M24.571 12.192c-6.461 0-11.7 5.093-11.7 11.373 0 6.282 5.24 11.374 11.7 11.374 6.462 0 11.701-5.092 11.701-11.374-.001-6.28-5.239-11.373-11.701-11.373zm.417 15.812l-5.139-4.998 8.894-3.65-3.755 8.648z\"/><path d=\"M25.206 9.12l-.178 2.669c2.559.149 4.985.994 7.06 2.44l1.677-2.147a16.56 16.56 0 0 0-8.559-2.962zm10.306 4.372a21.778 21.778 0 0 0-.557-.493l-1.884 1.982c.17.143.345.279.51.43.132.123.247.256.372.382l2.057-1.792c-.168-.167-.321-.346-.498-.509zm-.735 3.205c1.61 1.942 2.568 4.221 2.847 6.556l.564-.039c-.338-2.584-1.397-4.572-3.097-6.282l-.314-.235zm3.516 7.793l-.582-.015c.007.399-.001.798-.032 1.196l.6.068c.024-.42.027-.835.014-1.249zM34.19 33.3l.582.549a12.802 12.802 0 0 0 3.367-6.835l-.616-.127A12.192 12.192 0 0 1 34.19 33.3zm-1.895 1.592l.489.672c.354-.247.695-.514 1.024-.799l-.538-.615a12.71 12.71 0 0 1-.975.742zm-7.373 2.332c-.3.004-.596-.014-.892-.028l-.054 1.108c2.696-.005 5.375-.694 7.679-2.02l-.425-.733a13.454 13.454 0 0 1-6.308 1.673zm-3.703.844c.45.08.901.138 1.354.176l.178-1.169a15.336 15.336 0 0 1-1.225-.224l-.307 1.217zm-7.021-5.674l-1.366 1.034a14.538 14.538 0 0 0 3.147 2.652 14.526 14.526 0 0 0 3.872 1.682l.453-1.255a13.61 13.61 0 0 1-4.995-2.938c-.403-.373-.766-.77-1.111-1.175zM12.802 30.4l-1.608.795c.232.389.483.77.752 1.138l1.497-.92a12.368 12.368 0 0 1-.641-1.013zm-1.466-8.12l-2.112-.373a14.684 14.684 0 0 0 1.312 8.057l1.713-.659a12.408 12.408 0 0 1-.913-7.025zm.628-2.341l-2.117-.798c-.148.447-.274.898-.377 1.352l2.123.587c.106-.385.23-.766.371-1.141zm2.845-4.381a13.056 13.056 0 0 1 6.479-3.491l-.576-2.439c-3.85.957-7.342 3.146-9.428 6.464a14.425 14.425 0 0 0-.91 1.705l2.084 1.017a12.365 12.365 0 0 1 2.351-3.256zm7.395-6.235l.336 2.536a13.87 13.87 0 0 1 1.231-.089l-.093-2.627c-.493.038-.984.098-1.474.18z\"/></g>" },
  "letterbox": { color: "#12508c", glyph: "<path d=\"M12.48 16.32v.8l8.94 6 1.17.8L24.18 25l1.58-1.06 1.17-.8 8.94-6v-.8zm0 2.4v10.4L20.17 24l-7.69-5.26zm11.7 8l-2.84-1.94-8.86 5.94h23.4L27 24.78l-2.84 1.94zm11.7 2.4v-10.4L28.19 24l7.69 5.14z\" fill=\"#fff\"/>" },
  "webcam": { color: "#009bbb", glyph: "<path d=\"M24.038 18.879c-1.997 0-3.616 1.593-3.616 3.559 0 1.966 1.619 3.559 3.616 3.559s3.616-1.593 3.616-3.559c0-1.965-1.619-3.559-3.616-3.559zm3.982 12.622c3.566-1.529 6.061-5.026 6.061-9.099 0-5.48-4.513-9.922-10.08-9.922s-10.08 4.442-10.08 9.922c0 4.073 2.495 7.572 6.062 9.1-2.444.908-4.377 2.433-4.377 3.583 0 .222.09.436.443.436h15.954a.428.428 0 0 0 .443-.436c-.001-1.151-1.963-2.677-4.426-3.584zm-4.007-3.916c-2.902 0-5.255-2.315-5.255-5.172s2.353-5.172 5.255-5.172 5.254 2.315 5.254 5.172-2.352 5.172-5.254 5.172z\" fill=\"#fff\"/>" },
  "unknown": { color: "#87705a", glyph: "<path d=\"M25.204 17.157c-6.201-1.093-12.114 3.047-13.207 9.248s3.047 12.114 9.248 13.208c6.201 1.093 12.114-3.047 13.207-9.248 1.093-6.202-3.048-12.115-9.248-13.208zm-1.818 2.285l-2.116 1.504-.575-1.419-.223-1.182-.852 1.302-1.34-.045.619-.511-.27-.142-2.08 2.019.605 1.044.94-1.905 1.146.614.315 1.826.007-.001-.006.009.1.578-.331-.219.231-.359-.001-.008-.911.123s.227.694.162.686c-.26-.028-.863.15-.863.15-.614.399-1.757 1.758-1.757 1.758l-.172.873-.746-.749-.736.071-.515 1.374.462.279.589-.297.461.778-.022.693 1.037.112 1.949.597.995 2.088.766.555-1.552 1.807-.96 2.1-.78.663-.242.556-1.088-1.242.073-1.771-.708-2.319.002-1.542.933-.752-2.131-2.131-.893-1.565s.234-2.329 4.296-5.665c3.523-2.894 7.354-1.841 7.354-1.841l-.856 1.357-.316.149zm4.813 14.854l-1.041 1.383-1.652 1.036-.508-1.616.039-2.364-.324-2.416-1.475.051-.854-1.751.731-1.252 1.242-1.427.509-.22.735.177.629.062.396.77 1.885.341s.058-.017.719 1.041c.661 1.058.634 1.256.634 1.256l-.488.819-.294.048.849.274-1.732 3.788zm3.539-6.157l-.998-.049s-.156-.713-.625-1.078c-.469-.365-1.548-.913-1.548-.913L27.955 26l-.355-.661-.48.506-.066-.302-.534.027-.769-1.145-.78.12-.505.359-.446-.114.155-.586.72.012.308-.971-.488-.223.123-.714-.468.08.518-.239-.051-.432.135-.097.388 1.333.821-.258.092-.548.195.566.832.017.557-1.219-.195-.021-.076-.578-.706 1.446-.41-.641-.134.143-.339-.496 2.188-1.811 1.655 1.143 1.005.232s1.442 1.258 1.986 3.865c.545 2.607.843 4.081.843 4.081l-.915 2.045-1.021-2.78zm-3.62-18.991l-1.03 5.844 7.82-1.634-6.79-4.21zm-2.791 7.164c.241.042.557-.173.557-.173l1.352-7.665-.984-.173-1.352 7.665c.001 0 .187.304.427.346z\" fill=\"#fff\"/>" }
};
const FOUND_PIN_COLOR = "#ffd60a";
const DISABLED_PIN_COLOR = "#b8b8b8";

// ─── Leaflet (shared by cache-detail maps and the coordinate converter) ────
// Self-hosted (./vendor/leaflet) and precached by the service worker, so
// repeat map opens work offline. Loaded lazily — only once the user actually
// opens a view that needs a map — instead of on every app start.
let leafletLoaded = false;
let leafletLoading = false;
let leafletReadyHandler = null; // wired up by initApp() once its map state exists

function ensureLeaflet() {
  if (leafletLoaded || leafletLoading) return;
  leafletLoading = true;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = './vendor/leaflet/leaflet.css';
  document.head.appendChild(link);
  const script = document.createElement('script');
  script.src = './vendor/leaflet/leaflet.js';
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

function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function escAttr(s) {
  return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function agoText(dateStr) {
  const days = Math.floor((Date.now() - Date.parse(dateStr + 'T00:00:00')) / 86400000);
  if (days < 31) return t(days === 1 ? 'agoDay' : 'agoDays', { n: days });
  if (days < 365) {
    const m = Math.floor(days / 30);
    return t(m === 1 ? 'agoMonth' : 'agoMonths', { n: m });
  }
  const y = Math.floor(days / 365);
  return t(y === 1 ? 'agoYear' : 'agoYears', { n: y });
}

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
const MAP_FOCUS_ZOOM = 17; // close enough for on-the-spot cache finding

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
const viewToggleBtn = document.getElementById('viewToggleBtn');
const hideFoundBtn = document.getElementById('hideFoundBtn');
const hideDisabledBtn = document.getElementById('hideDisabledBtn');
const idToggleBtn = document.getElementById('idToggleBtn');
const dtsToggleBtn = document.getElementById('dtsToggleBtn');
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

// Factory for a persisted on/off preference, defaulting to `def` until the
// user has explicitly toggled it at least once.
function boolPref(key, def) {
  function get() {
    let v;
    try {
      v = localStorage.getItem(key);
    } catch (e) {
      return def;
    }
    return v === null ? def : v === '1';
  }
  function set(on) {
    localStorage.setItem(key, on ? '1' : '0');
  }
  return { get, set };
}

// Whether the "hide my finds" checkbox itself was last checked/unchecked —
// separate from the finds data, so it survives independently of it.
const HideFindsPref = boolPref('gcHideFindsPrefV1', true);
const HideDisabledPref = boolPref('gcHideDisabledPrefV1', false);
const ShowIdPref = boolPref('gcShowIdPrefV1', true);
const ShowDtsPref = boolPref('gcShowDtsPrefV1', true);

let FOUND_SET = new Set();
function rebuildFoundSet() {
  FOUND_SET = new Set(Object.keys(FindsStore.getFinds()));
}
rebuildFoundSet();

function isFound(c) {
  return !!c.g && FOUND_SET.has(c.g);
}

function hideFoundActive() {
  return hideFoundBtn.style.display !== 'none' && hideFoundBtn.getAttribute('aria-pressed') === 'true';
}

function refreshHideFoundVisibility() {
  const has = FindsStore.hasData();
  hideFoundBtn.style.display = has ? '' : 'none';
  hideFoundBtn.setAttribute('aria-pressed', String(has && HideFindsPref.get()));
}
refreshHideFoundVisibility();

function hideDisabledActive() {
  return hideDisabledBtn.getAttribute('aria-pressed') === 'true';
}
hideDisabledBtn.setAttribute('aria-pressed', String(HideDisabledPref.get()));

// Showing/hiding the GC id and D/T/S columns only affects which CSS class is
// on #list — the row markup itself always includes both, so no re-render is
// needed when these are toggled.
idToggleBtn.setAttribute('aria-pressed', String(ShowIdPref.get()));
dtsToggleBtn.setAttribute('aria-pressed', String(ShowDtsPref.get()));
function refreshFieldVisibility() {
  listEl.classList.toggle('hide-id', idToggleBtn.getAttribute('aria-pressed') !== 'true');
  listEl.classList.toggle('hide-dts', dtsToggleBtn.getAttribute('aria-pressed') !== 'true');
}
refreshFieldVisibility();

const OWNER_COUNTS = {};
for (let i = 0; i < CACHES.length; i++) {
  const o = CACHES[i].o;
  if (o) OWNER_COUNTS[o] = (OWNER_COUNTS[o] || 0) + 1;
}

// Size is stored as an integer (not the Estonian name) so the display text
// can be swapped for other locales later without touching the data — see
// sizeLabel() in i18n.js.
const SIZE_LETTERS = { 0: 'o', 1: 'm', 2: 'v', 3: 'n', 4: 'l' };

// Difficulty/terrain rating thresholds for the flyout's colored badges.
// Orange covers [orangeMin, redMin]; red is anything above redMin.
const DIFFICULTY_ORANGE_MIN = 3.0;
const DIFFICULTY_RED_MIN = 4.0;
const TERRAIN_ORANGE_MIN = 3.5;
const TERRAIN_RED_MIN = 4.0;

// Log messages that are just a generic thank-you (matched case-insensitively,
// after trimming whitespace) start with their quote section collapsed —
// there's nothing worth reading. Anything else starts expanded.
const LOW_INFO_LOG_PHRASES = ['tftc', 'found it'];

function isLowInfoLog(text) {
  const norm = text.trim().toLowerCase();
  return LOW_INFO_LOG_PHRASES.some(function(p) { return p.toLowerCase() === norm; });
}

function ratingBadgeClass(value, orangeMin, redMin) {
  const v = parseFloat(value);
  if (isNaN(v)) return '';
  if (v > redMin) return 'rating-red';
  if (v >= orangeMin) return 'rating-orange';
  return '';
}

function ratingValueHtml(value, orangeMin, redMin) {
  const cls = ratingBadgeClass(value, orangeMin, redMin);
  return cls ? '<span class="rating-badge ' + cls + '">' + esc(value) + '</span>' : esc(value);
}

// Only micro (orange) and other (green) get a colored badge; small/regular/large are plain text.
function sizeValueHtml(sz) {
  const label = esc(sizeLabel(sz).toLowerCase());
  if (sz === 1) return '<span class="size-badge size-orange">' + label + '</span>';
  if (sz === 0) return '<span class="size-badge size-green">' + label + '</span>';
  return label;
}

// Cache attribute icons (dogs allowed, kid friendly, etc.) for the detail
// panel. Vendored locally under ./vendor/attributes/ (see that directory and
// sw.js's precache list) from geocaching.com's own /images/attributes/
// artwork so they work offline — fine for personal use but not meant to be
// redistributed. c.at entries are slugs, negated ones ("no" icon variant)
// prefixed with "!".
function attrsRowHtml(at) {
  if (!at || !at.length) return '';
  return '<div class="attrs-row">' + at.map(function(a) {
    const negated = a.charAt(0) === '!';
    const slug = negated ? a.slice(1) : a;
    const src = './vendor/attributes/' + slug + '-' + (negated ? 'no' : 'yes') + '.png';
    const label = attributeLabel(slug, negated);
    return '<img class="attr-icon' + (negated ? ' attr-no' : '') + '" loading="lazy" src="' + src + '" alt="" title="' + escAttr(label) + '">';
  }).join('') + '</div>';
}

// Small round type icon for the search-results list row, using the same
// glyph/color artwork as the map pins (GC_PIN_TYPES) instead of the old
// separate icons/*.png set, so both views agree on what each type looks like.
// Disabled caches render gray and found caches render yellow, same as their
// map pin (disabled takes priority over found, same as getCachePinIcon).
function cacheTypeIconHtml(ty, disabled, found) {
  const type = GC_PIN_TYPES[ty] || GC_PIN_TYPES['traditional'];
  const bg = disabled ? DISABLED_PIN_COLOR : (found ? FOUND_PIN_COLOR : type.color);
  return '<span class="type-icon" style="background:' + bg + '">' +
    '<svg viewBox="0 0 48 48">' + type.glyph + '</svg></span>';
}

// Map-view pin icon by cache type (c.ty holds the English type code — see
// GC_PIN_TYPES above). Falls back to the traditional-cache glyph for any
// type not in the map. Found caches always render as a flat yellow pin,
// regardless of type, so found status reads at a glance on the map.
// Disabled caches take priority over found and always render as a flat
// gray pin instead.
function getCachePinIcon(ty, found, disabled) {
  if (!cachePinIcons) cachePinIcons = {};
  const key = ty + (disabled ? ':disabled' : (found ? ':found' : ''));
  if (!cachePinIcons[key]) {
    const type = GC_PIN_TYPES[ty] || GC_PIN_TYPES['traditional'];
    const bg = disabled ? DISABLED_PIN_COLOR : (found ? FOUND_PIN_COLOR : type.color);
    cachePinIcons[key] = L.divIcon({
      className: '',
      html: '<div class="cache-pin-wrap"><div class="cache-pin" style="background:' + bg + '">' +
        '<svg viewBox="0 0 48 48">' + type.glyph + '</svg></div></div>',
      iconSize: [22, 30], iconAnchor: [11, 30]
    });
  }
  return cachePinIcons[key];
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

function matchesToken(c, token) {
  const qU = token.toUpperCase();
  const qNoGC = qU.startsWith('GC') ? qU.slice(2) : qU;
  if (c.n.toUpperCase().includes(qU)) return true;
  if (c.g) {
    if (c.g.includes(qU)) return true;
    if (c.g.slice(2).includes(qNoGC)) return true;
  }
  return false;
}

function matches(c, q) {
  const tokens = q.split(/\s+/).filter(Boolean);
  return tokens.every(token => matchesToken(c, token));
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
function organicMapsUrl(lat, lon, name) {
  const encName = encodeURIComponent(name);
  if (userLat != null) {
    return 'om://route?v=1&sll=' + userLat + ',' + userLon +
      '&saddr=' + encodeURIComponent(t('currentLocationOption')) +
      '&dll=' + lat + ',' + lon + '&daddr=' + encName + '&type=pedestrian';
  }
  return 'https://omaps.app/map?v=1&ll=' + lat + ',' + lon + '&n=' + encName;
}

// Shared by the cache-list "Map" button and the standalone Maps buttons on
// the coordinate converter/projection pages — builds the default tap target
// plus the long-press alternative-apps menu for a given point.
function mapNavData(lat, lon, name) {
  const gmapsUrl = 'https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lon + '&travelmode=driving';
  const maaametUrl = 'https://xgis.maaamet.ee/xgis2/page/app/maainfo?lat=' + lat + '&lon=' + lon + '&moot=2000';
  const osmUrl = 'https://www.openstreetmap.org/?mlat=' + lat + '&mlon=' + lon + '&zoom=15';
  const rmkUrl = 'https://rmk-loodusegakoos-veebikaart.rmk.ee/?command=show#map=15/' + lat + '/' + lon;
  // Organic Maps' om:// deep link only does anything on a device that has the
  // app installed — on desktop it's just dead weight, so Google Maps takes
  // over as the default there instead, and organic maps drops out of the menu.
  if (IS_IOS) {
    const omUrl = organicMapsUrl(lat, lon, name);
    return {
      default: omUrl,
      alts: [{label:'maaamet', url: maaametUrl}, {label:'rmk', url: rmkUrl}, {label:'osm', url: osmUrl},
             {label:'google maps', url: gmapsUrl}, {label:'organic maps', url: omUrl}]
    };
  }
  return {
    default: gmapsUrl,
    alts: [{label:'maaamet', url: maaametUrl}, {label:'rmk', url: rmkUrl}, {label:'osm', url: osmUrl},
           {label:'google maps', url: gmapsUrl}]
  };
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

// Reads data-default/data-alts off the button at press time (not bind time),
// so callers can update those attributes later — e.g. the coordinate
// converter's Maps button, which is bound once but repoints as the user types.
function bindNavButton(btn) {
  let timer = null;
  let longPressed = false;

  function start(e) {
    e.stopPropagation();
    longPressed = false;
    timer = setTimeout(function() {
      longPressed = true;
      openNavMenu(btn, JSON.parse(btn.dataset.alts));
    }, NAV_LONG_PRESS_MS);
  }
  function end(e) {
    e.stopPropagation();
    clearTimeout(timer);
    if (!longPressed) window.open(btn.dataset.default, '_blank');
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

function render(q, focusLatLon) {
  openCacheMaps.forEach(function(m) { m.remove(); });
  openCacheMaps = [];
  const hideFound = hideFoundActive();
  const hideDisabled = hideDisabledActive();
  const source = sortSel.value === 'name' ? CACHES_BY_NAME
    : (sortSel.value === 'distance' && CACHES_BY_DISTANCE) ? CACHES_BY_DISTANCE
    : CACHES;
  let results = q ? source.filter(c => matches(c, q)) : source.slice();
  if (hideFound) results = results.filter(c => !isFound(c));
  if (hideDisabled) results = results.filter(c => !c.disabled);
  if (sortDir === 'desc') results.reverse();

  const totalCount = CACHES.filter(c =>
    (!hideFound || !isFound(c)) && (!hideDisabled || !c.disabled)
  ).length;

  if (!results.length) {
    countEl.textContent = '0 / ' + totalCount;
    listEl.innerHTML = '<div id="empty">' + esc(t('noResults')) + '</div>';
    lastShown = [];
    if (mapViewActive) updateMapMarkers(lastShown, focusLatLon);
    return;
  }

  const capped = results.length > RENDER_CAP;
  const shown = capped ? results.slice(0, RENDER_CAP) : results;
  lastShown = shown;

  countEl.innerHTML = capped
    ? '<span class="cap-badge" title="' + escAttr(t('refineSearch')) + '">' + RENDER_CAP + '</span> / ' + results.length
    : esc(q ? results.length + ' / ' + totalCount : totalCount + ' ' + t('cachesSuffix'));

  const rows = [];
  for (let i = 0; i < shown.length; i++) {
    const c = shown[i];
    const icon = cacheTypeIconHtml(c.ty, c.disabled, isFound(c));
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
          (c.disabled ? '<div class="disabled-badge">⚠️ ' + esc(t('disabledLabel')) + '</div>' : '') +
          '<div class="title-row"><b>' + esc(c.n) + '</b>' +
            (c.g || c.gp ? '<span class="title-links">' +
              (c.g ? '<a href="https://coord.info/' + c.g + '" target="_blank">GC</a>' : '') +
              (c.gp ? '<a href="https://www.geopeitus.ee/aare/' + c.gp + '" target="_blank">GP</a>' : '') +
              '</span>' : '') + '</div>' +
          '<div><b>' + t('typeFieldLabel') + '</b> ' + esc(typeLabel(c.ty)) +
            (c.sz != null ? ' · <b>' + t('sizeFieldLabel') + '</b> ' + sizeValueHtml(c.sz) : '') + '</div>' +
          (c.d || c.t ? '<div>' +
            (c.d ? '<b>' + t('difficultyFieldLabel') + '</b> ' + ratingValueHtml(c.d, DIFFICULTY_ORANGE_MIN, DIFFICULTY_RED_MIN) : '') +
            (c.d && c.t ? ' · ' : '') +
            (c.t ? '<b>' + t('terrainFieldLabel') + '</b> ' + ratingValueHtml(c.t, TERRAIN_ORANGE_MIN, TERRAIN_RED_MIN) : '') +
            '</div>' : '') +
          attrsRowHtml(c.at) +
          (c.r ? '<div><b>' + t('addressLabel') + '</b> ' + esc(c.r) + '</div>' : '') +
          '<div><b>' + t('hiddenLabel') + '</b> ' + c.h + ' <span class="agotext">(' + agoText(c.h) + ')</span> ' + t('byLabel') + ' ' + esc(c.o) +
            (OWNER_COUNTS[c.o] ? ' <span class="ownercount">' + OWNER_COUNTS[c.o] + '</span>' : '') + '</div>' +
          (function() {
            const find = c.g ? FindsStore.getFinds()[c.g] : null;
            if (!find) return '';
            const openClass = isLowInfoLog(find[1]) ? '' : ' open';
            return '<div class="loggedline' + openClass + '" onclick="event.stopPropagation(); toggleLog(this)">' +
              '<span class="chev">▸</span> <b>' + t('loggedLabel') + '</b> ' + find[0] + ' <span class="agotext">(' + agoText(find[0]) + ')</span>' +
              '</div>' +
              '<div class="logquote">' + esc(find[1]) + '</div>';
          })() +
          '<div class="coord"><b>' + t('coordinatesLabel') + '</b> ' +
            '<button type="button" class="coordbtn" data-coords="' + esc(c.la + ' ' + c.lo) + '" onclick="event.stopPropagation(); copyCoords(this)">' + c.la + ' · ' + c.lo + ' 📋</button>' +
            (listDist ? ' <span class="dist">' + listDist + '</span>' : '') +
            (c.lat != null ? (function() {
              const wazeUrl = 'https://waze.com/ul?ll=' + c.lat + ',' + c.lon + '&navigate=yes';
              const gmapsUrl = 'https://www.google.com/maps/dir/?api=1&destination=' + c.lat + ',' + c.lon + '&travelmode=driving';
              const driveAlts = [{label:'google maps', url: gmapsUrl}, {label:'waze', url: wazeUrl}];
              const map = mapNavData(c.lat, c.lon, c.n);
              return ' <button type="button" class="navbtn" data-default="' + escAttr(wazeUrl) + '" data-alts="' + escAttr(JSON.stringify(driveAlts)) + '">' + esc(t('driveBtn')) + '</button>' +
                     ' <button type="button" class="navbtn" data-default="' + escAttr(map.default) + '" data-alts="' + escAttr(JSON.stringify(map.alts)) + '">' + esc(t('mapBtn')) + '</button>';
            })() : '') +
          '</div>' +
          (c.lat != null ? '<div class="cachemap" id="cache-map-' + i + '" data-lat="' + c.lat + '" data-lon="' + c.lon + '" data-ty="' + escAttr(c.ty) + '" data-found="' + (isFound(c) ? '1' : '0') + '" data-disabled="' + (c.disabled ? '1' : '0') + '"></div>' : '') +
        '</div>' +
      '</div>'
    );
  }
  listEl.innerHTML = rows.join('');
  listEl.querySelectorAll('.navbtn').forEach(bindNavButton);
  if (mapViewActive) updateMapMarkers(lastShown, focusLatLon);
}

function toggle(row) {
  const opening = !row.classList.contains('open');
  if (opening) {
    listEl.querySelectorAll('.row.open').forEach(function(r) { r.classList.remove('open'); });
  }
  row.classList.toggle('open');
  if (opening) {
    const mapDiv = row.querySelector('.cachemap');
    if (mapDiv) { ensureLeaflet(); ensureCacheMap(mapDiv); }
    window.scrollTo({ top: window.scrollY + row.getBoundingClientRect().top - topEl.offsetHeight });
  }
}
// Rows use inline onclick="toggle(this)" (see esc()-built row markup below),
// which resolves names from global scope — expose it since it's declared
// inside initApp()'s function scope now.
window.toggle = toggle;

function toggleLog(el) {
  el.classList.toggle('open');
}
window.toggleLog = toggleLog;

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
  const ty = mapDiv.dataset.ty;
  const found = mapDiv.dataset.found === '1';
  const disabled = mapDiv.dataset.disabled === '1';
  const map = L.map(mapDiv, { zoomControl: false, doubleClickZoom: false });
  map.fitBounds(ESTONIA_BOUNDS); // whole-Estonia view, sized to the container; only the marker moves per cache
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);
  L.marker([lat, lon], { icon: getCachePinIcon(ty, found, disabled) }).addTo(map);
  bindDoubleTap(mapDiv, function() { focusCacheOnMap(lat, lon); });
  mapDiv._map = map;
  openCacheMaps.push(map);
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
    userLocationMarker.bindTooltip(t('currentLocationOption'));
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
    originMarker.bindTooltip(t('originPointTooltip'));
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

function updateMapMarkers(list, focusLatLon) {
  if (!searchMap) return;
  searchMapMarkers.forEach(function(m) { m.remove(); });
  searchMapMarkers = [];
  const pts = [];
  let focusMarker = null;
  list.forEach(function(c) {
    if (c.lat == null) return;
    const marker = L.marker([c.lat, c.lon], { icon: getCachePinIcon(c.ty, isFound(c), c.disabled) }).addTo(searchMap);
    marker.bindTooltip(c.n);
    marker.on('click', function() {
      showListView();
      const row = listEl.children[lastShown.indexOf(c)];
      if (row) toggle(row);
    });
    searchMapMarkers.push(marker);
    pts.push([c.lat, c.lon]);
    if (focusLatLon && c.lat === focusLatLon[0] && c.lon === focusLatLon[1]) focusMarker = marker;
  });
  if (focusLatLon) {
    searchMap.setView(focusLatLon, MAP_FOCUS_ZOOM);
    if (focusMarker) focusMarker.openTooltip();
  } else if (pts.length) {
    searchMap.fitBounds(pts, { padding: [30, 30], maxZoom: 16 });
  } else {
    searchMap.fitBounds(ESTONIA_BOUNDS);
  }
}

function updateViewToggleBtn() {
  viewToggleBtn.textContent = mapViewActive ? '☰' : '🗺️';
}

// focusLatLon, when given, centers the map on that cache (e.g. from the
// preview map's double-tap) instead of fitting to the whole result set.
function showMapView(focusLatLon) {
  mapViewActive = true;
  listEl.style.display = 'none';
  mapviewEl.style.display = '';
  updateViewToggleBtn();
  positionMapView();
  ensureLeaflet();
  ensureSearchMap();
  render(qEl.value.trim(), focusLatLon);
}

// Switches to the map view and zooms straight to a specific cache, at the
// same zoom level the old single-cache full map used.
function focusCacheOnMap(lat, lon) {
  if (!leafletLoaded) return; // no map to show while offline; nothing to do
  showMapView([lat, lon]);
}

function showListView() {
  mapViewActive = false;
  mapviewEl.style.display = 'none';
  listEl.style.display = '';
  updateViewToggleBtn();
  render(qEl.value.trim());
}

function toggleMapView() {
  if (mapViewActive) showListView(); else showMapView();
}

bindDoubleTap(countEl, toggleMapView);
viewToggleBtn.addEventListener('click', toggleMapView);

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
hideFoundBtn.addEventListener('click', function() {
  const pressed = hideFoundBtn.getAttribute('aria-pressed') === 'true';
  hideFoundBtn.setAttribute('aria-pressed', String(!pressed));
  HideFindsPref.set(!pressed);
  render(qEl.value.trim());
});
hideDisabledBtn.addEventListener('click', function() {
  const pressed = hideDisabledBtn.getAttribute('aria-pressed') === 'true';
  hideDisabledBtn.setAttribute('aria-pressed', String(!pressed));
  HideDisabledPref.set(!pressed);
  render(qEl.value.trim());
});
idToggleBtn.addEventListener('click', function() {
  const pressed = idToggleBtn.getAttribute('aria-pressed') === 'true';
  idToggleBtn.setAttribute('aria-pressed', String(!pressed));
  ShowIdPref.set(!pressed);
  refreshFieldVisibility();
});
dtsToggleBtn.addEventListener('click', function() {
  const pressed = dtsToggleBtn.getAttribute('aria-pressed') === 'true';
  dtsToggleBtn.setAttribute('aria-pressed', String(!pressed));
  ShowDtsPref.set(!pressed);
  refreshFieldVisibility();
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

// ─── Views (search / tools menu / coordinate converter) ────────────────────
// Path-shaped hash routes, e.g. #/tools/coordinates/conversion — a real path
// would need a server-side rewrite for the very first (pre-service-worker)
// load of a deep link, which we can't rely on, so the routing lives entirely
// in the fragment. The empty/root hash just redirects to /search for now —
// kept separate so the root can be repurposed later without touching search's
// own route.
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
  if (name === 'coord' || name === 'proj') ensureLeaflet();
  if (name === 'coord' && leafletLoaded) ccInitMap();
  if (name === 'proj' && leafletLoaded) pjInitMap();
  if (name === 'data') refreshDataView();
}

function showView(name) {
  applyView(name);
  const path = VIEW_TO_PATH[name];
  if (!path) return;
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

// ─── Settings → Data (found-caches import) ──────────────────────────────
// Accepts either the simple finds.json map, or a geocaching.com pocket
// query zip download (a "My Finds" query) — the latter is unzipped and its
// GPX parsed client-side, mirroring get_my_finds/parse_my_finds.py, so
// there's no manual unzip/convert step for the user.
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
  dataStatusEl.innerHTML = (count ? '<div>' + esc(t('findsCount', { count: count })) + '</div>' : '<div>' + esc(t('noData')) + '</div>') +
    (uploadedAt ? '<div>' + esc(t('loadedAt', { date: formatUploadedAt(uploadedAt) })) + '</div>' : '');
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

function showDataError(msg) {
  dataMsgEl.textContent = msg;
  dataMsgEl.className = 'data-msg err';
}

function applyFinds(parsed) {
  FindsStore.save(parsed);
  rebuildFoundSet();
  refreshHideFoundVisibility();
  refreshDataView();
  dataMsgEl.textContent = t('dataLoaded', { count: Object.keys(parsed).length });
  dataMsgEl.className = 'data-msg ok';
  render(qEl.value.trim());
}

// GPX_NS/GS_NS/FOUND_LOG_TYPES match get_my_finds/parse_my_finds.py exactly
// so a pocket query zip and its manually-converted finds.json produce the
// same result.
const GPX_NS = 'http://www.topografix.com/GPX/1/0';
const GS_NS = 'http://www.groundspeak.com/cache/1/0';
const FOUND_LOG_TYPES = new Set(['Found it', 'Attended', 'Webcam Photo Taken']);

function directChild(el, ns, localName) {
  for (const child of el.children) {
    if (child.namespaceURI === ns && child.localName === localName) return child;
  }
  return null;
}

function directChildren(el, ns, localName) {
  const out = [];
  for (const child of el.children) {
    if (child.namespaceURI === ns && child.localName === localName) out.push(child);
  }
  return out;
}

function parseFindsGpx(gpxText) {
  const doc = new DOMParser().parseFromString(gpxText, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('invalid GPX XML');
  const finds = {};
  for (const wpt of directChildren(doc.documentElement, GPX_NS, 'wpt')) {
    const nameEl = directChild(wpt, GPX_NS, 'name');
    const gcid = nameEl && nameEl.textContent.trim();
    if (!gcid) continue;
    const cache = directChild(wpt, GS_NS, 'cache');
    if (!cache) continue;
    const logsEl = directChild(cache, GS_NS, 'logs');
    let foundLog = null;
    for (const log of (logsEl ? directChildren(logsEl, GS_NS, 'log') : [])) {
      const typeEl = directChild(log, GS_NS, 'type');
      if (typeEl && FOUND_LOG_TYPES.has(typeEl.textContent)) { foundLog = log; break; }
    }
    if (!foundLog) continue;
    const dateEl = directChild(foundLog, GS_NS, 'date');
    const date = dateEl && dateEl.textContent;
    if (!date) continue;
    const textEl = directChild(foundLog, GS_NS, 'text');
    finds[gcid] = [date.split('T')[0], (textEl ? textEl.textContent : '').trim()];
  }
  return finds;
}

// ─── Minimal ZIP reader ──────────────────────────────────────────────────
// Just enough to pull the single .gpx entry out of a geocaching.com pocket
// query download (store or deflate are the only methods it ever uses).
function readUint32LE(view, off) { return view.getUint32(off, true); }
function readUint16LE(view, off) { return view.getUint16(off, true); }

async function inflateRaw(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function extractGpxFromZip(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const EOCD_SIG = 0x06054b50;
  const searchFrom = Math.max(0, bytes.length - 22 - 65536);
  let eocdOff = -1;
  for (let i = bytes.length - 22; i >= searchFrom; i--) {
    if (readUint32LE(view, i) === EOCD_SIG) { eocdOff = i; break; }
  }
  if (eocdOff < 0) throw new Error('not a valid zip file');

  const entryCount = readUint16LE(view, eocdOff + 10);
  let cdOff = readUint32LE(view, eocdOff + 16);

  for (let i = 0; i < entryCount; i++) {
    if (readUint32LE(view, cdOff) !== 0x02014b50) break;
    const method = readUint16LE(view, cdOff + 10);
    const compSize = readUint32LE(view, cdOff + 20);
    const nameLen = readUint16LE(view, cdOff + 28);
    const extraLen = readUint16LE(view, cdOff + 30);
    const commentLen = readUint16LE(view, cdOff + 32);
    const localOff = readUint32LE(view, cdOff + 42);
    const name = new TextDecoder().decode(bytes.subarray(cdOff + 46, cdOff + 46 + nameLen));

    if (/\.gpx$/i.test(name)) {
      const localNameLen = readUint16LE(view, localOff + 26);
      const localExtraLen = readUint16LE(view, localOff + 28);
      const dataOff = localOff + 30 + localNameLen + localExtraLen;
      const compressed = bytes.subarray(dataOff, dataOff + compSize);
      const raw = method === 0 ? compressed : await inflateRaw(compressed);
      return new TextDecoder('utf-8').decode(raw);
    }
    cdOff += 46 + nameLen + extraLen + commentLen;
  }
  return null;
}

async function importFindsFile(file) {
  let bytes;
  try {
    bytes = new Uint8Array(await file.arrayBuffer());
  } catch (e) {
    showDataError(t('fileReadFailed'));
    return;
  }

  const isZip = bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04;
  let parsed;

  if (isZip) {
    let gpxText;
    try {
      gpxText = await extractGpxFromZip(bytes);
    } catch (e) {
      showDataError(t('fileReadFailed'));
      return;
    }
    if (!gpxText) { showDataError(t('zipNoGpx')); return; }
    try {
      parsed = parseFindsGpx(gpxText);
    } catch (e) {
      showDataError(t('zipParseFailed'));
      return;
    }
  } else {
    try {
      parsed = JSON.parse(new TextDecoder('utf-8').decode(bytes));
    } catch (e) {
      showDataError(t('fileNotJson'));
      return;
    }
    if (!isValidFindsShape(parsed)) { showDataError(t('fileWrongFormat')); return; }
  }

  applyFinds(parsed);
}

dataLoadBtn.addEventListener('click', function() { dataFileInput.click(); });

dataFileInput.addEventListener('change', function() {
  const file = dataFileInput.files[0];
  dataFileInput.value = '';
  if (!file) return;
  importFindsFile(file);
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
const ccMapsRows = [
  { row: document.getElementById('cc-maps-dmm-row'), btn: document.getElementById('cc-maps-dmm-btn') },
  { row: document.getElementById('cc-maps-dd-row'), btn: document.getElementById('cc-maps-dd-btn') },
  { row: document.getElementById('cc-maps-lest-row'), btn: document.getElementById('cc-maps-lest-btn') },
];
ccMapsRows.forEach(function(m) { bindNavButton(m.btn); });

// Points the Maps button's tap/long-press targets at (lat, lon); hides the
// row entirely when there's no coordinate to link to yet.
function updateMapsBtn(row, btn, lat, lon) {
  if (lat == null) { row.style.display = 'none'; return; }
  const nav = mapNavData(lat, lon, t('pointLabel'));
  btn.dataset.default = nav.default;
  btn.dataset.alts = JSON.stringify(nav.alts);
  row.style.display = '';
}

function ccClearOutputs() {
  ccDmmEl.value = ccDdEl.value = ccLestEl.value = '';
  ccStatusEl.textContent = '';
  ccStatusEl.className = 'cc-status';
  ccBadgeEl.style.display = 'none';
  ccMapsRows.forEach(function(m) { updateMapsBtn(m.row, m.btn, null, null); });
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
    ccMapsRows.forEach(function(m) { updateMapsBtn(m.row, m.btn, result.lat, result.lon); });
    ccStatusEl.textContent = t('detected', { fmt: result.fmt });
    ccStatusEl.className = 'cc-status ok';
    ccBadgeEl.textContent = result.fmt;
    ccBadgeEl.style.display = '';
  } else {
    ccClearOutputs();
    ccStatusEl.textContent = t('formatNotDetected');
    ccStatusEl.className = 'cc-status err';
  }
});

function ccCopyField(id, btn) {
  const val = document.getElementById(id).value;
  if (!val) return;
  navigator.clipboard.writeText(val).then(function() {
    const orig = btn.textContent;
    btn.textContent = t('copied');
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
      ccStatusEl.textContent = t('locationUnavailable');
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
const pjMapsRowEl = document.getElementById('pj-maps-row');
const pjMapsBtnEl = document.getElementById('pj-maps-btn');
bindNavButton(pjMapsBtnEl);

function pjRecompute() {
  const val = pjInpEl.value;
  if (!val.trim()) {
    pjOutEl.value = '';
    pjStatusEl.textContent = '';
    pjStatusEl.className = 'cc-status';
    pjBadgeEl.style.display = 'none';
    updateMapsBtn(pjMapsRowEl, pjMapsBtnEl, null, null);
    return;
  }
  const result = ccDetect(val);
  if (!result) {
    pjOutEl.value = '';
    pjStatusEl.textContent = t('formatNotDetected');
    pjStatusEl.className = 'cc-status err';
    pjBadgeEl.style.display = 'none';
    updateMapsBtn(pjMapsRowEl, pjMapsBtnEl, null, null);
    return;
  }
  pjStatusEl.textContent = t('detected', { fmt: result.fmt });
  pjStatusEl.className = 'cc-status ok';
  pjBadgeEl.textContent = result.fmt;
  pjBadgeEl.style.display = '';

  const angle = parseFloat(pjAngleEl.value);
  const dist = parseFloat(pjDistEl.value);
  if (isNaN(angle) || isNaN(dist)) {
    pjOutEl.value = '';
    updateMapsBtn(pjMapsRowEl, pjMapsBtnEl, null, null);
    return;
  }
  const dest = pjDestinationPoint(result.lat, result.lon, angle, dist);
  pjOutEl.value = ccFmtDMM(dest.lat, dest.lon);
  pjMapUpdate(result.lat, result.lon, dest.lat, dest.lon);
  updateMapsBtn(pjMapsRowEl, pjMapsBtnEl, dest.lat, dest.lon);
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
      pjStatusEl.textContent = t('locationUnavailable');
      pjStatusEl.className = 'cc-status err';
      pjLocBtn.textContent = '⌖';
      pjLocBtn.disabled = false;
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

} // end initApp

const countEl0 = document.getElementById('count');
if (countEl0) countEl0.textContent = t('loadingData');

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
      listEl0.innerHTML = '<div id="empty">' + t('loadFailed')
        + '<br><button type="button" id="dataRetryBtn" class="data-load-btn" style="display:inline-block;margin-top:12px">' + esc(t('retryBtn')) + '</button></div>';
      document.getElementById('dataRetryBtn').addEventListener('click', loadData);
    });
}
loadData();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').catch(function() {});
  });
}
