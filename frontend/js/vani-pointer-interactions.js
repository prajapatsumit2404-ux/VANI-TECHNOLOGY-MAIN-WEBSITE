/**
 * Pointer interactions — vanilla MPA; eligible content only (never #home / #products demos).
 * Complements: main.js tilt-card, vani-scroll-motion, AOS. No global cursor:none.
 */
(function initVaniPointerInteractions() {
  'use strict';

  if (window.__vaniPointerInteractionsInit) return;
  window.__vaniPointerInteractionsInit = true;

  const ctx = window.VaniSiteContext;
  if (!ctx) return;

  const HOME_ID = ctx.HOME_SECTION_ID || 'home';
  const exp = () => window.VaniExperience;

  const getPointerTier = () => {
    const fromDom = document.documentElement.dataset.vaniPointerTier;
    if (fromDom === 'off' || fromDom === 'lite' || fromDom === 'full') return fromDom;
    return exp()?.getPointerTier?.() || 'full';
  };

  const prefersReduced = () => {
    if (exp()?.prefersReducedMotion?.()) return true;
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  };

  const tierConfig = (tier) => {
    if (tier === 'lite') {
      return { glow: false, parallax: true, cardTrack: true, cursor: false, magnetic: false, ripple: true, lerpGlow: 0.1, lerpParallax: 0.07, parallaxScale: 0.42, lerpCursor: 0.16 };
    }
    if (tier === 'full') {
      return { glow: true, parallax: true, cardTrack: true, cursor: true, magnetic: true, ripple: true, lerpGlow: 0.14, lerpParallax: 0.1, parallaxScale: 1, lerpCursor: 0.18 };
    }
    return { glow: false, parallax: false, cardTrack: false, cursor: false, magnetic: false, ripple: false, lerpGlow: 0.14, lerpParallax: 0.1, parallaxScale: 0, lerpCursor: 0.18 };
  };

  let config = tierConfig(getPointerTier());

  const state = {
    rafId: 0,
    running: false,
    targetGx: -9999,
    targetGy: -9999,
    curGx: -9999,
    curGy: -9999,
    parallaxX: 0,
    parallaxY: 0,
    targetParallaxX: 0,
    targetParallaxY: 0,
    glowEl: null,
    cursorRoot: null,
    cursorTx: -9999,
    cursorTy: -9999,
    cursorCx: -9999,
    cursorCy: -9999,
    cursorHover: false,
    abort: null,
    cardHandlers: [],
    magneticHandlers: [],
    rippleAbort: null,
    parallaxLayers: [],
  };

  const htmlEl = document.documentElement;

  const lerp = (a, b, t) => a + (b - a) * t;

  const isInsideHome = (node) => {
    if (!node || !node.closest) return false;
    const home = document.getElementById(HOME_ID);
    return home ? home.contains(node) : false;
  };

  const isPointOverHome = (x, y) => {
    const home = document.getElementById(HOME_ID);
    if (!home) return false;
    const r = home.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  };

  const isEligibleTarget = (node) => {
    if (!node || node.nodeType !== 1) return false;
    if (isInsideHome(node)) return false;
    if (node.closest('#products, #product-showcase, form, .modal-overlay')) return false;
    return true;
  };

  const tick = () => {
    state.curGx = lerp(state.curGx, state.targetGx, config.lerpGlow);
    state.curGy = lerp(state.curGy, state.targetGy, config.lerpGlow);
    state.parallaxX = lerp(state.parallaxX, state.targetParallaxX, config.lerpParallax);
    state.parallaxY = lerp(state.parallaxY, state.targetParallaxY, config.lerpParallax);

    if (state.glowEl && config.glow) {
      state.glowEl.style.setProperty('--vani-gx', `${state.curGx}px`);
      state.glowEl.style.setProperty('--vani-gy', `${state.curGy}px`);
    }

    if (config.parallax) {
      const px = state.parallaxX * config.parallaxScale;
      const py = state.parallaxY * config.parallaxScale;
      htmlEl.style.setProperty('--vani-parallax-x', px.toFixed(4));
      htmlEl.style.setProperty('--vani-parallax-y', py.toFixed(4));
    }

    if (state.cursorRoot && config.cursor) {
      state.cursorCx = lerp(state.cursorCx, state.cursorTx, config.lerpCursor);
      state.cursorCy = lerp(state.cursorCy, state.cursorTy, config.lerpCursor);
      state.cursorRoot.style.transform = `translate3d(${state.cursorCx}px, ${state.cursorCy}px, 0)`;
    }

    const glowDelta = Math.abs(state.targetGx - state.curGx) + Math.abs(state.targetGy - state.curGy);
    const parallaxDelta = Math.abs(state.targetParallaxX - state.parallaxX) + Math.abs(state.targetParallaxY - state.parallaxY);
    const cursorDelta = Math.abs(state.cursorTx - state.cursorCx) + Math.abs(state.cursorTy - state.cursorCy);

    const glowIdle = !config.glow || glowDelta < 0.35;
    const parallaxIdle = !config.parallax || parallaxDelta < 0.002;
    const cursorIdle = !config.cursor || cursorDelta < 0.25;

    if (glowIdle && parallaxIdle && cursorIdle) {
      state.running = false;
      state.rafId = 0;
      return;
    }

    state.rafId = window.requestAnimationFrame(tick);
  };

  const ensureTick = () => {
    if (state.running) return;
    state.running = true;
    state.rafId = window.requestAnimationFrame(tick);
  };

  const onPointerMove = (event) => {
    const x = event.clientX;
    const y = event.clientY;
    const overHome = isPointOverHome(x, y);

    if (state.glowEl && config.glow && !overHome) {
      state.targetGx = x;
      state.targetGy = y;
      state.glowEl.classList.add('is-active');
    } else if (state.glowEl) {
      state.glowEl.classList.remove('is-active');
    }

    if (config.parallax && !overHome) {
      state.targetParallaxX = (x / window.innerWidth - 0.5) * 2;
      state.targetParallaxY = (y / window.innerHeight - 0.5) * 2;
    }

    if (state.cursorRoot && config.cursor) {
      if (overHome) {
        state.cursorRoot.classList.add('is-hidden');
        htmlEl.removeAttribute('data-vani-custom-cursor');
      } else {
        state.cursorRoot.classList.remove('is-hidden');
        htmlEl.setAttribute('data-vani-custom-cursor', 'on');
        state.cursorTx = x;
        state.cursorTy = y;
        const target = event.target;
        const interactive =
          target &&
          isEligibleTarget(target) &&
          target.closest('a, button, .btn-primary, .btn-secondary, .vani-pointer-card, [role="tab"], input, textarea, select, label');
        state.cursorHover = !!interactive;
        state.cursorRoot.classList.toggle('is-hover', state.cursorHover);
        state.cursorRoot.dataset.label = '';
        if (interactive) {
          const el = target.closest('a, button, .vani-pointer-card');
          if (el?.classList.contains('vani-pointer-card')) state.cursorRoot.dataset.label = 'View';
          else if (el?.classList.contains('btn-primary')) state.cursorRoot.dataset.label = 'Explore';
        }
      }
      ensureTick();
    }

    if (config.glow || config.parallax) ensureTick();
  };

  const onPointerLeave = () => {
    if (state.glowEl) state.glowEl.classList.remove('is-active');
    if (state.cursorRoot) state.cursorRoot.classList.add('is-hidden');
    htmlEl.removeAttribute('data-vani-custom-cursor');
  };

  const teardownGlobalPointer = () => {
    if (typeof state.abort === 'function') state.abort();
    state.abort = null;
    if (state.rafId) window.cancelAnimationFrame(state.rafId);
    state.running = false;
    state.rafId = 0;
  };

  const initCursorGlow = () => {
    if (!ctx.isEnhancementAllowed({ kind: 'pointer-glow' })) return;
    if (!config.glow || prefersReduced()) return;
    if (state.glowEl) return;

    const glow = document.createElement('div');
    glow.className = 'vani-cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);
    state.glowEl = glow;
  };

  const teardownCustomCursor = () => {
    if (state.cursorRoot) {
      state.cursorRoot.remove();
      state.cursorRoot = null;
    }
    htmlEl.removeAttribute('data-vani-custom-cursor');
    document.querySelectorAll('.vani-cursor-target').forEach((el) => el.classList.remove('vani-cursor-target'));
  };

  const initCustomCursor = () => {
    teardownCustomCursor();
    if (!config.cursor || prefersReduced()) return;

    const root = document.createElement('div');
    root.className = 'vani-cursor-root is-hidden';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = '<span class="vani-cursor__ring"></span><span class="vani-cursor__dot"></span><span class="vani-cursor__label"></span>';
    document.body.appendChild(root);
    state.cursorRoot = root;

    const selectors = [
      'main section:not(#home) a',
      'main section:not(#home) button',
      '#main-navbar a',
      '#main-footer a',
      '.btn-primary',
      '.btn-secondary',
      '.vani-pointer-card',
      '[role="tab"]',
    ];
    selectors.forEach((sel) => {
      try {
        document.querySelectorAll(sel).forEach((el) => {
          if (!isEligibleTarget(el)) return;
          el.classList.add('vani-cursor-target');
        });
      } catch (e) {
        /* invalid selector in old browsers */
      }
    });
  };

  const syncParallaxLayers = () => {
    state.parallaxLayers = [];
    document.querySelectorAll('.vani-ambient-layer').forEach((layer) => {
      const host = layer.closest('section') || layer.closest('.vani-ambient-page') || layer.parentElement;
      if (!host) return;
      if (host.id === HOME_ID) return;
      if (!ctx.isEnhancementAllowed({ kind: 'parallax', element: host })) return;

      if (config.parallax && !prefersReduced()) {
        layer.classList.add('vani-parallax-enabled');
        state.parallaxLayers.push(layer);
      } else {
        layer.classList.remove('vani-parallax-enabled');
      }
    });

    if (!config.parallax) {
      htmlEl.style.removeProperty('--vani-parallax-x');
      htmlEl.style.removeProperty('--vani-parallax-y');
    }
  };

  const detachCardTracking = () => {
    state.cardHandlers.forEach(({ card, onMove, onLeave }) => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
      card.style.removeProperty('--vani-card-x');
      card.style.removeProperty('--vani-card-y');
      card.style.removeProperty('--vani-tilt-x');
      card.style.removeProperty('--vani-tilt-y');
    });
    state.cardHandlers = [];
  };

  const isEligibleCard = (el) => {
    if (!el || el.classList.contains('tilt-card')) return false;
    if (el.closest('#delivery-projects')) return false;
    if (el.closest('#services.vani-services-redesign')) return false;
    if (!isEligibleTarget(el)) return false;
    return true;
  };

  const attachCardTracking = (card) => {
    if (!config.cardTrack || prefersReduced()) return;
    if (state.cardHandlers.some((entry) => entry.card === card)) return;

    const onMove = (event) => {
      const rect = card.getBoundingClientRect();
      const px = ((event.clientX - rect.left) / rect.width) * 100;
      const py = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--vani-card-x', `${px}%`);
      card.style.setProperty('--vani-card-y', `${py}%`);
      const cx = (event.clientX - rect.left) / rect.width - 0.5;
      const cy = (event.clientY - rect.top) / rect.height - 0.5;
      const maxTilt = getPointerTier() === 'lite' ? 2.5 : 4;
      card.style.setProperty('--vani-tilt-x', `${(-cy * maxTilt).toFixed(2)}deg`);
      card.style.setProperty('--vani-tilt-y', `${(cx * maxTilt).toFixed(2)}deg`);
    };

    const onLeave = () => {
      card.style.setProperty('--vani-card-x', '50%');
      card.style.setProperty('--vani-card-y', '50%');
      card.style.setProperty('--vani-tilt-x', '0deg');
      card.style.setProperty('--vani-tilt-y', '0deg');
    };

    card.addEventListener('mousemove', onMove, { passive: true });
    card.addEventListener('mouseleave', onLeave, { passive: true });
    state.cardHandlers.push({ card, onMove, onLeave });
  };

  const registerCard = (card) => {
    if (!isEligibleCard(card)) return;
    if (card.classList.contains('vani-pointer-card')) return;
    if (!ctx.isEnhancementAllowed({ kind: 'card-glow', element: card })) return;

    card.classList.add('vani-pointer-card');
    attachCardTracking(card);
  };

  const initCards = () => {
    ['#overview .vani-overview__product', '#product-showcase .showcase-tab'].forEach(
      (sel) => {
        document.querySelectorAll(sel).forEach(registerCard);
      }
    );

    document.querySelectorAll('main section:not(#home) [class*="rounded-2xl"].border, main section:not(#home) [class*="rounded-3xl"].border').forEach(
      (el) => {
        if (el.matches('input, textarea, select, button')) return;
        if (el.closest('#delivery-projects')) return;
        if (el.closest('#services.vani-services-redesign')) return;
        registerCard(el);
      }
    );
  };

  const detachMagnetic = () => {
    state.magneticHandlers.forEach(({ el, onMove, onLeave }) => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      el.style.transform = '';
    });
    state.magneticHandlers = [];
  };

  const initMagnetic = () => {
    detachMagnetic();
    if (!config.magnetic || prefersReduced()) return;

    document.querySelectorAll('.btn-primary, .btn-secondary').forEach((btn) => {
      if (!isEligibleTarget(btn)) return;
      if (btn.closest('form')) return;
      if (btn.type === 'submit') return;

      const onMove = (event) => {
        const rect = btn.getBoundingClientRect();
        const dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
        const dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
        btn.style.transform = `translate3d(${(dx * 5).toFixed(2)}px, ${(dy * 4).toFixed(2)}px, 0)`;
      };
      const onLeave = () => {
        btn.style.transform = '';
      };
      btn.addEventListener('mousemove', onMove, { passive: true });
      btn.addEventListener('mouseleave', onLeave, { passive: true });
      state.magneticHandlers.push({ el: btn, onMove, onLeave });
    });
  };

  const spawnRipple = (event) => {
    if (!config.ripple || prefersReduced()) return;
    if (event.button !== 0) return;
    const target = event.target.closest('a, button, .vani-pointer-card, .btn-primary, [role="tab"]');
    if (!target || !isEligibleTarget(target)) return;

    const size = 48;
    const ripple = document.createElement('span');
    ripple.className = 'vani-click-ripple vani-click-ripple--fixed';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - size / 2}px`;
    ripple.style.top = `${event.clientY - size / 2}px`;
    document.body.appendChild(ripple);
    ripple.addEventListener(
      'animationend',
      () => ripple.remove(),
      { once: true }
    );
  };

  const bindRipples = () => {
    if (typeof state.rippleAbort === 'function') state.rippleAbort();
    if (!config.ripple || prefersReduced()) return;

    const ac = new AbortController();
    document.addEventListener('pointerdown', spawnRipple, { passive: true, signal: ac.signal });
    state.rippleAbort = () => ac.abort();
  };

  const bindGlobalPointer = () => {
    teardownGlobalPointer();
    if (prefersReduced()) return;
    if (!config.glow && !config.parallax && !config.cursor) return;

    let finePointer = false;
    try {
      finePointer = window.matchMedia('(pointer: fine)').matches;
    } catch (e) {
      finePointer = true;
    }
    if (!finePointer) return;

    const ac = new AbortController();
    const opts = { passive: true, signal: ac.signal };
    window.addEventListener('mousemove', onPointerMove, opts);
    window.addEventListener('mouseleave', onPointerLeave, opts);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && state.rafId) {
        window.cancelAnimationFrame(state.rafId);
        state.running = false;
        state.rafId = 0;
      }
    }, opts);

    state.abort = () => ac.abort();
  };

  const applyTier = () => {
    config = tierConfig(getPointerTier());
    if (!config.glow && state.glowEl) {
      state.glowEl.remove();
      state.glowEl = null;
    } else {
      initCursorGlow();
    }
    initCustomCursor();
    if (!config.cardTrack) detachCardTracking();
    else document.querySelectorAll('.vani-pointer-card').forEach(attachCardTracking);
    initMagnetic();
    bindRipples();
    syncParallaxLayers();
    bindGlobalPointer();
  };

  const boot = () => {
    applyTier();
    initCards();
    window.addEventListener('vani:experience-tier', applyTier);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  window.addEventListener(
    'pagehide',
    () => {
      teardownGlobalPointer();
      detachCardTracking();
      detachMagnetic();
      if (typeof state.rippleAbort === 'function') state.rippleAbort();
      teardownCustomCursor();
      if (state.glowEl) state.glowEl.remove();
      window.removeEventListener('vani:experience-tier', applyTier);
      htmlEl.style.removeProperty('--vani-parallax-x');
      htmlEl.style.removeProperty('--vani-parallax-y');
    },
    { once: true }
  );
})();
