// ─── i18n ───────────────────────────────────────────────────────────────
// Single dictionary-based mechanism for all user-facing text. UI defaults to
// English; Estonian is kept filled in below so a language switch is just a
// matter of changing I18N_LANG (persisted) and re-running applyStaticI18n().
// Add a new locale by adding a key to STRINGS with the same keys as 'en'.
const STRINGS = {
  en: {
    searchPlaceholder: 'Search by name or GC code…',
    ownerLabel: 'owner',
    regionLabel: 'county',
    menuAria: 'Menu',
    hideFoundAria: 'Hide my finds',
    sortById: 'By ID',
    sortByName: 'By name',
    sortByDistance: 'By distance',
    sortDirAria: 'Sort direction',
    backAria: 'Back',
    toolsTitle: 'Tools',
    coordConverterItem: 'Coordinate converter',
    coordProjectionItem: 'Coordinate projection',
    settingsItem: 'Settings',
    settingsTitle: 'Settings',
    distanceOriginItem: 'Distance calculation',
    dataItem: 'Data',
    distanceTitle: 'Distance calculation',
    distanceFromLabel: 'Calculate distance from:',
    currentLocationOption: 'Current location',
    dataTitle: 'Data',
    myFindsLabel: 'My finds',
    loadJsonBtn: 'Load JSON file',
    coordConverterTitle: 'Coordinate converter',
    inputLabel: 'Input',
    pasteBtn: 'Paste',
    coordInputPlaceholder: 'Paste any coordinate format',
    dmmLabel: 'Degrees + decimal minutes',
    copyBtn: 'Copy',
    ddLabel: 'Decimal degrees',
    lestLabel: 'L-EST97 (EPSG:3301)',
    coordProjectionTitle: 'Coordinate projection',
    angleLabel: 'Angle (°)',
    distanceLabel: 'Distance (m)',
    distancePlaceholder: 'in meters',

    noResults: 'No results found',
    refineSearch: 'refine your search',
    cachesSuffix: 'caches',
    typeFieldLabel: 'Type:',
    sizeFieldLabel: 'Size:',
    addressLabel: 'Address:',
    coordinatesLabel: 'Coordinates:',
    hiddenLabel: 'Hidden:',
    byLabel: 'by',
    driveBtn: '🚗 Drive',
    mapBtn: '🗺️ Map',
    openGcCom: 'Open GC.com',
    openGeopeitus: 'Open Geopeitus',
    originPointTooltip: 'Origin point',
    fileNotJson: 'File is not valid JSON',
    fileWrongFormat: "File doesn't match the expected format",
    fileReadFailed: 'Failed to read file',
    dataLoaded: 'Data loaded ({count} finds)',
    findsCount: '{count} finds',
    noData: 'No data',
    loadedAt: 'Loaded: {date}',
    detected: 'Detected: {fmt}',
    formatNotDetected: 'Format not detected',
    copied: 'Copied!',
    locationUnavailable: 'Location not available',
    loadingData: 'Loading data…',
    loadFailed: 'Failed to load data.<br>Check your internet connection and try again.',
    retryBtn: 'Try again',

    typeTraditional: 'Traditional',
    typeMystery: 'Mystery',
    typeMulti: 'Multi-cache',
    typeVirtual: 'Virtual',
    typeWherigo: 'Wherigo',
    typeLetterbox: 'Letterbox',
    typeUnknown: 'Unknown location',
    typeWebcam: 'Webcam',

    sizeOther: 'Other',
    sizeMicro: 'Micro',
    sizeSmall: 'Small',
    sizeRegular: 'Regular',
    sizeLarge: 'Large',
  },
  et: {
    searchPlaceholder: 'Otsi nime või GC koodi…',
    ownerLabel: 'omanik',
    regionLabel: 'maakond',
    menuAria: 'Menüü',
    hideFoundAria: 'Peida minu leiud',
    sortById: 'ID järgi',
    sortByName: 'Nime järgi',
    sortByDistance: 'Kauguse järgi',
    sortDirAria: 'Sortimise suund',
    backAria: 'Tagasi',
    toolsTitle: 'Tööriistad',
    coordConverterItem: 'Koordinaatide teisendaja',
    coordProjectionItem: 'Koordinaatide projektsioon',
    settingsItem: 'Seaded',
    settingsTitle: 'Seaded',
    distanceOriginItem: 'Kauguse arvutamine',
    dataItem: 'Andmed',
    distanceTitle: 'Kauguse arvutamine',
    distanceFromLabel: 'Arvuta kaugus asukohast:',
    currentLocationOption: 'Praegune asukoht',
    dataTitle: 'Andmed',
    myFindsLabel: 'Minu leiud',
    loadJsonBtn: 'Laadi JSON fail',
    coordConverterTitle: 'Koordinaatide teisendaja',
    inputLabel: 'Sisend',
    pasteBtn: 'Kleebi',
    coordInputPlaceholder: 'Kleebi mistahes koordinaadi formaat',
    dmmLabel: 'Kraadid + detsimaalminutid',
    copyBtn: 'Kopeeri',
    ddLabel: 'Kümnendkraadid',
    lestLabel: 'L-EST97 (EPSG:3301)',
    coordProjectionTitle: 'Koordinaatide projektsioon',
    angleLabel: 'Nurk (°)',
    distanceLabel: 'Vahemaa (m)',
    distancePlaceholder: 'meetrites',

    noResults: 'Tulemusi ei leitud',
    refineSearch: 'täpsusta otsingut',
    cachesSuffix: 'peitu',
    typeFieldLabel: 'Tüüp:',
    sizeFieldLabel: 'Suurus:',
    addressLabel: 'Aadress:',
    coordinatesLabel: 'Koordinaadid:',
    hiddenLabel: 'Peidetud:',
    byLabel: 'by',
    driveBtn: '🚗 Sõida',
    mapBtn: '🗺️ Kaart',
    openGcCom: 'Ava GC.com',
    openGeopeitus: 'Ava Geopeitus',
    originPointTooltip: 'Lähtepunkt',
    fileNotJson: 'Fail ei ole korrektne JSON',
    fileWrongFormat: 'Fail ei vasta oodatud vormingule',
    fileReadFailed: 'Faili lugemine ebaõnnestus',
    dataLoaded: 'Andmed laaditud ({count} leidu)',
    findsCount: '{count} leidu',
    noData: 'Andmeid ei ole',
    loadedAt: 'Laaditud: {date}',
    detected: 'Tuvastati: {fmt}',
    formatNotDetected: 'Formaati ei tuvastatud',
    copied: 'Kopeeritud!',
    locationUnavailable: 'Asukoht pole saadaval',
    loadingData: 'Laen andmeid…',
    loadFailed: 'Andmete laadimine ebaõnnestus.<br>Kontrolli internetiühendust ja proovi uuesti.',
    retryBtn: 'Proovi uuesti',

    typeTraditional: 'Tavaline',
    typeMystery: 'Mõistatus',
    typeMulti: 'Multi',
    typeVirtual: 'Virtuaalne',
    typeWherigo: 'KusMaLäen',
    typeLetterbox: 'Kirjakast',
    typeUnknown: 'Asukohata',
    typeWebcam: 'Veebikaamera',

    sizeOther: 'Muu',
    sizeMicro: 'Mikro',
    sizeSmall: 'Väike',
    sizeRegular: 'Normaalne',
    sizeLarge: 'Suur',
  },
};

