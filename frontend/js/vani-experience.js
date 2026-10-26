/**
 * Phase 8 / 9 — Responsive motion/pointer tiers + a11y surface markers.
 * Runs synchronously in <head> after preservation (before paint-critical CSS).
 */
(function initVaniExperience() {
  'use strict';

  if (window.__vaniExperienceInit) return;
  window.__vaniExperienceInit = true;

  const html = document.documentElement;
  let reducedMotion = false;
  let lastTierKey = '';

  const readReducedMotion = () => {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  };

  const getViewportBand = () => {
    const w = window.innerWidth || 1024;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  };

  const getPointerCapabilities = () => {
    let fine = false;
    let coarse = false;
    try {
      fine = window.matchMedia('(pointer: fine)').matches;
      coarse = window.matchMedia('(pointer: coarse)').matches;
    } catch (e) {
      fine = true;
    }
    return { fine, coarse };
  };

  const resolveTiers = () => {
    const viewport = getViewportBand();
    const { fine, coarse } = getPointerCapabilities();

    let pointerTier = 'full';
    let motionTier = 'full';

    if (reducedMotion) {
      pointerTier = 'off';
      motionTier = 'minimal';
    } else if (viewport === 'mobile' || (coarse && !fine)) {
      pointerTier = 'off';
      motionTier = 'minimal';
    } else if (viewport === 'tablet') {
      pointerTier = 'lite';
      motionTier = 'reduced';
    }

    return { viewport, pointerTier, motionTier };
  };

  const applyTiers = () => {
    const { viewport, pointerTier, motionTier } = resolveTiers();
    const tierKey = `${viewport}|${pointerTier}|${motionTier}|${reducedMotion}`;
    html.dataset.vaniViewport = viewport;
    html.dataset.vaniPointerTier = pointerTier;
    html.dataset.vaniMotionTier = motionTier;

    if (tierKey !== lastTierKey) {
      lastTierKey = tierKey;
      window.dispatchEvent(
        new CustomEvent('vani:experience-tier', {
          detail: { viewport, pointerTier, motionTier, reducedMotion },
        })
      );
    }
  };

  reducedMotion = readReducedMotion();
  applyTiers();

  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(applyTiers, 160);
  };

  const ac = new AbortController();
  window.addEventListener('resize', onResize, { passive: true, signal: ac.signal });

  try {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onRm = () => {
      reducedMotion = rm.matches;
      applyTiers();
    };
    if (typeof rm.addEventListener === 'function') rm.addEventListener('change', onRm);
    else if (typeof rm.addListener === 'function') rm.addListener(onRm);
  } catch (e) {
    /* ignore */
  }

  let decorMarkTimer = 0;
  let decorObserver = null;

  const markDecorativeNonFocusable = () => {
    document.querySelectorAll('.vani-cursor-glow, .vani-ambient-layer, .vani-ambient-page, .vani-ambient__mesh').forEach((el) => {
      if (el.getAttribute('tabindex') !== '-1') el.setAttribute('tabindex', '-1');
      if (!el.hasAttribute('aria-hidden')) el.setAttribute('aria-hidden', 'true');
    });
  };

  const scheduleDecorMark = () => {
    window.clearTimeout(decorMarkTimer);
    decorMarkTimer = window.setTimeout(markDecorativeNonFocusable, 120);
  };

  const bootA11y = () => {
    markDecorativeNonFocusable();
    decorObserver = new MutationObserver(scheduleDecorMark);
    decorObserver.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootA11y, { once: true });
  else if (document.body) bootA11y();

  window.addEventListener(
    'pagehide',
    () => {
      ac.abort();
      window.clearTimeout(resizeTimer);
      window.clearTimeout(decorMarkTimer);
      if (decorObserver) decorObserver.disconnect();
    },
    { once: true }
  );

  window.VaniExperience = Object.freeze({
    getViewportBand,
    getPointerTier: () => html.dataset.vaniPointerTier || 'full',
    getMotionTier: () => html.dataset.vaniMotionTier || 'full',
    prefersReducedMotion: () => reducedMotion,
    applyTiers,
  });
})();
