/**
 * Vani Technologies — Phase 2 Site Preservation Layer
 * Runs early on every page. Provides route/section guards and theme preference boot.
 */
(function initVaniPreservation() {
  'use strict';

  const HOME_SECTION_ID = 'home';
  const THEME_STORAGE_KEY = 'vani_theme_pref';
  const BLOCKED_ON_HOME = Object.freeze([
    'ambient-bg',
    'pointer-glow',
    'parallax',
    'scroll-reveal',
    'cursor',
    'particles',
    'theme-surface',
    'card-glow',
  ]);

  const INDEX_SECTION_SCOPED = new Set(['ambient-bg', 'parallax', 'card-glow', 'scroll-reveal', 'theme-surface']);

  const normalizePath = (pathname) => {
    const p = (pathname || '/').replace(/\\/g, '/').toLowerCase();
    if (p === '/' || p.endsWith('/index.html') || p.endsWith('/index.htm')) return '/';
    return p;
  };

  const path = normalizePath(window.location.pathname);
  const isHomeDocument = path === '/';
  const html = document.documentElement;

  html.dataset.vaniRoute = isHomeDocument ? 'home' : 'standalone';
  html.dataset.vaniHomePreserve = isHomeDocument ? 'true' : 'false';

  const isInsideHomeSection = (node) => {
    if (!node || !node.closest) return false;
    const home = document.getElementById(HOME_SECTION_ID);
    if (!home) return false;
    return home.contains(node);
  };

  /**
   * @param {object} opts
   * @param {string} [opts.kind] — enhancement category (see BLOCKED_ON_HOME)
   * @param {Element} [opts.element] — target node for section-aware checks
   * @param {'shared-chrome-only'} [opts.scope] — allowed on Home when explicitly shared chrome
   */
  const isEnhancementAllowed = (opts = {}) => {
    const kind = opts.kind || '';
    const scope = opts.scope || '';

    if (isHomeDocument) {
      if (scope === 'shared-chrome-only') return true;
      if (kind === 'theme-surface' && opts.element?.id === HOME_SECTION_ID) return true;
      if (opts.element && isInsideHomeSection(opts.element)) return false;
      if (!isHomeDocument && kind === 'pointer-glow') return true;
      if (INDEX_SECTION_SCOPED.has(kind) && opts.element && !isInsideHomeSection(opts.element)) return true;
      if (kind === 'theme-surface' && opts.element && !isInsideHomeSection(opts.element)) return true;
      if (BLOCKED_ON_HOME.includes(kind)) return false;
    }

    return true;
  };

  const getSystemTheme = () => {
    try {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch (e) {
      return 'dark';
    }
  };

  const getStoredThemePreference = () => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (e) {
      /* ignore */
    }
    return null;
  };

  const resolveTheme = () => getStoredThemePreference() || getSystemTheme();

  const applyDocumentTheme = (theme) => {
    const value = theme === 'light' ? 'light' : 'dark';
    html.setAttribute('data-vani-theme', value);
    html.setAttribute('data-vani-theme-source', getStoredThemePreference() ? 'user' : 'system');
  };

  /**
   * Persist explicit user theme (light or dark). Does not alter #home visuals — scoped via CSS.
   */
  const setThemePreference = (theme) => {
    const value = theme === 'light' ? 'light' : 'dark';
    try {
      localStorage.setItem(THEME_STORAGE_KEY, value);
    } catch (e) {
      /* ignore */
    }
    applyDocumentTheme(value);
    window.dispatchEvent(new CustomEvent('vani:theme-preference', { detail: { theme: value, isHomeDocument } }));
  };

  /** Resolved active theme (stored choice or system preference). */
  const getThemePreference = () => resolveTheme();

  applyDocumentTheme(resolveTheme());

  window.VaniSiteContext = Object.freeze({
    HOME_SECTION_ID,
    BLOCKED_ON_HOME,
    THEME_STORAGE_KEY,
    path,
    isHomeDocument,
    isEnhancementAllowed,
    isInsideHomeSection,
    setThemePreference,
    getThemePreference,
    getStoredThemePreference,
    getSystemTheme,
    resolveTheme,
  });
})();
