/**
 * Vani Product Motion Showcase — Phase 3 & Phase 4 Controller
 * Scoped exclusively to #vani-product-motion.
 * - One-time scroll-triggered entrance sequence (no continuous CPU loops)
 * - Accessible click/tap/keyboard switching across verified products
 * - Full prefers-reduced-motion compliance and zero layout shift
 */
(function initVaniProductMotion() {
  const ROOT_ID = 'vani-product-motion';
  const root = document.getElementById(ROOT_ID);
  if (!root || root.dataset.pmInit === '1') return;

  const isReducedMotion = () => {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  };

  const WORKSPACES = {
    aitalksy: {
      title: 'AI Talksy · Conversational AI Workspace',
      logo: 'assets/images/portfolio/aitalksy-logo.png',
      pill: 'Simulated workflow',
      windowTitle: 'Inbox · Omnichannel Router',
      nodes: ['Inbound Chat', 'Intent Engine', 'CRM Sync'],
      msgIn: 'Hello, I need help checking my order status and invoice.',
      msgInMeta: 'Visitor · Web chat',
      msgOut: 'Intent matched: Order Lookup. Dispatched status & PDF invoice synced to thread.',
      msgOutMeta: 'AI Talksy · Automated response',
      chips: ['Web', 'WhatsApp', 'Slack'],
      bars: ['55%', '82%', '68%', '94%'],
      visualSrc: 'assets/images/portfolio/Tablet-Screens-presentation-Mock-up.png',
      visualAlt: 'Multi-device product interface mockup from Vani Technologies portfolio',
      tagPrimary: 'Multi-device UI',
      tagSecondary: 'Verified asset',
      status: 'Workflow ready · Demo',
    },
    community: {
      title: 'Community Forum · Member & Discussion Hub',
      logo: 'assets/images/portfolio/community-forum-logo.png',
      pill: 'Community preview',
      windowTitle: 'Forum · Member & Thread Hub',
      nodes: ['Member Verify', 'Topic Threads', 'Directory Index'],
      msgIn: 'How are regional chapters organizing upcoming developer meetups?',
      msgInMeta: 'Verified Member · Discussions',
      msgOut: 'Thread indexed in Events & Directory. Member notifications staged for chapter leads.',
      msgOutMeta: 'Community Forum · Hub state',
      chips: ['Directory', 'Discussions', 'Events'],
      bars: ['64%', '78%', '88%', '72%'],
      visualSrc: 'assets/images/portfolio/Mockup_11.png',
      visualAlt: 'Mobile application interface mockup from Vani Technologies portfolio',
      tagPrimary: 'Mobile & Web',
      tagSecondary: 'Community hub',
      status: 'Directory active · Demo',
    },
    traveljioo: {
      title: 'TravelJioo · B2B Travel CRM & Itinerary Engine',
      logo: 'assets/images/portfolio/ratehonk-logo.png',
      pill: 'CRM pipeline demo',
      windowTitle: 'TravelJioo · Deal Pipeline',
      nodes: ['Lead Capture', 'Quote Builder', 'Voucher PDF'],
      msgIn: 'Enquiry logged: Bali & Singapore · 7 nights · ₹85,000 package quote.',
      msgInMeta: 'Agency Lead · Deal pipeline',
      msgOut: 'Flight & hotel segments attached to quote. Proposal voucher staged for export.',
      msgOutMeta: 'TravelJioo · Pipeline update',
      chips: ['Pipeline', 'Itineraries', 'Commissions'],
      bars: ['72%', '54%', '90%', '80%'],
      visualSrc: 'assets/images/portfolio/3.png',
      visualAlt: 'Platform application screens from Vani Technologies portfolio',
      tagPrimary: 'Tour CRM',
      tagSecondary: 'Quote workflow',
      status: 'Pipeline synced · Demo',
    },
  };

  let io = null;
  let introTl = null;
  let switchTl = null;
  let hasPlayed = false;
  let currentKey = 'aitalksy';

  const q = (sel, ctx = root) => ctx.querySelector(sel);
  const qa = (sel, ctx = root) => [...ctx.querySelectorAll(sel)];

  const productBtns = qa('[data-pm-select]');
  const stage = q('.vani-pm__stage');
  const stageLogo = q('[data-pm-stage-logo]');
  const stageLabel = q('[data-pm-stage-label]');
  const stagePill = q('[data-pm-stage-pill]');
  const windowTitle = q('[data-pm-window-title]');
  const msgInText = q('[data-pm-msg-in-text]');
  const msgInMeta = q('[data-pm-msg-in-meta]');
  const msgOutText = q('[data-pm-msg-out-text]');
  const msgOutMeta = q('[data-pm-msg-out-meta]');
  const visualImg = q('[data-pm-visual-img]');
  const tagPrimary = q('[data-pm-tag-primary]');
  const tagSecondary = q('[data-pm-tag-secondary]');
  const statusEl = q('[data-pm-status]');
  const nodes = qa('[data-pm-node]');
  const connectors = qa('[data-pm-connector]');
  const bars = qa('[data-pm-bar]');
  const chips = qa('[data-pm-chip]');

  const applyWorkspaceData = (key) => {
    const data = WORKSPACES[key];
    if (!data) return;
    currentKey = key;

    productBtns.forEach((btn) => {
      const active = btn.getAttribute('data-pm-select') === key;
      btn.classList.toggle('is-featured', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    if (stage) stage.setAttribute('data-vani-pm-stage', key);
    if (stageLogo) stageLogo.src = data.logo;
    if (stageLabel) stageLabel.textContent = data.title;
    if (stagePill) stagePill.textContent = data.pill;
    if (windowTitle) windowTitle.textContent = data.windowTitle;
    if (msgInText) msgInText.textContent = data.msgIn;
    if (msgInMeta) msgInMeta.textContent = data.msgInMeta;
    if (msgOutText) msgOutText.textContent = data.msgOut;
    if (msgOutMeta) msgOutMeta.textContent = data.msgOutMeta;
    if (visualImg && visualImg.getAttribute('src') !== data.visualSrc) {
      visualImg.src = data.visualSrc;
      visualImg.alt = data.visualAlt;
    }
    if (tagPrimary) tagPrimary.textContent = data.tagPrimary;
    if (tagSecondary) tagSecondary.textContent = data.tagSecondary;
    if (statusEl) statusEl.textContent = data.status;

    data.nodes.forEach((label, idx) => {
      const t = q(`[data-pm-node-text="${idx}"]`);
      if (t) t.textContent = label;
    });

    data.chips.forEach((label, idx) => {
      const chip = chips[idx];
      if (chip) {
        chip.textContent = label;
        chip.classList.toggle('is-on', idx === 0);
      }
    });

    data.bars.forEach((h, idx) => {
      const bar = bars[idx];
      if (bar) bar.style.setProperty('--bar-h', h);
    });
  };

  const selectWorkspace = (key) => {
    if (!WORKSPACES[key] || key === currentKey) return;

    if (isReducedMotion() || typeof gsap === 'undefined') {
      applyWorkspaceData(key);
      return;
    }

    if (switchTl) switchTl.kill();
    const targets = [q('.vani-pm__ui-window'), q('.vani-pm__visual-frame'), q('.vani-pm__flow')].filter(Boolean);

    switchTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    switchTl
      .to(targets, { opacity: 0.35, y: 4, duration: 0.14 })
      .add(() => applyWorkspaceData(key))
      .fromTo(
        connectors,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.26, stagger: 0.06 },
        '>'
      )
      .fromTo(
        bars,
        { scaleY: 0.25 },
        { scaleY: 1, duration: 0.28, stagger: 0.04 },
        '<'
      )
      .to(targets, { opacity: 1, y: 0, duration: 0.24 }, '<');
  };

  productBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-pm-select');
      if (key) selectWorkspace(key);
    });
  });

  const playEntranceOnce = () => {
    if (hasPlayed) return;
    hasPlayed = true;
    root.classList.add('is-pm-played');

    if (isReducedMotion() || typeof gsap === 'undefined') {
      root.classList.add('is-pm-complete');
      return;
    }

    const headerEls = qa('[data-pm-anim="header"]');
    const msgEls = [q('[data-pm-msg-in]'), q('[data-pm-msg-out]')].filter(Boolean);
    const workflowCopyEls = qa('[data-pm-anim="workflow-copy"]');
    const stepEls = qa('.vani-pm__steps li');
    const supportEls = qa('.vani-pm__support-item');

    introTl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        root.classList.add('is-pm-complete');
      },
    });

    introTl
      .fromTo(headerEls, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 }, 0)
      .fromTo(productBtns, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.07 }, 0.1)
      .fromTo(stage, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.48 }, 0.16)
      .fromTo(nodes, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.08 }, 0.32)
      .fromTo(connectors, { scaleX: 0 }, { scaleX: 1, duration: 0.32, stagger: 0.08 }, 0.38)
      .fromTo(msgEls, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.34, stagger: 0.12 }, 0.48)
      .fromTo(bars, { scaleY: 0 }, { scaleY: 1, duration: 0.38, stagger: 0.05 }, 0.62)
      .fromTo(workflowCopyEls, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 }, 0.7)
      .fromTo(stepEls, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.36, stagger: 0.08 }, 0.82)
      .fromTo(supportEls, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.36, stagger: 0.07 }, 0.95);
  };

  root.dataset.pmInit = '1';

  if (isReducedMotion() || typeof gsap === 'undefined') {
    root.classList.add('is-pm-played', 'is-pm-complete');
    return;
  }

  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playEntranceOnce();
            if (io) {
              io.disconnect();
              io = null;
            }
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(root);
  } else {
    playEntranceOnce();
  }

  window.addEventListener(
    'pagehide',
    () => {
      if (io) {
        io.disconnect();
        io = null;
      }
      if (introTl) introTl.kill();
      if (switchTl) switchTl.kill();
    },
    { once: true }
  );
})();
