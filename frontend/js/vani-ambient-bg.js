/**
 * Ambient background animation disabled — removes legacy injected layers if present.
 */
(function initVaniAmbientBackground() {
  'use strict';

  if (window.__vaniAmbientBgInit) return;
  window.__vaniAmbientBgInit = true;

  if (!window.VaniSiteContext) return;

  const cleanup = () => {
    document.querySelectorAll('.vani-ambient-page').forEach((el) => el.remove());
    document.querySelectorAll('.vani-ambient-layer').forEach((el) => el.remove());
    document.querySelectorAll('.vani-ambient-host').forEach((el) => {
      el.classList.remove('vani-ambient-host');
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanup, { once: true });
  } else {
    cleanup();
  }
})();
