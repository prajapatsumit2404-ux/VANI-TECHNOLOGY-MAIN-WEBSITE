/**
 * Vani scroll motion — vanilla MPA (HTML/CSS/JS, no React).
 *
 * Animation stack (existing, not replaced):
 * - Home hero: Three.js + AOS inside #home only (untouched by this module).
 * - About/Services/Delivery stats: AOS via main.js initAOS() — nodes with [data-aos] are skipped here.
 * - #products: GSAP scroll reveal in main.js initVaniProductsScrollReveal().
 * - This module: GSAP + ScrollTrigger (CDN) when available; IntersectionObserver fallback otherwise.
 *
 * No scroll hijacking, no wheel listeners, transform/opacity only, prefers-reduced-motion respected.
 */
(function initVaniScrollMotion() {
  'use strict';

  if (window.__vaniScrollMotionInit) return;
  window.__vaniScrollMotionInit = true;

  const ctx = window.VaniSiteContext;
  if (!ctx) return;

  const HOME_ID = 'home';
  const SKIP_SECTION_IDS = new Set(['products']);
  /** Cap triggers per section for mobile performance */
  const MAX_ITEMS_PER_HOST = 22;

  const getMotionTier = () => {
    const fromDom = document.documentElement.dataset.vaniMotionTier;
    if (fromDom === 'minimal' || fromDom === 'reduced' || fromDom === 'full') return fromDom;
    return window.VaniExperience?.getMotionTier?.() || 'full';
  };

  let reducedMotion = false;
  try {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    reducedMotion = false;
  }

  const getViewportBand = () => document.documentElement.dataset.vaniViewport || 'desktop';

  const isMotionMinimal = () => reducedMotion || getMotionTier() === 'minimal';
  const isMotionReduced = () => !isMotionMinimal() && getMotionTier() === 'reduced';

  const canUseGsapScroll = () =>
    typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !isMotionMinimal();

  /** @type {boolean} */
  let hasGsapScroll = canUseGsapScroll();

  if (hasGsapScroll) {
    try {
      gsap.registerPlugin(ScrollTrigger);
    } catch (e) {
      /* already registered */
    }
  }

  const hosts = new Set();
  const observers = [];
  const scrollTriggers = [];
  let refreshTimer = 0;
  let scrollRaf = 0;
  let scrollAbort = null;
  let failSafeTimer = 0;
  /** @type {{ host: Element, layer: Element }[]} */
  let decorEntries = [];

  const DUR = () => (isMotionReduced() ? 0.45 : 0.58);
  const STAGGER = () => (isMotionReduced() ? 0.05 : 0.08);
  const Y = () => (isMotionReduced() ? 10 : 22);
  const X = () => (isMotionReduced() ? 16 : 28);

  const isVisibleInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
  };

  const shouldSkipNode = (node) => {
    if (!node) return true;
    if (node.closest(`#${HOME_ID}`)) return true;
    if (node.closest('#products')) return true;
    if (node.closest('[data-aos]')) return true;
    if (node.closest('.vani-prod-hero-canvas, .showcase-phone-wrap, .vani-prod-phone-stage')) return true;
    if (node.closest('#hero-three-canvas, #hero-3d-scene-container')) return true;
    if (node.closest('button, input, textarea, select, label')) return true;
    return false;
  };

  const CARD_SELECTOR =
    '.vani-overview__product, .vani-pm__product, .showcase-tab';

  const markScrollItem = (el, effect) => {
    if (shouldSkipNode(el)) return;
    if (el.classList.contains('vani-scroll-item')) return;
    el.classList.add('vani-scroll-item');
    el.dataset.vaniScrollEffect = effect;
  };

  const markItemsInSection = (section) => {
    let storyIndex = 0;
    let marked = 0;
    const cap = () => marked >= MAX_ITEMS_PER_HOST;

    const mark = (el, effect) => {
      if (cap()) return;
      markScrollItem(el, effect);
      if (el.classList.contains('vani-scroll-item')) marked += 1;
    };

    section.querySelectorAll('.vani-overview__hero-copy > .vani-overview__eyebrow, .vani-overview__hero-copy > .vani-overview__title, .vani-overview__hero-copy > .vani-overview__lead, .vani-overview__hero-copy > .vani-overview__actions').forEach((el) =>
      mark(el, 'fade-up')
    );
    section.querySelectorAll('.vani-overview__frame, .vani-overview__float').forEach((el) => mark(el, 'image-reveal'));
    section.querySelectorAll('.vani-overview__story').forEach((el) => {
      mark(el, storyIndex % 2 === 0 ? 'slide-left' : 'slide-right');
      storyIndex += 1;
    });
    section.querySelectorAll('.vani-pm__header, .vani-pm__stage').forEach((el) => mark(el, 'fade-up'));
    section.querySelectorAll('.vani-pm__product').forEach((el) => mark(el, 'scale'));
    section.querySelectorAll('#product-showcase .text-center').forEach((el) => mark(el, 'fade-up'));
    section.querySelectorAll('#product-showcase .showcase-tab').forEach((el) => mark(el, 'scale'));
    section.querySelectorAll('#contact .text-center, #contact .glass-card').forEach((el) => mark(el, 'fade-up'));
    section.querySelectorAll('#contact form').forEach((el) => mark(el, 'fade-up'));
    section.querySelectorAll('footer [class*="grid"] > div').forEach((el) => mark(el, 'fade-up'));

    section.querySelectorAll('h2').forEach((heading) => {
      if (cap() || shouldSkipNode(heading)) return;
      const block = heading.closest('.text-center, .vani-pm__header') || heading;
      if (block.classList.contains('vani-scroll-item')) return;
      mark(block, 'fade-up');
    });
  };

  const markStandaloneItems = () => {
    const main = document.querySelector('main');
    if (!main) return;

    let marked = 0;
    main.querySelectorAll(':scope > .max-w-7xl, :scope > section, :scope > div.max-w-md').forEach((block, i) => {
      if (marked >= MAX_ITEMS_PER_HOST) return;
      if (shouldSkipNode(block)) return;
      if (block.classList.contains('vani-scroll-item')) return;
      if (block.querySelector('.vani-ambient-layer')) return;
      markScrollItem(block, i % 2 === 0 ? 'fade-up' : 'slide-left');
      if (block.classList.contains('vani-scroll-item')) marked += 1;
    });
  };

  const revealItem = (item) => {
    item.classList.add('is-vm-revealed');
    item.style.willChange = 'auto';
  };

  const forceRevealAll = () => {
    document.querySelectorAll('.vani-scroll-item:not(.is-vm-revealed)').forEach((el) => {
      if (hasGsapScroll) gsap.set(el, { clearProps: 'opacity,transform,clipPath' });
      revealItem(el);
    });
  };

  const getFromVars = (effect) => {
    switch (effect) {
      case 'slide-left':
        return { opacity: 0, x: -X(), force3D: true };
      case 'slide-right':
        return { opacity: 0, x: X(), force3D: true };
      case 'scale':
        return { opacity: 0, scale: isMotionReduced() ? 0.97 : 0.94, y: Y() * 0.25, force3D: true };
      case 'image-reveal':
        return { opacity: 0.9, clipPath: 'inset(0 0 100% 0 round 2px)', force3D: true };
      default:
        return { opacity: 0, y: Y(), force3D: true };
    }
  };

  const getToVars = (effect) => {
    const base = { duration: DUR(), ease: 'power2.out', overwrite: 'auto', force3D: true };
    switch (effect) {
      case 'slide-left':
      case 'slide-right':
        return { ...base, opacity: 1, x: 0 };
      case 'scale':
        return { ...base, opacity: 1, scale: 1, y: 0 };
      case 'image-reveal':
        return { ...base, opacity: 1, clipPath: 'inset(0 0 0% 0 round 2px', duration: DUR() + 0.06, ease: 'power3.out' };
      default:
        return { ...base, opacity: 1, y: 0 };
    }
  };

  const registerScrollTrigger = (config) => {
    if (!hasGsapScroll) return null;
    try {
      const st = ScrollTrigger.create(config);
      scrollTriggers.push(st);
      return st;
    } catch (e) {
      return null;
    }
  };

  const bindGsapEffects = (host) => {
    if (!canUseGsapScroll()) return false;
    if (host.getAttribute('data-vani-scroll-effects') === '1') return true;

    host.classList.add('is-vm-gsap', 'is-vm-active');

    registerScrollTrigger({
      trigger: host,
      start: 'top 92%',
      end: 'bottom 8%',
      onToggle: (self) => host.classList.toggle('is-vm-section-active', self.isActive),
    });

    const items = [...host.querySelectorAll('.vani-scroll-item')];
    if (!items.length) return true;

    const processed = new Set();
    const staggerParents = new Set();
    items.forEach((el) => {
      if (!el.matches(CARD_SELECTOR)) return;
      const grid = el.closest('.vani-overview__products, [role="tablist"], .vani-pm__rail');
      if (grid) staggerParents.add(grid);
    });

    staggerParents.forEach((parent) => {
      const cards = [...parent.querySelectorAll('.vani-scroll-item')].filter((c) => c.matches(CARD_SELECTOR));
      if (cards.length < 2) return;

      cards.forEach((card) => {
        gsap.set(card, getFromVars('scale'));
        processed.add(card);
      });

      const tl = gsap.timeline({ paused: true });
      tl.to(cards, {
        ...getToVars('scale'),
        stagger: STAGGER(),
        onComplete: () => cards.forEach(revealItem),
        onReverseComplete: () => cards.forEach((c) => c.classList.remove('is-vm-revealed')),
      });

      registerScrollTrigger({
        trigger: parent,
        start: 'top 86%',
        end: 'bottom 12%',
        animation: tl,
        toggleActions: 'play reverse play reverse',
      });
    });

    const solo = items.filter((el) => !processed.has(el));
    const byEffect = solo.reduce((acc, el) => {
      const key = el.dataset.vaniScrollEffect || 'fade-up';
      if (!acc[key]) acc[key] = [];
      acc[key].push(el);
      return acc;
    }, /** @type {Record<string, Element[]>} */ ({}));

    Object.keys(byEffect).forEach((effect) => {
      const group = byEffect[effect];
      group.forEach((el) => {
        let target = el;
        if (effect === 'image-reveal') {
          const img = el.querySelector('img');
          if (img) target = img;
        }
        gsap.set(target, getFromVars(effect));
      });

      ScrollTrigger.batch(group, {
        start: 'top 88%',
        end: 'bottom 14%',
        onEnter: (batch) => {
          batch.forEach((el) => {
            const img = el.querySelector('img');
            const target = effect === 'image-reveal' && img ? img : el;
            gsap.to(target, {
              ...getToVars(effect),
              onComplete: () => revealItem(el),
            });
          });
        },
        onLeave: (batch) => {
          batch.forEach((el) => {
            const img = el.querySelector('img');
            const target = effect === 'image-reveal' && img ? img : el;
            gsap.to(target, { ...getFromVars(effect), duration: 0.32 });
            el.classList.remove('is-vm-revealed');
          });
        },
        onEnterBack: (batch) => {
          batch.forEach((el) => {
            const img = el.querySelector('img');
            const target = effect === 'image-reveal' && img ? img : el;
            gsap.to(target, { ...getToVars(effect), onComplete: () => revealItem(el) });
          });
        },
        onLeaveBack: (batch) => {
          batch.forEach((el) => {
            const img = el.querySelector('img');
            const target = effect === 'image-reveal' && img ? img : el;
            gsap.to(target, { ...getFromVars(effect), duration: 0.32 });
            el.classList.remove('is-vm-revealed');
          });
        },
      });
    });

    solo.forEach((el) => {
      if (isVisibleInViewport(el)) {
        const effect = el.dataset.vaniScrollEffect || 'fade-up';
        const img = el.querySelector('img');
        const target = effect === 'image-reveal' && img ? img : el;
        gsap.set(target, getToVars(effect));
        revealItem(el);
      }
    });

    if (host.id === 'main-footer' || host.tagName === 'FOOTER') {
      const footerRoot = host.matches('footer') ? host : host.closest('footer') || host;
      registerScrollTrigger({
        trigger: footerRoot,
        start: 'top 95%',
        onEnter: () => footerRoot.classList.add('is-vm-footer-in'),
        onLeaveBack: () => footerRoot.classList.remove('is-vm-footer-in'),
      });
    }

    host.setAttribute('data-vani-scroll-effects', '1');
    return true;
  };

  const bindObserverReveals = (host, items) => {
    host.classList.add('is-vm-active');
    items.forEach((item) => {
      if (isVisibleInViewport(item)) revealItem(item);
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) revealItem(entry.target);
          else entry.target.classList.remove('is-vm-revealed');
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    items.forEach((item) => io.observe(item));
    observers.push(io);
  };

  const shouldRunParallax = () => {
    if (!canUseGsapScroll() || isMotionMinimal()) return false;
    const vp = getViewportBand();
    if (vp === 'mobile' || vp === 'tablet') return false;
    return true;
  };

  const killAllScrollTriggers = () => {
    scrollTriggers.forEach((st) => {
      try {
        st.kill();
      } catch (e) {
        /* ignore */
      }
    });
    scrollTriggers.length = 0;
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    }
    hosts.forEach((host) => {
      host.removeAttribute('data-vani-scroll-effects');
    });
  };

  let lastMotionMinimal = isMotionMinimal();

  const rebindAllHostEffects = () => {
    if (!canUseGsapScroll()) return;
    hosts.forEach((host) => {
      host.classList.remove('is-vm-reduced');
      host.classList.add('is-vm-gsap', 'is-vm-active');
      bindGsapEffects(host);
    });
  };

  const bindParallaxDecor = () => {
    if (!shouldRunParallax()) return;

    const parallaxSelectors = [
      { sel: '#overview .vani-overview__rail', y: isMotionReduced() ? 14 : 22 },
      { sel: '#product-showcase .showcase-grid-bg', y: isMotionReduced() ? 10 : 16 },
    ];

    parallaxSelectors.forEach(({ sel, y }) => {
      document.querySelectorAll(sel).forEach((layer) => {
        if (shouldSkipNode(layer)) return;
        const host = layer.closest('section');
        if (!host || host.id === HOME_ID) return;
        layer.setAttribute('aria-hidden', 'true');
        gsap.to(layer, {
          y,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: host,
            start: 'top bottom',
            end: 'bottom top',
            scrub: isMotionReduced() ? 0.9 : 0.6,
          },
        });
      });
    });
  };

  const setupHost = (host) => {
    if (!host || hosts.has(host)) return;
    if (host.id === HOME_ID) return;
    if (SKIP_SECTION_IDS.has(host.id)) return;
    if (!ctx.isEnhancementAllowed({ kind: 'scroll-reveal', element: host })) return;

    hosts.add(host);
    host.classList.add('vani-scroll-host');

    if (host.tagName === 'SECTION' || host.tagName === 'FOOTER') markItemsInSection(host);

    const items = host.querySelectorAll('.vani-scroll-item');
    if (!items.length) return;

    if (isMotionMinimal()) {
      host.classList.add('is-vm-reduced');
      items.forEach(revealItem);
      return;
    }

    if (isMotionReduced()) host.classList.add('is-vm-reduced-intensity');

    const usedGsap = bindGsapEffects(host);
    if (!usedGsap) bindObserverReveals(host, items);

    const hostIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          host.classList.toggle('is-vm-inview', entry.isIntersecting);
        });
      },
      { threshold: 0.05 }
    );
    hostIo.observe(host);
    observers.push(hostIo);
  };

  const collectHosts = () => {
    if (ctx.isHomeDocument) {
      const main = document.querySelector('main');
      if (!main) return;
      main.querySelectorAll('section[id]').forEach((section) => {
        if (section.id === HOME_ID) return;
        if (SKIP_SECTION_IDS.has(section.id)) return;
        setupHost(section);
      });
      const footer = document.getElementById('main-footer');
      if (footer) setupHost(footer);
      return;
    }

    markStandaloneItems();
    setupHost(document.querySelector('main') || document.body);
    const footer = document.getElementById('main-footer');
    if (footer) setupHost(footer);
  };

  const refreshScrollLayout = () => {
    if (!hasGsapScroll) return;
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => {
      try {
        ScrollTrigger.refresh();
      } catch (e) {
        /* ignore */
      }
    }, 120);
  };

  const onExperienceTierChange = () => {
    hasGsapScroll = canUseGsapScroll();
    const nowMinimal = isMotionMinimal();

    if (nowMinimal) {
      killAllScrollTriggers();
      teardownDecorativeScroll();
      forceRevealAll();
      hosts.forEach((host) => host.classList.add('is-vm-reduced'));
      lastMotionMinimal = true;
      return;
    }

    if (lastMotionMinimal) {
      lastMotionMinimal = false;
      killAllScrollTriggers();
      rebindAllHostEffects();
    }

    teardownDecorativeScroll();
    bindDecorativeScroll();
    bindParallaxDecor();
    refreshScrollLayout();
  };

  const bindLayoutRefresh = () => {
    window.addEventListener('load', refreshScrollLayout, { once: true });
    window.addEventListener('resize', refreshScrollLayout, { passive: true });
    window.addEventListener('vani:experience-tier', onExperienceTierChange);

    document.querySelectorAll('img').forEach((img) => {
      if (img.complete) return;
      img.addEventListener('load', refreshScrollLayout, { once: true });
      img.addEventListener('error', refreshScrollLayout, { once: true });
    });
  };

  const rebuildDecorCache = () => {
    decorEntries = [];
    document.querySelectorAll('.vani-scroll-host').forEach((host) => {
      const layer =
        host.querySelector(':scope > .vani-ambient-layer .vani-ambient__gradient')
        || host.querySelector('.vani-ambient-page .vani-ambient__gradient');
      if (layer) decorEntries.push({ host, layer });
    });
  };

  const teardownDecorativeScroll = () => {
    if (scrollRaf) window.cancelAnimationFrame(scrollRaf);
    scrollRaf = 0;
    if (typeof scrollAbort === 'function') scrollAbort();
    scrollAbort = null;
    decorEntries.forEach(({ layer }) => {
      layer.style.transform = '';
    });
  };

  const bindDecorativeScroll = () => {
    teardownDecorativeScroll();
    if (isMotionMinimal() || getViewportBand() === 'mobile') return;

    rebuildDecorCache();
    if (!decorEntries.length) return;

    const ac = new AbortController();
    scrollAbort = () => ac.abort();

    const shiftCap = isMotionReduced() ? 5 : 8;
    const shiftGain = isMotionReduced() ? 6 : 12;
    const vh = window.innerHeight || 1;

    const update = () => {
      scrollRaf = 0;
      decorEntries.forEach(({ host, layer }) => {
        if (!host.classList.contains('is-vm-inview')) return;
        const rect = host.getBoundingClientRect();
        const center = rect.top + rect.height * 0.5;
        const progress = (vh * 0.5 - center) / vh;
        const shift = Math.max(-shiftCap, Math.min(shiftCap, progress * shiftGain));
        layer.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
      });
    };

    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true, signal: ac.signal });
    window.addEventListener(
      'vani:experience-tier',
      () => {
        teardownDecorativeScroll();
        bindDecorativeScroll();
      },
      { signal: ac.signal }
    );
    update();
  };

  const boot = () => {
    try {
      collectHosts();
      bindParallaxDecor();
      bindDecorativeScroll();
      bindLayoutRefresh();
      refreshScrollLayout();
    } catch (e) {
      forceRevealAll();
    }

    failSafeTimer = window.setTimeout(forceRevealAll, 4500);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  window.addEventListener(
    'pagehide',
    () => {
      window.clearTimeout(refreshTimer);
      window.clearTimeout(failSafeTimer);
      observers.forEach((io) => io.disconnect());
      scrollTriggers.forEach((st) => {
        try {
          st.kill();
        } catch (e) {
          /* ignore */
        }
      });
      if (hasGsapScroll && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      }
      teardownDecorativeScroll();
    },
    { once: true }
  );

  window.VaniScrollMotion = Object.freeze({
    refresh: refreshScrollLayout,
    revealAll: forceRevealAll,
  });
})();
