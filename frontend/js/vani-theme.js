/**
 * Phase 7 — Theme toggle UI + scoped surface markers (non-Home eligible areas).
 */
(function initVaniTheme() {
  'use strict';

  if (window.__vaniThemeInit) return;
  window.__vaniThemeInit = true;

  const ctx = window.VaniSiteContext;
  if (!ctx) return;

  const INDEX_SCOPE_IDS = [
    'about',
    'services',
    'product-showcase',
    'products',
    'delivery-projects',
    'contact',
  ];

  const THEME_COLORS = {
    dark: '#161c28',
    light: '#f8fafc',
  };

  const getActiveTheme = () => (document.documentElement.getAttribute('data-vani-theme') === 'light' ? 'light' : 'dark');

  const syncMetaThemeColor = (theme) => {
    const color = THEME_COLORS[theme] || THEME_COLORS.dark;
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', color);
  };

  const markSurfaces = () => {
    const chromeSelectors = ['#main-navbar', '#main-footer', '#mobile-menu'];
    chromeSelectors.forEach((sel) => {
      const el = document.querySelector(sel);
      if (el && ctx.isEnhancementAllowed({ kind: 'theme-surface', element: el, scope: 'shared-chrome-only' })) {
        el.classList.add('vani-theme-chrome');
      }
    });

    document.querySelectorAll('header.navbar-initial').forEach((el) => {
      if (ctx.isEnhancementAllowed({ kind: 'theme-surface', element: el, scope: 'shared-chrome-only' })) {
        el.classList.add('vani-theme-chrome');
      }
    });

    const topBar = document.querySelector('body > div.hidden.sm\\:block');
    if (topBar && ctx.isEnhancementAllowed({ kind: 'theme-surface', element: topBar, scope: 'shared-chrome-only' })) {
      topBar.classList.add('vani-theme-chrome');
    }

    const adminHeader = document.querySelector('header.sticky.top-0.z-20');
    if (adminHeader && !adminHeader.id) {
      adminHeader.classList.add('vani-theme-chrome', 'admin-header-bar');
    }

    if (ctx.isHomeDocument) {
      const home = document.getElementById('home');
      if (home && ctx.isEnhancementAllowed({ kind: 'theme-surface', element: home })) {
        home.classList.add('vani-theme-scope');
      }
      INDEX_SCOPE_IDS.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;
        if (!ctx.isEnhancementAllowed({ kind: 'theme-surface', element: section })) return;
        section.classList.add('vani-theme-scope');
      });
    } else {
      document.body.classList.add('vani-theme-scope');
      const main = document.querySelector('main');
      if (main) main.classList.add('vani-theme-scope');
    }
  };

  const createToggleButton = () => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'vani-theme-toggle';
    btn.setAttribute('aria-live', 'polite');
    btn.innerHTML =
      '<i class="fa-solid fa-sun vani-theme-toggle__icon vani-theme-toggle__icon--light" aria-hidden="true"></i>' +
      '<i class="fa-solid fa-moon vani-theme-toggle__icon vani-theme-toggle__icon--dark" aria-hidden="true"></i>';

    const syncLabel = () => {
      const theme = getActiveTheme();
      const next = theme === 'light' ? 'dark' : 'light';
      btn.setAttribute('aria-label', `Switch to ${next} mode`);
      btn.setAttribute('title', `Switch to ${next} mode`);
      btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    };

    btn.addEventListener('click', () => {
      const next = getActiveTheme() === 'light' ? 'dark' : 'light';
      ctx.setThemePreference(next);
      syncLabel();
      syncMetaThemeColor(next);
    });

    btn.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        btn.click();
      }
    });

    syncLabel();
    return btn;
  };

  const mountToggle = (container, position) => {
    if (!container || container.querySelector('.vani-theme-toggle')) return;
    if (!ctx.isEnhancementAllowed({ kind: 'theme-surface', scope: 'shared-chrome-only' })) return;
    const btn = createToggleButton();
    if (position === 'prepend') container.insertBefore(btn, container.firstChild);
    else container.appendChild(btn);
  };

  const mountToggles = () => {
    const navbar = document.getElementById('main-navbar');
    if (navbar) {
      const actionGroups = navbar.querySelectorAll('.hidden.md\\:flex.items-center.gap-3');
      const actions = actionGroups[actionGroups.length - 1];
      mountToggle(actions, 'prepend');

      const mobileBar = navbar.querySelector('.flex.items-center.gap-2.md\\:hidden');
      mountToggle(mobileBar, 'prepend');
      return;
    }

    const headerActions = document.querySelector('header.navbar-initial .max-w-7xl > div.flex.items-center.gap-3');
    if (headerActions) {
      mountToggle(headerActions, 'prepend');
      return;
    }

    const headerRow = document.querySelector('header.navbar-initial > div.max-w-7xl')
      || document.querySelector('header.navbar-initial > div');
    if (headerRow) {
      mountToggle(headerRow, 'append');
      return;
    }

    const adminHeader = document.querySelector('header.sticky.top-0.z-20');
    if (adminHeader) {
      mountToggle(adminHeader, 'append');
    }
  };

  const enableTransitionClass = () => {
    requestAnimationFrame(() => {
      document.documentElement.classList.add('is-vani-theme-animate');
    });
  };

  const bindSystemPreference = () => {
    let mq;
    try {
      mq = window.matchMedia('(prefers-color-scheme: light)');
    } catch (e) {
      return;
    }
    const onChange = () => {
      if (ctx.getStoredThemePreference()) return;
      const resolved = ctx.resolveTheme();
      document.documentElement.setAttribute('data-vani-theme', resolved);
      document.documentElement.setAttribute('data-vani-theme-source', 'system');
      syncMetaThemeColor(resolved);
      window.dispatchEvent(new CustomEvent('vani:theme-preference', { detail: { theme: resolved, isHomeDocument: ctx.isHomeDocument } }));
    };
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onChange);
    else if (typeof mq.addListener === 'function') mq.addListener(onChange);
  };

  const onThemeEvent = () => {
    document.querySelectorAll('.vani-theme-toggle').forEach((btn) => {
      const theme = getActiveTheme();
      const next = theme === 'light' ? 'dark' : 'light';
      btn.setAttribute('aria-label', `Switch to ${next} mode`);
      btn.setAttribute('title', `Switch to ${next} mode`);
      btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    });
    syncMetaThemeColor(getActiveTheme());
  };

  const boot = () => {
    markSurfaces();
    mountToggles();
    syncMetaThemeColor(getActiveTheme());
    enableTransitionClass();
    bindSystemPreference();
    window.addEventListener('vani:theme-preference', onThemeEvent);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();

  window.addEventListener(
    'pagehide',
    () => {
      window.removeEventListener('vani:theme-preference', onThemeEvent);
    },
    { once: true }
  );
})();
