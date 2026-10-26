/**
 * PROJECT DELIVERED — 3D tilt + radial shine (desktop pointer only).
 */
(function initVaniDeliveryTilt() {
  'use strict';

  if (window.__vaniDeliveryTiltInit) return;
  window.__vaniDeliveryTiltInit = true;

  const SECTION_SEL = '#delivery-projects.vani-delivery-tilt-section';
  const CARD_SEL = `${SECTION_SEL} #delivery-grid .product-card`;

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

  const init = () => {
    if (!document.querySelector(SECTION_SEL)) return;
    if (prefersReduced() || !canHoverTilt()) return;

    document.querySelectorAll(CARD_SEL).forEach((card) => {
      card.classList.remove('vani-pointer-card');
      card.style.removeProperty('--vani-tilt-x');
      card.style.removeProperty('--vani-tilt-y');
      card.style.removeProperty('--vani-card-x');
      card.style.removeProperty('--vani-card-y');
      card.classList.add('vani-delivery-tilt-card');

      let rafId = 0;
      let targetRx = 0;
      let targetRy = 0;
      let currentRx = 0;
      let currentRy = 0;
      const maxTilt = 7;

      const tick = () => {
        currentRx += (targetRx - currentRx) * 0.2;
        currentRy += (targetRy - currentRy) * 0.2;
        card.style.setProperty('--vani-delivery-rx', `${currentRx.toFixed(3)}deg`);
        card.style.setProperty('--vani-delivery-ry', `${currentRy.toFixed(3)}deg`);

        if (Math.abs(targetRx - currentRx) > 0.025 || Math.abs(targetRy - currentRy) > 0.025) {
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
        card.style.setProperty('--vani-delivery-shine-x', `${px.toFixed(2)}%`);
        card.style.setProperty('--vani-delivery-shine-y', `${py.toFixed(2)}%`);

        const cx = (event.clientX - rect.left) / rect.width - 0.5;
        const cy = (event.clientY - rect.top) / rect.height - 0.5;
        targetRy = cx * maxTilt * 2;
        targetRx = -cy * maxTilt * 2;
        scheduleTick();
      };

      const onLeave = () => {
        targetRx = 0;
        targetRy = 0;
        card.style.setProperty('--vani-delivery-shine-x', '50%');
        card.style.setProperty('--vani-delivery-shine-y', '50%');
        scheduleTick();
      };

      card.addEventListener('mousemove', onMove, { passive: true });
      card.addEventListener('mouseleave', onLeave, { passive: true });
    });
  };

  const boot = () => {
    window.requestAnimationFrame(init);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
