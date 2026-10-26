/**
 * Services dashboard (#services.vani-services-redesign) — stagger reveal + restrained tilt.
 */
(function initVaniServicesRedesign() {
  'use strict';

  if (window.__vaniServicesRedesignInit) return;
  window.__vaniServicesRedesignInit = true;

  const SECTION_SEL = '#services.vani-services-redesign';
  const CARD_SEL = `${SECTION_SEL} .service-card`;

  const prefersReduced = () => {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  };

  const canHoverTilt = () => {
    try {
      return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    } catch (e) {
      return false;
    }
  };

  const attachFeaturedPanel = (section) => {
    const featured = section.querySelector('.vani-svc-dash__featured-card');
    if (!featured || featured.querySelector('.vani-svc-dash__featured-panel')) return;
    const panel = document.createElement('div');
    panel.className = 'vani-svc-dash__featured-panel';
    panel.setAttribute('aria-hidden', 'true');
    featured.appendChild(panel);
  };

  const initTilt = (section) => {
    if (prefersReduced() || !canHoverTilt()) return;

    section.querySelectorAll(CARD_SEL).forEach((card) => {
      card.classList.remove('vani-pointer-card');
      card.style.removeProperty('--vani-tilt-x');
      card.style.removeProperty('--vani-tilt-y');
      card.style.removeProperty('--vani-card-x');
      card.style.removeProperty('--vani-card-y');
      card.classList.add('vani-svc-dash-tilt-card');

      let rafId = 0;
      let targetRx = 0;
      let targetRy = 0;
      let currentRx = 0;
      let currentRy = 0;
      const maxTilt = 4.5;

      const tick = () => {
        currentRx += (targetRx - currentRx) * 0.22;
        currentRy += (targetRy - currentRy) * 0.22;
        card.style.setProperty('--vani-svc-rx', `${currentRx.toFixed(3)}deg`);
        card.style.setProperty('--vani-svc-ry', `${currentRy.toFixed(3)}deg`);

        if (Math.abs(targetRx - currentRx) > 0.02 || Math.abs(targetRy - currentRy) > 0.02) {
          rafId = window.requestAnimationFrame(tick);
        } else {
          rafId = 0;
        }
      };

      const scheduleTick = () => {
        if (!rafId) rafId = window.requestAnimationFrame(tick);
      };

      const onMove = (event) => {
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const px = ((event.clientX - rect.left) / rect.width) * 100;
        const py = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--vani-svc-shine-x', `${px.toFixed(2)}%`);
        card.style.setProperty('--vani-svc-shine-y', `${py.toFixed(2)}%`);

        const cx = (event.clientX - rect.left) / rect.width - 0.5;
        const cy = (event.clientY - rect.top) / rect.height - 0.5;
        targetRy = cx * maxTilt * 2;
        targetRx = -cy * maxTilt * 2;
        scheduleTick();
      };

      const onLeave = () => {
        targetRx = 0;
        targetRy = 0;
        card.style.setProperty('--vani-svc-shine-x', '50%');
        card.style.setProperty('--vani-svc-shine-y', '50%');
        scheduleTick();
      };

      card.addEventListener('mousemove', onMove, { passive: true });
      card.addEventListener('mouseleave', onLeave, { passive: true });
    });
  };

  const init = () => {
    const section = document.querySelector(SECTION_SEL);
    if (!section) return;
    attachFeaturedPanel(section);
    initTilt(section);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