const I18N_DEFAULT_LANG = 'en';
let I18N_LANG = I18N_DEFAULT_LANG;

// Raw cache-type/size values in data.json are still Estonian words (the data
// pipeline that produces them lives outside this repo) — these map those
// fixed, known values onto translation keys so they render in whatever
// language is active without touching the data file itself.
const CACHE_TYPE_KEYS = {
  'Tavaline': 'typeTraditional',
  'Mõistatus': 'typeMystery',
  'Multi': 'typeMulti',
  'Virtuaalne': 'typeVirtual',
  'KusMaLäen': 'typeWherigo',
  'Kirjakast': 'typeLetterbox',
  'Asukohata': 'typeUnknown',
  'Veebikaamera': 'typeWebcam',
};
const CACHE_SIZE_KEYS = { 0: 'sizeOther', 1: 'sizeMicro', 2: 'sizeSmall', 3: 'sizeRegular', 4: 'sizeLarge' };

function t(key, vars) {
  const dict = STRINGS[I18N_LANG] || STRINGS[I18N_DEFAULT_LANG];
  let str = dict[key] != null ? dict[key] : STRINGS[I18N_DEFAULT_LANG][key];
  if (str == null) return key;
  if (vars) {
    for (const k in vars) str = str.replace('{' + k + '}', vars[k]);
  }
  return str;
}

function typeLabel(ty) {
  const key = CACHE_TYPE_KEYS[ty];
  return key ? t(key) : ty;
}

function sizeLabel(sz) {
  const key = CACHE_SIZE_KEYS[sz];
  return key ? t(key) : '';
}

// Applies data-i18n / data-i18n-placeholder / data-i18n-aria-label to every
// matching element — run once on load, and again after switching I18N_LANG.
function applyStaticI18n() {
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(function(el) {
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria-label')));
  });
}
applyStaticI18n();
