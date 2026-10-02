/**
 * Vani Technologies - Main JavaScript File
 * Integration of Interactive 3D Core, Smooth Navigation & UI Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize AOS (Animate On Scroll) Library
  initAOS();

  // 2. Initialize Sticky Navbar on Scroll
  initStickyNavbar();

  // 3. Initialize Mobile Hamburger Menu
  initMobileMenu();

  // 4. Initialize Animated Statistics Counter
  initStatsCounter();

  // 5. Smooth Anchor Link Navigation & 3D Core Button Burst
  initNavigationAndInteractions();

  // 6. Interactive 3D Tilt for Hero Cards & Logo
  initInteractiveTilt();

  // 7. Phase 3: Interactive Services Modal
  initServiceModal();

  // 8. Phase 4: Featured Products, Search, Filters & Product Modal
  initProductsAndFilters();

  // 8b. Cinematic Product Story Controller (Main Products)
  initCinematicProductStories();

  // 9. Update Navbar Auth Button if Logged In
  if (window.Auth) window.Auth.updateNavbarAuth();

  // 10. Backend Connectivity Health Check
  checkBackendHealth();

  // 11. Phase 7: Initialize Contact Form Handler
  initContactForm();
});

/**
 * Initialize AOS (Animate on Scroll)
 */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
  }
}

/**
 * Changes navbar styling on scroll (glass-like backdrop)
 */
function initStickyNavbar() {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('navbar-scrolled');
      navbar.classList.remove('navbar-initial');
    } else {
      navbar.classList.remove('navbar-scrolled');
      navbar.classList.add('navbar-initial');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Hamburger Menu Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');

  if (!toggleBtn || !mobileMenu || !menuIcon) return;

  let isOpen = false;

  const toggle = () => {
    isOpen = !isOpen;
    if (isOpen) {
      mobileMenu.classList.remove('menu-closed');
      mobileMenu.classList.add('menu-open');
      menuIcon.classList.remove('fa-bars');
      menuIcon.classList.add('fa-xmark');
      toggleBtn.setAttribute('aria-expanded', 'true');
    } else {
      mobileMenu.classList.remove('menu-open');
      mobileMenu.classList.add('menu-closed');
      menuIcon.classList.remove('fa-xmark');
      menuIcon.classList.add('fa-bars');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  };

  toggleBtn.addEventListener('click', toggle);

  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (isOpen) toggle();
    });
  });
}

/**
 * Smooth scrolling for anchors & "Explore Services" 3D Core Reaction
 */
function initNavigationAndInteractions() {
  // Handle "Explore Services" Button Click: Trigger 3D Core Particle Burst & Smooth Scroll
  const exploreServicesButtons = document.querySelectorAll('a[href="#services"]');
  exploreServicesButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      // 1. Trigger 3D core particle burst if Three.js engine is running
      if (typeof window.triggerHeroCoreBurst === 'function') {
        window.triggerHeroCoreBurst();
      }

      // 2. Smoothly scroll to services
      const targetEl = document.querySelector('#services');
      if (targetEl) {
        e.preventDefault();
        const navbarHeight = 72;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // Handle all other internal anchor links
  document.querySelectorAll('a[href^="#"]:not([href="#services"])').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navbarHeight = 72;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}

/**
 * Animated Numbers for Statistics Section
 */
function initStatsCounter() {
  const statElements = document.querySelectorAll('.stat-counter');
  if (!statElements.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          statElements.forEach((el) => {
            const target = parseFloat(el.getAttribute('data-target') || '0');
            const suffix = el.getAttribute('data-suffix') || '';
            const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
            animateValue(el, 0, target, 1600, decimals, suffix);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.getElementById('statistics-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

function animateValue(element, start, end, duration, decimals, suffix) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.textContent = end.toFixed(decimals) + suffix;
    return;
  }

  let startTime = null;

  function step(currentTime) {
    if (!startTime) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = start + (end - start) * easeProgress;

    element.textContent = currentValue.toFixed(decimals) + suffix;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = end.toFixed(decimals) + suffix;
    }
  }

  window.requestAnimationFrame(step);
}

/**
 * Interactive 3D Subtle Tilt for glass cards
 */
function initInteractiveTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  const tiltElements = document.querySelectorAll('.tilt-card');
  tiltElements.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/**
 * Backend Connectivity Checker
 */
function checkBackendHealth() {
  fetch('/api/health')
    .then((res) => res.json())
    .then((data) => {
      const statusBadge = document.getElementById('api-status-badge');
      if (statusBadge) {
        statusBadge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse"></span>API Active';
        statusBadge.className = 'px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center';
      }
    })
    .catch(() => {
      const statusBadge = document.getElementById('api-status-badge');
      if (statusBadge) {
        statusBadge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block mr-1.5"></span>Offline';
        statusBadge.className = 'px-2.5 py-0.5 text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center';
      }
    });
}

/**
 * Phase 3: Interactive Services Modal System
 */
const SERVICES_DATA = {
  'website-dev': {
    idNum: '01',
    title: 'Website Development',
    category: 'Web Engineering',
    icon: 'fa-solid fa-globe',
    desc: 'We engineer high-performance, responsive, and SEO-optimized corporate websites designed to build brand authority and convert visitors into clients. Built on modern web architecture with sub-second page loads, mobile responsiveness, and intuitive content management.',
    deliverables: [
      'Fully Responsive Mobile-First Design',
      'Advanced Technical SEO & Schema Markup',
      'High-Speed Performance (Sub-1.5s Load)',
      'Custom Headless or CMS Architecture',
      'Cross-Browser & Cross-Device Compatibility',
      'Lead Generation & Form Integrations'
    ],
    tech: ['HTML5', 'CSS3 / Tailwind', 'Modern JavaScript', 'Vite', 'WordPress', 'Cloudflare CDN'],
    impact: 'Boost organic search rankings, improve user retention, and turn website traffic into qualified business leads.'
  },
  'web-app-dev': {
    idNum: '02',
    title: 'Web Application Development',
    category: 'Cloud Applications',
    icon: 'fa-solid fa-laptop-code',
    desc: 'Custom, cloud-native web applications engineered for complex business logic, multi-user operations, and high concurrency. We design Single Page Applications (SPAs) and Progressive Web Apps (PWAs) that deliver desktop-class speed in the browser.',
    deliverables: [
      'Single Page Applications (SPA & PWA)',
      'Role-Based Access Control (RBAC)',
      'Real-Time WebSockets & Interactive Dashboards',
      'Scalable Cloud-Native Infrastructure',
      'Automated CI/CD Deployment Pipelines',
      'Data Encryption & Session Security'
    ],
    tech: ['React', 'Vue.js', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
    impact: 'Automate internal operations, reduce manual paperwork by 70%, and provide customers with seamless 24/7 web portals.'
  },
  'full-stack-dev': {
    idNum: '03',
    title: 'Full Stack Development',
    category: 'End-to-End Solutions',
    icon: 'fa-solid fa-layer-group',
    desc: 'Complete end-to-end technology solutions uniting intuitive frontend interfaces with robust, highly scalable backend architectures. We orchestrate databases, microservices, and client interfaces under unified, clean codebases.',
    deliverables: [
      'End-to-End System Architecture',
      'Relational & NoSQL Database Modeling',
      'Robust REST & GraphQL API Design',
      'Microservices & Serverless Functions',
      'Automated Unit & Integration Testing',
      'Cloud Infrastructure Setup (AWS / GCP)'
    ],
    tech: ['MERN Stack', 'TypeScript', 'Node.js', 'MongoDB', 'PostgreSQL', 'AWS / Docker'],
    impact: 'Eliminate vendor fragmentation, streamline engineering workflows, and accelerate software deployment cycles.'
  },
  'mobile-app-dev': {
    idNum: '04',
    title: 'Mobile Application Development',
    category: 'Mobile Engineering',
    icon: 'fa-solid fa-mobile-screen-button',
    desc: 'Native and cross-platform mobile applications for iOS and Android delivering silky-smooth 60fps animations, offline capabilities, and intuitive touch UX tailored for maximum user retention.',
    deliverables: [
      'Cross-Platform iOS & Android Apps',
      'Offline-First Architecture & Data Sync',
      'Push Notifications & In-App Purchases',
      'Hardware Camera, GPS & Biometric Integrations',
      'App Store & Google Play Publishing',
      'Analytics & Crash Reporting'
    ],
    tech: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'SQLite'],
    impact: 'Directly engage your mobile customers, increase brand loyalty, and open high-converting mobile commerce channels.'
  },
  'software-dev': {
    idNum: '05',
    title: 'Software Development',
    category: 'Enterprise Engineering',
    icon: 'fa-solid fa-code',
    desc: 'Bespoke enterprise software engineered from scratch to solve your organization unique operational bottlenecks. We replace antiquated legacy systems with high-concurrency, maintainable software architectures.',
    deliverables: [
      'Custom Enterprise Business Logic',
      'Legacy Software Modernization',
      'High-Concurrency Data Processing',
      'Enterprise-Grade Encryption & Audit Trails',
      'Comprehensive Technical Documentation',
      'Long-Term Code Maintainability'
    ],
    tech: ['Node.js', 'Python', 'Java', 'C# / .NET', 'PostgreSQL', 'Docker', 'Microservices'],
    impact: 'Modernize legacy systems, eliminate licensing overhead, and gain a proprietary technology advantage over competitors.'
  },
  'ui-ux-design': {
    idNum: '06',
    title: 'UI/UX Design',
    category: 'Product Design',
    icon: 'fa-solid fa-pen-ruler',
    desc: 'Data-driven UI/UX design that merges aesthetic elegance with psychological usability. We conduct user research, create interactive wireframes, and establish modular design systems that make complex apps feel intuitive.',
    deliverables: [
      'User Research & Journey Mapping',
      'Low-Fidelity & High-Fidelity Wireframes',
      'Clickable Interactive Figma Prototypes',
      'Comprehensive UI Design Systems & Tokens',
      'Accessibility Compliance (WCAG 2.1)',
      'Developer-Ready Asset Handover'
    ],
    tech: ['Figma', 'Adobe XD', 'Design Tokens', 'Tailwind CSS', 'Storybook', 'Whimsical'],
    impact: 'Increase conversion rates by up to 40%, lower user drop-off, and build an unforgettable brand aesthetic.'
  },
  'ecommerce-dev': {
    idNum: '07',
    title: 'E-commerce Development',
    category: 'Digital Commerce',
    icon: 'fa-solid fa-cart-shopping',
    desc: 'High-converting online storefronts and multi-vendor marketplaces engineered for seamless shopping experiences. We integrate secure multi-currency payment gateways, real-time inventory tracking, and abandoned cart recovery.',
    deliverables: [
      'Custom Storefronts & Multi-Vendor Portals',
      'Multi-Gateway Checkout (Stripe, Razorpay, PayPal)',
      'Real-Time Inventory & Order Management',
      'Abandoned Cart Email & SMS Recovery',
      'Product Filtering, Search & Recommendations',
      'Discounts, Coupons & Loyalty Program Engine'
    ],
    tech: ['Shopify Plus', 'WooCommerce', 'Next.js Commerce', 'Node.js', 'Stripe', 'Razorpay'],
    impact: 'Boost checkout conversions, reduce cart abandonment, and scale e-commerce revenue effortlessly.'
  },
  'api-dev': {
    idNum: '08',
    title: 'API Development',
    category: 'System Integration',
    icon: 'fa-solid fa-network-wired',
    desc: 'Secure, high-throughput REST and GraphQL APIs that serve as the backbone of modern digital ecosystems. We build scalable microservice gateways with strict token authentication, automated rate-limiting, and interactive OpenAPI documentation.',
    deliverables: [
      'RESTful & GraphQL Architecture',
      'OpenAPI / Swagger Interactive Docs',
      'OAuth 2.0, JWT & API Key Authentication',
      'In-Memory Caching with Redis',
      'Automated Rate Limiting & Throttling',
      'Third-Party Webhook Event Emitters'
    ],
    tech: ['Node.js', 'Express', 'FastAPI', 'GraphQL', 'Redis', 'Swagger / Postman', 'Kong'],
    impact: 'Enable frictionless cross-platform communication and create new revenue streams through open developer APIs.'
  },
  'software-testing': {
    idNum: '09',
    title: 'Software Testing & QA',
    category: 'Quality Assurance',
    icon: 'fa-solid fa-vial-circle-check',
    desc: 'Comprehensive manual and automated quality assurance designed to catch bugs before your users do. We conduct automated unit, integration, stress, and security vulnerability audits across all browsers and devices.',
    deliverables: [
      'Automated End-to-End (E2E) Test Suites',
      'API & Microservice Contract Testing',
      'Performance, Stress & Load Testing',
      'Cross-Browser & Multi-Device Testing',
      'Automated Regression & Smoke Test CI',
      'Detailed Vulnerability & Bug Reports'
    ],
    tech: ['Jest', 'Cypress', 'Playwright', 'Selenium', 'Postman', 'k6', 'SonarQube'],
    impact: 'Achieve 99.9% bug-free deployments, protect brand reputation, and drastically reduce emergency patch costs.'
  },
  'business-automation': {
    idNum: '10',
    title: 'Business Automation',
    category: 'Intelligent Operations',
    icon: 'fa-solid fa-robot',
    desc: 'Automate repetitive business workflows and back-office bottlenecks through intelligent automation pipelines. We connect disparate CRM, ERP, email, and finance systems into cohesive, self-executing processes.',
    deliverables: [
      'Robotic Process Automation (RPA)',
      'Automated Multi-System Data Synchronization',
      'Scheduled Batch Jobs & Report Generation',
      'Automated Email, SMS & WhatsApp Triggers',
      'Document OCR & Automatic Data Parsing',
      'Error Logging & Alerting Mechanisms'
    ],
    tech: ['Node.js Scripts', 'Python Automation', 'Zapier / Make', 'BullMQ / Redis', 'Webhooks', 'OCR APIs'],
    impact: 'Eliminate human data entry errors, save hundreds of labor hours per month, and speed up order processing.'
  },
  'crm-integration': {
    idNum: '11',
    title: 'CRM Integration',
    category: 'Sales & Client Operations',
    icon: 'fa-solid fa-chart-pie',
    desc: 'Custom CRM deployments and deep integrations connecting your marketing funnels, customer portals, and sales pipelines. We synchronize leads in real time, track conversions, and build actionable executive dashboards.',
    deliverables: [
      'Real-Time Web-to-CRM Lead Capture',
      'Salesforce, HubSpot & Zoho Deep Sync',
      'Automated Lead Scoring & Pipeline Routing',
      'Multi-Channel Communication History',
      'Customer Lifetime Value (LTV) Dashboards',
      'Legacy CRM Data Cleanse & Migration'
    ],
    tech: ['Salesforce API', 'HubSpot API', 'Zoho CRM', 'Node.js Sync Microservices', 'Webhooks'],
    impact: 'Prevent lead leakage, accelerate deal closure rates, and equip your sales team with 360-degree customer insights.'
  },
  'maintenance-support': {
    idNum: '12',
    title: 'Maintenance & Support',
    category: '24/7 Managed Services',
    icon: 'fa-solid fa-headset',
    desc: 'Proactive infrastructure management, continuous uptime monitoring, routine security patches, and SLA-backed emergency support. We keep your systems operating at peak performance so you can focus on core business growth.',
    deliverables: [
      '24/7 Proactive Server & Cloud Monitoring',
      'Security Vulnerability Patching & OS Updates',
      'Automated Daily & Hourly Backups with Recovery Drills',
      'Continuous Performance & Database Indexing',
      'Guaranteed SLA Response & Resolution Times',
      'Dedicated Engineering Support Channel'
    ],
    tech: ['AWS CloudWatch', 'Datadog', 'Prometheus', 'Docker', 'Git', 'Linux SysAdmin', 'PagerDuty'],
    impact: 'Guaranteed 99.9% uptime, zero unplanned downtime losses, and peace of mind knowing senior engineers are on call.'
  }
};

function initServiceModal() {
  const modal = document.getElementById('service-modal');
  if (!modal) return;

  const modalIconBox = document.getElementById('modal-icon-box');
  const modalCategory = document.getElementById('modal-service-category');
  const modalIdNum = document.getElementById('modal-service-id');
  const modalTitle = document.getElementById('modal-service-title');
  const modalDesc = document.getElementById('modal-service-desc');
  const modalDeliverables = document.getElementById('modal-service-deliverables');
  const modalTech = document.getElementById('modal-service-tech');
  const modalImpact = document.getElementById('modal-service-impact');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCloseFooter = document.getElementById('modal-close-footer');
  const modalConsultBtn = document.getElementById('modal-consult-btn');

  const openModal = (serviceKey) => {
    const service = SERVICES_DATA[serviceKey];
    if (!service) return;

    if (modalIconBox) modalIconBox.innerHTML = `<i class="${service.icon}"></i>`;
    if (modalCategory) modalCategory.textContent = service.category;
    if (modalIdNum) modalIdNum.textContent = `#${service.idNum}`;
    if (modalTitle) modalTitle.textContent = service.title;
    if (modalDesc) modalDesc.textContent = service.desc;
    if (modalImpact) modalImpact.textContent = service.impact;

    // Populate Deliverables
    if (modalDeliverables) {
      modalDeliverables.innerHTML = service.deliverables
        .map(
          (item) => `
            <li class="flex items-start gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/5">
              <i class="fa-solid fa-circle-check text-[#e85827] text-xs mt-1 shrink-0"></i>
              <span class="text-xs text-slate-300 font-medium leading-relaxed">${item}</span>
            </li>
          `
        )
        .join('');
    }

    // Populate Tech Stacks
    if (modalTech) {
      modalTech.innerHTML = service.tech
        .map(
          (t) => `
            <span class="px-2.5 py-1 text-xs rounded-md bg-[#252e40] text-slate-200 border border-[#60697d]/35 font-mono shadow-sm">
              ${t}
            </span>
          `
        )
        .join('');
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Attach click listener to all "Learn More" buttons
  const learnMoreBtns = document.querySelectorAll('.service-learn-more-btn');
  learnMoreBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceId = btn.getAttribute('data-service-id');
      if (serviceId) {
        openModal(serviceId);
      }
    });
  });

  // Close handlers
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalCloseFooter) modalCloseFooter.addEventListener('click', closeModal);

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Consult button smooth scroll to contact & close modal
  if (modalConsultBtn) {
    modalConsultBtn.addEventListener('click', (e) => {
      closeModal();
      const contactSection = document.querySelector('#contact');
      if (contactSection) {
        e.preventDefault();
        const navbarHeight = 72;
        const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  }
}

/**
 * Phase 4: Product Image Fallback Handler
 * Displays an elegant branded fallback if an image network fails.
 */
window.showProductImageFallback = function(imgEl, title, iconClass) {
  if (!imgEl || !imgEl.parentElement) return;
  const wrapper = imgEl.parentElement;
  
  wrapper.innerHTML = `
    <div class="product-image-fallback">
      <div class="w-12 h-12 rounded-xl bg-[#e85827]/15 border border-[#e85827]/30 flex items-center justify-center text-[#e85827] text-xl mb-2">
        <i class="${iconClass || 'fa-solid fa-shapes'}"></i>
      </div>
      <span class="text-xs font-semibold text-white tracking-wide">${title || 'Vani Product'}</span>
      <span class="text-[10px] text-slate-400 mt-0.5">Vani Technologies Portfolio</span>
    </div>
  `;
};

/**
 * Phase 4: Featured Products Dataset
 * Every product is equipped with complete, unique metadata, specifications, and availability.
 */
const PRODUCTS_DATA = {
  'ai-talksy': {
    id: 'ai-talksy',
    title: 'AI Talksy',
    name: 'AI Talksy',
    category: 'AI',
    categorySlug: 'ai',
    pricing: 'From $29/mo (Free Trial)',
    price: '$29 / Month',
    stock: 'In Stock / Instant Cloud Access',
    availability: 'Available Now',
    icon: 'fa-solid fa-robot',
    image: 'assets/images/portfolio/aitalksy-logo.png',
    fallbackImage: 'assets/images/portfolio/Tablet-Screens-presentation-Mock-up.png',
    link: 'https://aitalksy.com/',
    isExternal: true,
    desc: 'Intelligent conversational AI & customer automation platform enabling enterprises to deploy 24/7 AI chat agents, lead qualification assistants, and voice agents with zero code.',
    description: 'Intelligent conversational AI & customer automation platform enabling enterprises to deploy 24/7 AI chat agents, lead qualification assistants, and voice agents with zero code.',
    features: [
      '24/7 Multi-Language Conversational AI Chatbot',
      'Custom Knowledge Base Training (PDF, URLs, Docs)',
      'Automated CRM Lead Capture & Qualification',
      'Multi-Channel Deployment (Web, WhatsApp, Slack)',
      'Sentiment Analysis & Live Agent Handoff',
      'Real-Time Analytics & Conversation Insights'
    ],
    specifications: [
      { label: 'Platform Type', value: 'Conversational AI / SaaS' },
      { label: 'Integration', value: 'REST API, Webhooks, WhatsApp, Slack' },
      { label: 'Supported Models', value: 'GPT-4o, Claude 3.5, Gemini 1.5' },
      { label: 'SLA Guarantee', value: '99.9% High Availability Uptime' }
    ],
    tech: ['OpenAI / LLMs', 'Python / FastAPI', 'Vector DB / Pinecone', 'React', 'Node.js', 'WebSockets']
  },
  'community-forum': {
    id: 'community-forum',
    title: 'Community Forum',
    name: 'Community Forum',
    category: 'Community',
    categorySlug: 'community',
    pricing: 'Free / Open Platform',
    price: 'Free / Open Source',
    stock: 'In Stock / Instant Deployment',
    availability: 'Available Now',
    icon: 'fa-solid fa-comments',
    image: 'assets/images/portfolio/community-forum-logo.png',
    fallbackImage: 'assets/images/portfolio/Mockup_11.png',
    link: 'https://communityforum.tech/',
    isExternal: true,
    desc: 'Scalable, modern discussion platform engineered for high-engagement developer communities, tech enthusiasts, knowledge bases, and peer-to-peer technical support.',
    description: 'Scalable, modern discussion platform engineered for high-engagement developer communities, tech enthusiasts, knowledge bases, and peer-to-peer technical support.',
    features: [
      'Real-Time Threaded Discussions & Polls',
      'Reputation Badges & Member Gamification',
      'Rich Markdown & Code Syntax Highlighting',
      'Advanced Moderation Tools & Spam Shields',
      'Instant Push & Email Notification Engine',
      'SEO-Optimized Forum Threads & Indexing'
    ],
    specifications: [
      { label: 'Platform Type', value: 'Developer Community Platform' },
      { label: 'Database', value: 'MongoDB / Redis Cache' },
      { label: 'Real-time Protocol', value: 'WebSockets & Push API' },
      { label: 'SEO Optimization', value: 'Full Server-Side Indexing' }
    ],
    tech: ['Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Redis', 'Elasticsearch']
  },
  'ratehonk-travel-crm': {
    id: 'ratehonk-travel-crm',
    title: 'RateHonk Travel CRM',
    name: 'RateHonk Travel CRM',
    category: 'CRM',
    categorySlug: 'crm',
    pricing: 'Enterprise SaaS',
    price: 'Custom Enterprise / $99/mo',
    stock: 'In Stock / Ready for Onboarding',
    availability: 'Available Now',
    icon: 'fa-solid fa-plane-departure',
    image: 'assets/images/portfolio/ratehonk-logo.png',
    fallbackImage: 'assets/images/portfolio/responsive_web.png',
    link: 'https://crm.ratehonk.com/portfolio',
    isExternal: true,
    desc: 'Enterprise travel management and B2B CRM solution designed for travel agencies and tour operators to manage leads, generate customized flight/hotel itineraries, and automate customer billing.',
    description: 'Enterprise travel management and B2B CRM solution designed for travel agencies and tour operators to manage leads, generate customized flight/hotel itineraries, and automate customer billing.',
    features: [
      'Dynamic Multi-City Flight & Hotel Itinerary Builder',
      'Automated Supplier Invoicing & Receipt Generator',
      'Real-Time Lead Tracking & Deal Pipelines',
      'Travel Agent Commission & Revenue Analytics',
      'Multi-Currency Payment Processing',
      'Customer Travel Voucher & PDF Exports'
    ],
    specifications: [
      { label: 'Platform Type', value: 'B2B Travel Operations CRM' },
      { label: 'Accounting', value: 'Multi-Currency & Supplier Ledger' },
      { label: 'Export Formats', value: 'PDF Itineraries, CSV & Invoices' },
      { label: 'Security', value: 'Role-Based Access Control (RBAC)' }
    ],
    tech: ['PHP / Laravel', 'MySQL', 'Vue.js', 'Bootstrap', 'REST APIs', 'PDFKit']
  },
  'telemedicine': {
    id: 'telemedicine',
    title: 'TeleMedicine',
    name: 'TeleMedicine Platform',
    category: 'Healthcare',
    categorySlug: 'healthcare',
    pricing: 'Hospital License',
    price: 'Enterprise License / $199/mo',
    stock: 'In Stock / Licensed Deployment',
    availability: 'Available for Onboarding',
    icon: 'fa-solid fa-heart-pulse',
    image: 'assets/images/portfolio/3.png',
    fallbackImage: 'https://www.vanitechnologies.in/assets/dist/portfolio/3.png',
    link: '#contact',
    isExternal: false,
    desc: 'Secure, HIPAA-compliant digital healthcare and virtual consultation platform connecting patients with certified medical practitioners via encrypted HD video calls, digital prescriptions, and EHR sync.',
    description: 'Secure, HIPAA-compliant digital healthcare and virtual consultation platform connecting patients with certified medical practitioners via encrypted HD video calls, digital prescriptions, and EHR sync.',
    features: [
      'End-to-End Encrypted HD Video Consultations',
      'Digital E-Prescription & Lab Report Management',
      'Integrated Patient EHR / Health History',
      'Automated Appointment Scheduling & SMS Reminders',
      'Doctor Availability & Calendar Management',
      'Secure HIPAA-Compliant Data Storage'
    ],
    specifications: [
      { label: 'Compliance', value: 'HIPAA & GDPR Compliant' },
      { label: 'Video Protocol', value: 'WebRTC End-to-End Encrypted' },
      { label: 'EHR Standard', value: 'FHIR / HL7 Compatible' },
      { label: 'Device Support', value: 'Web, iOS, Android' }
    ],
    tech: ['WebRTC', 'React', 'Node.js', 'PostgreSQL', 'HIPAA Cloud', 'Socket.io']
  },
  'homem-do-pao': {
    id: 'homem-do-pao',
    title: 'Homem Do Pao',
    name: 'Homem Do Pao Bakery Store',
    category: 'E-commerce',
    categorySlug: 'ecommerce',
    pricing: 'Custom Storefront',
    price: 'Commercial Storefront',
    stock: 'In Stock / Turnkey Storefront',
    availability: 'Available Now',
    icon: 'fa-solid fa-bread-slice',
    image: 'assets/images/portfolio/Tablet-Screens-presentation-Mock-up.png',
    fallbackImage: 'https://www.vanitechnologies.in/assets/dist/portfolio/Tablet-Screens-presentation-Mock-up.png',
    link: '#contact',
    isExternal: false,
    desc: 'Digital e-commerce and artisan bakery ordering ecosystem featuring recurring fresh bread subscriptions, live order status tracking, and seamless contactless local deliveries.',
    description: 'Digital e-commerce and artisan bakery ordering ecosystem featuring recurring fresh bread subscriptions, live order status tracking, and seamless contactless local deliveries.',
    features: [
      'Artisan Food Catalog & Custom Bundles',
      'Weekly / Monthly Bread Subscription Engine',
      'Seamless Online Card & Mobile Payments',
      'Real-Time Delivery Dispatch & GPS Tracking',
      'Automated Customer WhatsApp Order Alerts',
      'Bakery Kitchen Inventory Synchronization'
    ],
    specifications: [
      { label: 'Platform Type', value: 'Headless Digital Commerce' },
      { label: 'Payment Gateways', value: 'Stripe, PayPal, Apple Pay' },
      { label: 'Subscription Mode', value: 'Weekly & Monthly Re-Orders' },
      { label: 'Order Dispatch', value: 'Live Driver GPS Tracking' }
    ],
    tech: ['Shopify Plus / Headless', 'Next.js', 'Stripe', 'Node.js', 'Webhooks']
  },
  'meditation-willy-cherish': {
    id: 'meditation-willy-cherish',
    title: 'Meditation with Willy Cherish',
    name: 'Meditation with Willy Cherish',
    category: 'Meditation',
    categorySlug: 'meditation',
    pricing: 'Freemium ($9.99/mo Premium)',
    price: 'Freemium / $9.99/mo',
    stock: 'In Stock / Instant Access',
    availability: 'Available Now',
    icon: 'fa-solid fa-spa',
    image: 'assets/images/portfolio/Mockup_11.png',
    fallbackImage: 'https://www.vanitechnologies.in/assets/dist/portfolio/Mockup_11.png',
    link: '#contact',
    isExternal: false,
    desc: 'Mindful wellness and guided meditation audio portal offering stress-relief soundscapes, breathwork exercises, guided sleep journeys, and ambient mindfulness sessions.',
    description: 'Mindful wellness and guided meditation audio portal offering stress-relief soundscapes, breathwork exercises, guided sleep journeys, and ambient mindfulness sessions.',
    features: [
      'Curated HD Guided Audio & Soundscapes',
      'Binaural Beats & Ambient Relaxing Loops',
      'Personalized Daily Streak & Habit Tracker',
      'Offline Audio Playback for Travel',
      'Timer-Based Breathing Exercises',
      'Sleep Meditation Journeys & White Noise'
    ],
    specifications: [
      { label: 'Audio Engine', value: 'Spatial Audio & Binaural Beats' },
      { label: 'Offline Support', value: 'Local Cache Audio Storage' },
      { label: 'Platforms', value: 'PWA, iOS & Android' },
      { label: 'Habit Analytics', value: 'Daily Streaks & Milestones' }
    ],
    tech: ['React Native', 'Web Audio API', 'Node.js', 'AWS CloudFront', 'Firebase']
  },
  'msb-school': {
    id: 'msb-school',
    title: 'MSB School',
    name: 'MSB School Management System',
    category: 'Education',
    categorySlug: 'education',
    pricing: 'Institutional SaaS',
    price: 'Annual Institutional SaaS',
    stock: 'In Stock / Institution Ready',
    availability: 'Available for Deployment',
    icon: 'fa-solid fa-graduation-cap',
    image: 'assets/images/portfolio/responsive_web.png',
    fallbackImage: 'https://www.vanitechnologies.in/assets/dist/portfolio/responsive_web.png',
    link: '#contact',
    isExternal: false,
    desc: 'Comprehensive educational institution management system and virtual learning portal for students, teachers, and parents, covering attendance, report cards, fees, and virtual classrooms.',
    description: 'Comprehensive educational institution management system and virtual learning portal for students, teachers, and parents, covering attendance, report cards, fees, and virtual classrooms.',
    features: [
      'Student Information System (SIS) & Grades',
      'Online Fee Collection & Receipt Generator',
      'Interactive Virtual Classrooms & Assignments',
      'Parent Mobile App for Real-Time Notices',
      'Teacher Lesson Planning & Attendance Tracker',
      'Automated Report Card & Certificate Generator'
    ],
    specifications: [
      { label: 'User Roles', value: 'Admins, Teachers, Parents, Students' },
      { label: 'Billing Engine', value: 'Automated Fee Invoicing & Receipts' },
      { label: 'Classroom', value: 'Assignments & Gradebooks' },
      { label: 'Notification', value: 'SMS, WhatsApp & Push Alerts' }
    ],
    tech: ['Angular', 'Node.js', 'PostgreSQL', 'AWS S3', 'Razorpay / Stripe']
  },
  'software-testing-suite': {
    id: 'software-testing-suite',
    title: 'Software Testing',
    name: 'Software Testing & QA Suite',
    category: 'Services',
    categorySlug: 'services',
    pricing: 'On-Demand QA / Retainer',
    price: 'On-Demand QA / Retainer',
    stock: 'In Stock / Dedicated Engineers',
    availability: 'Available for Engagement',
    icon: 'fa-solid fa-vial-circle-check',
    image: 'assets/images/portfolio/3.png',
    fallbackImage: 'https://www.vanitechnologies.in/assets/dist/portfolio/3.png',
    link: '#services',
    isExternal: false,
    desc: 'Enterprise QA & Automated Testing Suite engineered by Vani Technologies for continuous integration, load simulation, cross-browser regression, and vulnerability detection.',
    description: 'Enterprise QA & Automated Testing Suite engineered by Vani Technologies for continuous integration, load simulation, cross-browser regression, and vulnerability detection.',
    features: [
      'Automated Continuous Testing & CI Pipelines',
      'High-Concurrency Load & Stress Simulation',
      'Vulnerability Scanning & Code Compliance',
      'Cross-Device & Browser Matrix Verification',
      'Automated Smoke & Regression Test Suites',
      'Detailed Bug & Performance Auditing Reports'
    ],
    specifications: [
      { label: 'Testing Types', value: 'E2E, Unit, Load, Stress, Penetration' },
      { label: 'CI/CD Support', value: 'GitHub Actions, Jenkins, GitLab' },
      { label: 'Browser Matrix', value: 'Chrome, Safari, Firefox, Edge' },
      { label: 'Reporting', value: 'Automated Slack/Email Telemetry' }
    ],
    tech: ['Jest', 'Cypress', 'Playwright', 'Selenium', 'Postman', 'k6', 'SonarQube']
  }
};

/**
 * Reorganized Product Data Structure (Main Products vs Delivery Projects)
 */
const MAIN_PRODUCTS_KEYS = [
  'ai-talksy',
  'community-forum',
  'ratehonk-travel-crm'
];

const DELIVERY_PROJECTS_KEYS = [
  'homem-do-pao',
  'meditation-willy-cherish',
  'msb-school',
  'software-testing-suite',
  'telemedicine'
];

const mainProducts = MAIN_PRODUCTS_KEYS.map((k) => PRODUCTS_DATA[k]).filter(Boolean);
const deliveryProjects = DELIVERY_PROJECTS_KEYS.map((k) => PRODUCTS_DATA[k]).filter(Boolean);
const deliveredProjects = deliveryProjects;

// Expose arrays globally for external consumption
window.mainProducts = mainProducts;
window.deliveryProjects = deliveryProjects;
window.deliveredProjects = deliveredProjects;

/**
 * Phase 4 & Phase 10: Products Filters, Search & Modal Controller
 * Specifically drives the 5 Delivery Projects grid and search experience without requiring login.
 */
function initProductsAndFilters() {
  const searchInput = document.getElementById('delivery-search-input') || document.getElementById('product-search-input');
  const clearSearchBtn = document.getElementById('clear-delivery-search-btn') || document.getElementById('clear-search-btn');
  const filterBtns = document.querySelectorAll('#delivery-projects .filter-btn, .filter-btn');
  const productCards = document.querySelectorAll('#delivery-grid .product-card');
  const countDisplay = document.getElementById('delivery-count-display') || document.getElementById('product-count-display');
  const emptyState = document.getElementById('no-delivery-found') || document.getElementById('no-products-found');
  const resetFiltersBtn = document.getElementById('reset-delivery-filters-btn') || document.getElementById('reset-search-filters-btn');

  let currentCategory = 'all';
  let currentSearchQuery = '';

  const applyFilters = () => {
    let visibleCount = 0;
    const cards = productCards.length ? productCards : document.querySelectorAll('.product-card');
    const totalCount = cards.length;

    cards.forEach((card) => {
      const category = (card.getAttribute('data-category') || '').toLowerCase();
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const content = card.textContent.toLowerCase();

      // Check category match
      const categoryMatches = currentCategory === 'all' || category === currentCategory;

      // Check search match
      const searchMatches =
        !currentSearchQuery ||
        name.includes(currentSearchQuery) ||
        category.includes(currentSearchQuery) ||
        content.includes(currentSearchQuery);

      if (categoryMatches && searchMatches) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update count display
    if (countDisplay) {
      countDisplay.textContent = `Showing ${visibleCount} of ${totalCount} delivered projects`;
    }

    // Toggle empty state
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.remove('hidden');
      } else {
        emptyState.classList.add('hidden');
      }
    }
  };

  // Category filter button listeners
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = (btn.getAttribute('data-filter') || 'all').toLowerCase();
      applyFilters();
    });
  });

  // Search input listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      if (clearSearchBtn) {
        if (currentSearchQuery.length > 0) {
          clearSearchBtn.classList.remove('hidden');
        } else {
          clearSearchBtn.classList.add('hidden');
        }
      }
      applyFilters();
    });
  }

  // Clear search button
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearchQuery = '';
      clearSearchBtn.classList.add('hidden');
      applyFilters();
      if (searchInput) searchInput.focus();
    });
  }

  // Reset filters button
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearchQuery = '';
      if (clearSearchBtn) clearSearchBtn.classList.add('hidden');

      filterBtns.forEach((b) => b.classList.remove('active'));
      const allBtn = document.querySelector('#delivery-projects .filter-btn[data-filter="all"], .filter-btn[data-filter="all"]');
      if (allBtn) allBtn.classList.add('active');
      currentCategory = 'all';

      applyFilters();
    });
  }

  // Initial count display
  applyFilters();

  // Product Details Modal setup
  initProductDetailModal();
}

/**
 * Cinematic Product Story Controller for MAIN PRODUCTS
 * Phase 6: AI Talksy 7-Scene Product Story
 * USER → MESSAGE → AI → PROCESSING → RESPONSE → BUSINESS CONNECTION → RESULT
 * Powered by GPU-friendly GSAP transitions, Canvas Neural Background, and Viewport Detection.
 */
function initCinematicProductStories() {
  const MOVIE_SCENES_AITALKSY = ['user', 'message', 'ai', 'processing', 'response', 'business', 'result'];
  const MOVIE_SCENES_STANDARD = ['intro', 'problem', 'process', 'result', 'cta'];

  const stories = {
    aitalksy: {
      id: 'aitalksy',
      name: 'AI Talksy',
      container: document.getElementById('story-aitalksy'),
      totalSteps: 7,
      scenes: MOVIE_SCENES_AITALKSY,
      currentStep: 1,
      timer: null,
      intervalMs: 3600,
      isInView: false,
      captions: [
        'SCENE 1 — USER: "Hello, I need help." (User typing request)',
        'SCENE 2 — MESSAGE: Streaming message payload toward AI Core',
        'SCENE 3 — AI: AI Talksy neural network processing user request',
        'SCENE 4 — PROCESSING: Processing... Understanding... Generating response...',
        'SCENE 5 — RESPONSE: "Sure! I can help you with that." — Instant resolution',
        'SCENE 6 — BUSINESS CONNECTION: User • Website • Chat • Support • Business • AI',
        'SCENE 7 — RESULT: Messages: 24 • Responses: 21 • Resolved: 18 • Automation: 87%'
      ]
    },
    community: {
      id: 'community',
      name: 'Community Forum',
      container: document.getElementById('story-communityforum'),
      totalSteps: 5,
      scenes: MOVIE_SCENES_STANDARD,
      currentStep: 1,
      timer: null,
      intervalMs: 3400,
      isInView: false,
      captions: [
        'SCENE 1 - PEOPLE: Diverse members seeking meaningful connection',
        'SCENE 2 - COMMUNITY: Connected lines uniting members into a trusted community',
        'SCENE 3 - VERIFICATION: Professional identity verification with zero fake accounts',
        'SCENE 4 - DIGITAL PLATFORM: Smartphone hub powering 7 unified community services',
        'SCENE 5 - CONNECTED ECOSYSTEM: Many community services unified in one digital platform'
      ]
    },
    ratehonk: {
      id: 'ratehonk',
      name: 'RateHonk Travel CRM',
      container: document.getElementById('story-ratehonk'),
      totalSteps: 7,
      scenes: MOVIE_SCENES_STANDARD,
      currentStep: 1,
      timer: null,
      intervalMs: 3400,
      isInView: false,
      captions: [
        'SCENE 1 - LEAD: Inbound inquiry received for John Smith (₹85,000)',
        'SCENE 2 - CRM: Lead ingested into the 5-stage sales pipeline',
        'SCENE 3 - PIPELINE FLOW: Lead card progressing from Lead to Customer',
        'SCENE 4 - FOLLOW-UP: Automated task alert transitioning from Due to Completed',
        'SCENE 5 - CUSTOMER INFO: Comprehensive traveler profile and itinerary specs',
        'SCENE 6 - BOOKING: Booking Confirmed with payment received of ₹85,000',
        'SCENE 7 - DASHBOARD: Executive CRM growth metrics and live pipeline revenue'
      ]
    }
  };

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Pipeline motion animation for RateHonk Scene 3
  const runRateHonkPipelineFlow = () => {
    const cols = document.querySelectorAll('.pipeline-step-col');
    if (!cols || cols.length === 0) return;

    cols.forEach(c => c.classList.remove('active-col'));
    cols.forEach((col, idx) => {
      setTimeout(() => {
        cols.forEach(c => c.classList.remove('active-col'));
        col.classList.add('active-col');
      }, 280 * (idx + 1));
    });
  };

  // Follow-up dynamic transition for RateHonk Scene 4 (Follow-up due -> ✓ Completed)
  const runRateHonkFollowUp = () => {
    const container = document.getElementById('ratehonk-followup-badge-container');
    const text = document.getElementById('ratehonk-followup-text');
    const icon = document.getElementById('ratehonk-followup-status-icon');
    if (!container || !text || !icon) return;

    container.className = 'p-3 rounded-xl border border-amber-500/50 bg-amber-950/40 text-amber-300 flex items-center justify-between transition-all duration-500';
    text.textContent = 'Follow-up due';
    icon.innerHTML = '<i class="fa-solid fa-clock animate-pulse"></i>';

    setTimeout(() => {
      container.className = 'p-3 rounded-xl border border-emerald-500/60 bg-emerald-950/60 text-emerald-300 flex items-center justify-between transition-all duration-500 shadow-lg';
      text.textContent = '✓ Completed';
      icon.innerHTML = '<i class="fa-solid fa-circle-check text-emerald-400"></i>';
    }, 750);
  };

  // Smooth animated counters for RateHonk Scene 7 (Dashboard)
  const runRateHonkCounters = () => {
    const counters = document.querySelectorAll('.ratehonk-counter');
    counters.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-target') || '0');
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      animateValue(el, 0, target, 1100, decimals, suffix);
    });
  };

  // Typing animation for AI Talksy Scene 1
  const runAITalksyTyping = () => {
    const textEl = document.getElementById('aitalksy-typing-text');
    if (!textEl) return;
    const fullText = "Hello, I need help.";
    textEl.textContent = '';
    let idx = 0;
    if (textEl._typeTimer) clearInterval(textEl._typeTimer);
    textEl._typeTimer = setInterval(() => {
      idx++;
      textEl.textContent = fullText.slice(0, idx);
      if (idx >= fullText.length) {
        clearInterval(textEl._typeTimer);
      }
    }, 45);
  };

  // Processing step progression for AI Talksy Scene 4
  const runAITalksyProcessing = () => {
    const p1 = document.getElementById('aitalksy-proc-1');
    const p2 = document.getElementById('aitalksy-proc-2');
    const p3 = document.getElementById('aitalksy-proc-3');
    if (!p1 || !p2 || !p3) return;

    p1.className = 'processing-step-badge active-proc p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/50 text-left flex items-center justify-between text-xs text-cyan-300 shadow-md';
    p2.className = 'processing-step-badge p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-left flex items-center justify-between text-xs text-slate-400 shadow-md';
    p3.className = 'processing-step-badge p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-left flex items-center justify-between text-xs text-slate-400 shadow-md';

    setTimeout(() => {
      p2.className = 'processing-step-badge active-proc p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/50 text-left flex items-center justify-between text-xs text-purple-300 shadow-md';
    }, 650);

    setTimeout(() => {
      p3.className = 'processing-step-badge active-proc p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-left flex items-center justify-between text-xs text-emerald-300 shadow-md';
    }, 1300);
  };

  // Animated counters for AI Talksy Scene 7
  const runAITalksyCounters = () => {
    const counters = document.querySelectorAll('.aitalksy-counter');
    counters.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-target') || '0');
      const suffix = el.getAttribute('data-suffix') || '';
      animateValue(el, 0, target, 1100, 0, suffix);
    });
  };

  // Slowly connects the member avatars in Community Forum Scene 1
  const runCommunityPeopleConnect = () => {
    const path = document.getElementById('comm-connecting-path');
    if (path) {
      path.style.transition = 'none';
      path.style.strokeDashoffset = '240';
      setTimeout(() => {
        path.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
        path.style.strokeDashoffset = '0';
      }, 50);
    }
  };

  // Triggers the verified stamp in Community Forum Scene 3
  const runCommunityVerification = () => {
    const stamp = document.querySelector('.animate-verification-stamp');
    if (stamp) {
      stamp.style.animation = 'none';
      void stamp.offsetHeight;
      stamp.style.animation = 'verificationStamp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    }
  };

  // Sequentially reveals the 7 community services inside the smartphone in Community Forum Scene 4
  const runCommunityPhoneServices = () => {
    const services = document.querySelectorAll('.comm-phone-service');
    if (!services || services.length === 0) return;

    services.forEach((s) => {
      s.classList.remove('is-visible');
      s.style.opacity = '0';
      s.style.transform = 'translate3d(0, 10px, 0)';
    });

    services.forEach((s, idx) => {
      setTimeout(() => {
        s.classList.add('is-visible');
        s.style.opacity = '1';
        s.style.transform = 'translate3d(0, 0, 0)';
      }, 170 * (idx + 1));
    });
  };

  // Render a specific step for a given story
  const showStep = (storyKey, stepNum) => {
    const story = stories[storyKey];
    if (!story || !story.container) return;
    story.currentStep = stepNum;

    // 1. Update pills
    const pills = story.container.querySelectorAll('.story-step-pill');
    pills.forEach((p) => {
      const pStep = parseInt(p.getAttribute('data-step'), 10);
      if (pStep === stepNum) {
        p.classList.add('active');
        p.setAttribute('aria-selected', 'true');
      } else {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      }
    });

    // 2. Update scenes (panes) with GPU-accelerated GSAP transforms
    for (let s = 1; s <= story.totalSteps; s++) {
      const pane = document.getElementById(`${storyKey}-stage-step${s}`);
      if (pane) {
        if (s === stepNum) {
          pane.classList.remove('hidden');
          if (typeof gsap !== 'undefined' && !isReducedMotion) {
            gsap.killTweensOf(pane);
            gsap.fromTo(
              pane,
              { opacity: 0, y: 12, scale: 0.97, force3D: true },
              { opacity: 1, y: 0, scale: 1, duration: 0.42, ease: 'power2.out', force3D: true }
            );
          } else {
            pane.style.opacity = '1';
            pane.style.transform = 'translate3d(0, 0, 0)';
          }
        } else {
          pane.classList.add('hidden');
          pane.style.opacity = '0';
          pane.style.transform = 'translate3d(0, 10px, 0)';
        }
      }
    }

    // 3. Dynamic scene actions for AI Talksy & Community Forum
    if (storyKey === 'aitalksy') {
      if (stepNum === 1) runAITalksyTyping();
      if (stepNum === 4) runAITalksyProcessing();
      if (stepNum === 7) runAITalksyCounters();
    } else if (storyKey === 'community') {
      if (stepNum === 1) runCommunityPeopleConnect();
      if (stepNum === 3) runCommunityVerification();
      if (stepNum === 4) runCommunityPhoneServices();
    } else if (storyKey === 'ratehonk') {
      if (stepNum === 3) runRateHonkPipelineFlow();
      if (stepNum === 4) runRateHonkFollowUp();
      if (stepNum === 7) runRateHonkCounters();
    }

    // 4. Update caption with subtle directional GSAP nudge
    const captionEl = document.getElementById(`${storyKey}-step-caption`);
    if (captionEl && story.captions[stepNum - 1]) {
      captionEl.textContent = story.captions[stepNum - 1];
      if (typeof gsap !== 'undefined' && !isReducedMotion) {
        gsap.killTweensOf(captionEl);
        gsap.fromTo(captionEl, { opacity: 0.4, x: -6, force3D: true }, { opacity: 1, x: 0, duration: 0.3, ease: 'power1.out', force3D: true });
      }
    }
  };

  // Start automatic sequencer for a single story
  const startStory = (storyKey) => {
    if (isReducedMotion) return;
    const story = stories[storyKey];
    if (!story) return;

    // Resume canvas animation loop when story starts/enters view
    if (story.startCanvas) story.startCanvas();

    if (story.timer) return;

    story.timer = setInterval(() => {
      let nextStep = story.currentStep + 1;
      if (nextStep > story.totalSteps) nextStep = 1;
      showStep(storyKey, nextStep);
    }, story.intervalMs);
  };

  // Pause automatic sequencer for a single story
  const stopStory = (storyKey) => {
    const story = stories[storyKey];
    if (!story) return;

    if (story.timer) {
      clearInterval(story.timer);
      story.timer = null;
    }

    // Halt canvas animation loop completely when story pauses/leaves view
    if (story.stopCanvas) story.stopCanvas();
  };

  // Attach controls: pill click, replay, and hover pause
  Object.keys(stories).forEach((key) => {
    const story = stories[key];
    if (!story.container) return;

    // Step Pills click
    const pills = story.container.querySelectorAll('.story-step-pill');
    pills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const step = parseInt(pill.getAttribute('data-step'), 10);
        stopStory(key);
        showStep(key, step);
      });
    });

    // Replay button click
    const replayBtn = story.container.querySelector(`.story-replay-btn[data-story="${key}"]`);
    if (replayBtn) {
      replayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        stopStory(key);
        showStep(key, 1);
        if (story.isInView) {
          startStory(key);
        }
      });
    }

    // Hover pause & subtle reaction (do not interrupt user while reading/interacting)
    story.container.addEventListener('mouseenter', () => {
      stopStory(key);
    });

    story.container.addEventListener('mouseleave', () => {
      if (story.isInView) {
        startStory(key);
      }
    });

    // Initial render of first scene
    showStep(key, 1);
  });

  // Dedicated Futuristic Neural Animated Background Canvas for AI Talksy
  const initAITalksyBackground = () => {
    const canvas = document.getElementById('aitalksy-neural-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : 600);
    let height = (canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : 450);

    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? 12 : 22;
    const microParticleCount = isMobile ? 8 : 14;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
      if (isReducedMotion) renderFrame();
    };
    window.addEventListener('resize', handleResize);

    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1.2,
        isGlow: i % 4 === 0,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    const particles = [];
    for (let i = 0; i < microParticleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: -(Math.random() * 0.35 + 0.15),
        alpha: Math.random() * 0.35 + 0.1,
        radius: Math.random() * 1.5 + 0.8
      });
    }

    let animFrameId = null;

    const renderFrame = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle neural connections
      const maxDistance = 90;
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.22;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw neural nodes
      for (let i = 0; i < nodeCount; i++) {
        const n = nodes[i];
        if (!isReducedMotion) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
          n.pulsePhase += 0.03;
        }
        const currentRadius = n.radius + (n.isGlow ? Math.sin(n.pulsePhase) * 0.8 : 0);

        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = n.isGlow ? 'rgba(34, 211, 238, 0.85)' : 'rgba(6, 182, 212, 0.45)';
        ctx.fill();

        if (n.isGlow) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, currentRadius * 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
          ctx.fill();
        }
      }

      // Draw soft drifting micro-particles
      for (let i = 0; i < microParticleCount; i++) {
        const p = particles[i];
        if (!isReducedMotion) {
          p.y += p.vy;
          if (p.y < 0) {
            p.y = height;
            p.x = Math.random() * width;
          }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${p.alpha})`;
        ctx.fill();
      }
    };

    const loop = () => {
      // Avoid expensive continuous animations when not visible or reduced motion
      if (!stories.aitalksy.isInView || isReducedMotion) {
        animFrameId = null;
        return;
      }
      renderFrame();
      animFrameId = requestAnimationFrame(loop);
    };

    stories.aitalksy.startCanvas = () => {
      if (isReducedMotion) {
        renderFrame();
        return;
      }
      if (!animFrameId && stories.aitalksy.isInView) {
        animFrameId = requestAnimationFrame(loop);
      }
    };

    stories.aitalksy.stopCanvas = () => {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    };

    renderFrame();
    if (stories.aitalksy.isInView && !isReducedMotion) {
      animFrameId = requestAnimationFrame(loop);
    }
  };

  initAITalksyBackground();

  // Dedicated Warm Ecosystem Background Canvas for Community Forum (Phase 7)
  const initCommunityBackground = () => {
    const canvas = document.getElementById('community-ecosystem-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : 600);
    let height = (canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : 450);

    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? 10 : 16;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
      if (isReducedMotion) renderFrame();
    };
    window.addEventListener('resize', handleResize);

    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        radius: Math.random() * 2.2 + 1.8,
        isHub: i % 3 === 0,
        color: i % 3 === 0 ? 'rgba(245, 158, 11, ' : (i % 3 === 1 ? 'rgba(16, 185, 129, ' : 'rgba(232, 88, 39, '),
        phase: Math.random() * Math.PI * 2
      });
    }

    const warmLights = [
      { x: width * 0.25, y: height * 0.35, vx: 0.15, vy: 0.12, radius: 140, color: 'rgba(245, 158, 11, 0.045)' },
      { x: width * 0.75, y: height * 0.65, vx: -0.12, vy: -0.15, radius: 160, color: 'rgba(16, 185, 129, 0.04)' }
    ];

    let animFrameId = null;

    const renderFrame = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw soft warm ambient drifting lights
      warmLights.forEach((light) => {
        if (!isReducedMotion) {
          light.x += light.vx;
          light.y += light.vy;
          if (light.x < 50 || light.x > width - 50) light.vx *= -1;
          if (light.y < 50 || light.y > height - 50) light.vy *= -1;
        }

        const grad = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.radius);
        grad.addColorStop(0, light.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Connected lines between community nodes
      const maxDistance = 110;
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.18;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // 3. Draw community nodes & subtle warm pulses
      for (let i = 0; i < nodeCount; i++) {
        const n = nodes[i];
        if (!isReducedMotion) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
          n.phase += 0.02;
        }
        const curRadius = n.radius + (n.isHub ? Math.sin(n.phase) * 0.7 : 0);

        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(1, curRadius), 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}0.75)`;
        ctx.fill();

        if (n.isHub) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, curRadius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `${n.color}0.08)`;
          ctx.fill();
        }
      }
    };

    const loop = () => {
      if (!stories.community.isInView || isReducedMotion) {
        animFrameId = null;
        return;
      }
      renderFrame();
      animFrameId = requestAnimationFrame(loop);
    };

    stories.community.startCanvas = () => {
      if (isReducedMotion) {
        renderFrame();
        return;
      }
      if (!animFrameId && stories.community.isInView) {
        animFrameId = requestAnimationFrame(loop);
      }
    };

    stories.community.stopCanvas = () => {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    };

    renderFrame();
    if (stories.community.isInView && !isReducedMotion) {
      animFrameId = requestAnimationFrame(loop);
    }
  };

  initCommunityBackground();

  // Dedicated Professional SaaS Background Canvas for RateHonk Travel CRM (Phase 8)
  const initRateHonkBackground = () => {
    const canvas = document.getElementById('ratehonk-saas-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : 600);
    let height = (canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : 450);

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 8 : 16;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
      if (isReducedMotion) renderFrame();
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.floor(Math.random() * 8) * (height / 8) + 20,
        speed: Math.random() * 0.8 + 0.4,
        length: Math.random() * 20 + 10,
        alpha: Math.random() * 0.4 + 0.2
      });
    }

    let chartPhase = 0;
    let animFrameId = null;

    const renderFrame = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle SaaS Coordinate Grid
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Moving SaaS Chart Trend Line
      if (!isReducedMotion) chartPhase += 0.02;
      ctx.beginPath();
      const points = 8;
      for (let i = 0; i <= points; i++) {
        const px = (width / points) * i;
        const baseProgress = (i / points);
        const py = (height * 0.75) - (baseProgress * height * 0.4) + Math.sin(chartPhase + i * 0.8) * 12;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.22)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 3. Subtle Glowing Data Points along Chart
      for (let i = 1; i < points; i++) {
        const px = (width / points) * i;
        const baseProgress = (i / points);
        const py = (height * 0.75) - (baseProgress * height * 0.4) + Math.sin(chartPhase + i * 0.8) * 12;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(96, 165, 250, 0.6)';
        ctx.fill();
      }

      // 4. Data Line Particles
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        if (!isReducedMotion) {
          p.x += p.speed;
          if (p.x > width + p.length) {
            p.x = -p.length;
            p.y = Math.floor(Math.random() * 8) * (height / 8) + 20;
          }
        }

        const grad = ctx.createLinearGradient(p.x - p.length, p.y, p.x, p.y);
        grad.addColorStop(0, 'rgba(59, 130, 246, 0)');
        grad.addColorStop(1, `rgba(59, 130, 246, ${p.alpha})`);

        ctx.beginPath();
        ctx.moveTo(p.x - p.length, p.y);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    const loop = () => {
      if (!stories.ratehonk.isInView || isReducedMotion) {
        animFrameId = null;
        return;
      }
      renderFrame();
      animFrameId = requestAnimationFrame(loop);
    };

    stories.ratehonk.startCanvas = () => {
      if (isReducedMotion) {
        renderFrame();
        return;
      }
      if (!animFrameId && stories.ratehonk.isInView) {
        animFrameId = requestAnimationFrame(loop);
      }
    };

    stories.ratehonk.stopCanvas = () => {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    };

    renderFrame();
    if (stories.ratehonk.isInView && !isReducedMotion) {
      animFrameId = requestAnimationFrame(loop);
    }
  };

  initRateHonkBackground();

  // IntersectionObserver: Viewport detection ensures animations ONLY run when the product enters view
  // and does NOT run all product animations simultaneously.
  if ('IntersectionObserver' in window) {
    const storyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const rawId = entry.target.getAttribute('data-story-id');
          const storyId = (rawId === 'communityforum' || rawId === 'community') ? 'community' : rawId;
          if (!storyId || !stories[storyId]) return;

          if (entry.isIntersecting) {
            stories[storyId].isInView = true;
            startStory(storyId);
          } else {
            stories[storyId].isInView = false;
            stopStory(storyId);
          }
        });
      },
      { threshold: 0.25 }
    );

    Object.keys(stories).forEach((k) => {
      if (stories[k].container) {
        storyObserver.observe(stories[k].container);
      }
    });
  } else {
    // Fallback if IntersectionObserver not available (start first story only)
    startStory('aitalksy');
  }

  // Phase 11: Premium Mouse Parallax for Flagship Product Stories
  const initProductMouseParallax = () => {
    // Disable if prefers-reduced-motion is active
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Disable on touch screens / mobile
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (prefersReducedMotion || !isFinePointer || window.innerWidth < 1024) {
      // Parallax strictly disabled on mobile and when prefers-reduced-motion is enabled
      return;
    }

    const cards = document.querySelectorAll('.cinematic-story-card');
    cards.forEach((card) => {
      const bgCanvas = card.querySelector('canvas');
      const stage = card.querySelector('.story-stage-canvas');

      let rafId = null;
      let targetBgX = 0, targetBgY = 0;
      let targetFgX = 0, targetFgY = 0;
      let currentBgX = 0, currentBgY = 0;
      let currentFgX = 0, currentFgY = 0;
      let isHovered = false;

      const updateTransforms = () => {
        // Smooth lerp (linear interpolation) for silky micro-motion (2-5px)
        currentBgX += (targetBgX - currentBgX) * 0.12;
        currentBgY += (targetBgY - currentBgY) * 0.12;
        currentFgX += (targetFgX - currentFgX) * 0.12;
        currentFgY += (targetFgY - currentFgY) * 0.12;

        if (bgCanvas) {
          bgCanvas.style.transform = `translate3d(${currentBgX.toFixed(2)}px, ${currentBgY.toFixed(2)}px, 0)`;
        }
        if (stage) {
          stage.style.transform = `translate3d(${currentFgX.toFixed(2)}px, ${currentFgY.toFixed(2)}px, 0)`;
        }

        if (isHovered || Math.abs(targetBgX - currentBgX) > 0.04 || Math.abs(targetBgY - currentBgY) > 0.04) {
          rafId = requestAnimationFrame(updateTransforms);
        } else {
          // Graceful resting state
          if (bgCanvas) bgCanvas.style.transform = '';
          if (stage) stage.style.transform = '';
          rafId = null;
        }
      };

      card.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 1024 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const rect = card.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;

        // Background moves 2-5px opposite
        targetBgX = -relX * 6; // max 3px
        targetBgY = -relY * 6;

        // Foreground moves slightly with cursor (1.5-3px)
        targetFgX = relX * 4; // max 2px
        targetFgY = relY * 4;

        if (!isHovered) {
          isHovered = true;
          if (!rafId) rafId = requestAnimationFrame(updateTransforms);
        }
      });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        targetBgX = 0;
        targetBgY = 0;
        targetFgX = 0;
        targetFgY = 0;
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth < 1024 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        cards.forEach((card) => {
          const bgCanvas = card.querySelector('canvas');
          const stage = card.querySelector('.story-stage-canvas');
          if (bgCanvas) bgCanvas.style.transform = '';
          if (stage) stage.style.transform = '';
        });
      }
    });
  };

  initProductMouseParallax();

  // Export system for global access and testing
  window.ProductStorySystem = {
    stories,
    showStep,
    startStory,
    stopStory,
    initProductMouseParallax
  };
}

/**
 * Product Details Modal Controller
 * Handles click on every product card, accurate data binding, fallbacks,
 * Add to Cart, Buy Now, Back to Products navigation, and slug URL routing.
 */
function initProductDetailModal() {
  const modal = document.getElementById('product-modal');
  if (!modal) return;

  const modalIconBox = document.getElementById('pmodal-icon-box');
  const modalCategory = document.getElementById('pmodal-category');
  const modalSku = document.getElementById('pmodal-sku');
  const modalPricing = document.getElementById('pmodal-pricing');
  const modalStock = document.getElementById('pmodal-stock');
  const modalTitle = document.getElementById('pmodal-title');
  const modalImage = document.getElementById('pmodal-image');
  const modalDesc = document.getElementById('pmodal-desc');
  const modalFeatures = document.getElementById('pmodal-features');
  const modalSpecsGrid = document.getElementById('pmodal-specs-grid');
  const modalTech = document.getElementById('pmodal-tech');
  const modalAddCartBtn = document.getElementById('pmodal-add-cart-btn');
  const modalCartText = document.getElementById('pmodal-cart-text');
  const modalVisitBtn = document.getElementById('pmodal-visit-btn');
  const modalVisitText = document.getElementById('pmodal-visit-text');
  const modalVisitIcon = document.getElementById('pmodal-visit-icon');
  const modalBackBtn = document.getElementById('pmodal-back-btn');
  const modalCloseBtn = document.getElementById('pmodal-close-btn');
  const modalCloseFooter = document.getElementById('pmodal-close-footer');

  let currentActiveProduct = null;

  // Toast feedback helper
  const showToast = (title, message) => {
    const toast = document.getElementById('cart-toast');
    const toastTitle = document.getElementById('cart-toast-title');
    const toastMsg = document.getElementById('cart-toast-msg');
    if (!toast) return;

    if (toastTitle) toastTitle.textContent = title;
    if (toastMsg) toastMsg.textContent = message;

    toast.classList.remove('hidden');
    toast.classList.add('flex');

    if (toast._timer) clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('flex');
    }, 3500);
  };

  /**
   * Resolves exact product data from PRODUCTS_DATA, DOM card attributes, or API
   */
  const getProductData = (productId) => {
    if (!productId) return null;
    const cleanId = productId.toLowerCase().trim();

    // 1. Direct key match
    if (PRODUCTS_DATA[cleanId]) return PRODUCTS_DATA[cleanId];

    // 2. Normalized match (hyphens / spacing / title matching)
    const foundKey = Object.keys(PRODUCTS_DATA).find(
      (k) =>
        k === cleanId ||
        k.replace(/-/g, '') === cleanId.replace(/-/g, '') ||
        PRODUCTS_DATA[k].title?.toLowerCase() === cleanId ||
        PRODUCTS_DATA[k].name?.toLowerCase() === cleanId
    );
    if (foundKey) return PRODUCTS_DATA[foundKey];

    // 3. Fallback: Extract from the DOM card if rendered dynamically or customized
    const cardEl = document.querySelector(`.product-card[data-product-id="${productId}"]`);
    if (cardEl) {
      const cardTitle = cardEl.getAttribute('data-name') || cardEl.querySelector('h3 span')?.textContent?.trim() || 'Vani Technology Solution';
      const cardCategory = cardEl.getAttribute('data-category') || 'Services';
      const cardImg = cardEl.querySelector('img')?.getAttribute('src') || 'assets/images/portfolio/Tablet-Screens-presentation-Mock-up.png';
      const cardDesc = cardEl.querySelector('p')?.textContent?.trim() || 'Enterprise-grade digital solution engineered by Vani Technologies.';
      const features = Array.from(cardEl.querySelectorAll('.space-y-1\\.5 span')).map((s) => s.textContent.trim()).filter(Boolean);

      return {
        id: productId,
        title: cardTitle,
        name: cardTitle,
        category: cardCategory.toUpperCase(),
        categorySlug: cardCategory.toLowerCase(),
        pricing: 'Enterprise Custom / Inquire',
        price: 'Custom Pricing',
        stock: 'In Stock / Ready to Deploy',
        availability: 'Available Now',
        icon: 'fa-solid fa-shapes',
        image: cardImg,
        fallbackImage: 'assets/images/portfolio/Tablet-Screens-presentation-Mock-up.png',
        link: '#contact',
        isExternal: false,
        desc: cardDesc,
        description: cardDesc,
        features: features.length ? features : ['High Availability Architecture', 'Custom Integration Support', 'Dedicated Engineering SLA'],
        specifications: [
          { label: 'Platform Type', value: 'Enterprise Digital Solution' },
          { label: 'Security', value: 'Role-Based Access & Data Encryption' },
          { label: 'Deployment', value: 'Cloud / SaaS & Dedicated On-Prem' },
          { label: 'Support', value: '24/7 SLA Engineering Support' }
        ],
        tech: ['Modern Web', 'Node.js', 'Cloud Architecture']
      };
    }

    return null;
  };

  /**
   * Opens the Product Details Modal with the exact product data
   */
  const openProductModal = (productId) => {
    const product = getProductData(productId);
    if (!product) {
      console.warn(`[Vani Technologies] Product not found for ID: ${productId}`);
      return;
    }

    currentActiveProduct = product;

    // Header & Badges
    if (modalIconBox) modalIconBox.innerHTML = `<i class="${product.icon || 'fa-solid fa-shapes'}"></i>`;
    if (modalCategory) modalCategory.textContent = product.category || 'Technology';
    if (modalSku) modalSku.textContent = `ID: ${product.id}`;
    if (modalPricing) modalPricing.textContent = product.pricing || product.price || 'Custom Pricing';
    if (modalStock) modalStock.textContent = product.stock || product.availability || 'In Stock / Available';
    if (modalTitle) modalTitle.textContent = product.title || product.name || 'Product Details';

    // Image preview with graceful fallback
    if (modalImage) {
      modalImage.src = product.image || product.fallbackImage || 'assets/images/portfolio/Tablet-Screens-presentation-Mock-up.png';
      modalImage.alt = product.title || 'Product Preview';
      if (['ai-talksy', 'community-forum', 'ratehonk-travel-crm'].includes(product.id)) {
        modalImage.className = 'w-full h-full object-contain p-6 bg-white';
      } else {
        modalImage.className = 'w-full h-full object-cover';
      }
      modalImage.onerror = function () {
        this.onerror = null;
        this.src = product.fallbackImage || 'assets/images/portfolio/Tablet-Screens-presentation-Mock-up.png';
      };
    }

    // Overview description
    if (modalDesc) {
      modalDesc.textContent = product.desc || product.description || 'Enterprise-grade digital solution engineered by Vani Technologies.';
    }

    // Features checklist
    if (modalFeatures) {
      const featuresList = (product.features && product.features.length)
        ? product.features
        : ['High-Performance Scalability', 'Enterprise Data Protection', '24/7 Dedicated SLA Support'];

      modalFeatures.innerHTML = featuresList
        .map(
          (f) => `
            <li class="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/[0.03] border border-white/5 hover:border-[#e85827]/30 transition-colors">
              <i class="fa-solid fa-circle-check text-[#e85827] text-xs mt-1 shrink-0"></i>
              <span class="text-xs text-slate-200 font-medium leading-relaxed">${f}</span>
            </li>
          `
        )
        .join('');
    }

    // Specifications Grid
    if (modalSpecsGrid) {
      const specs = (product.specifications && product.specifications.length)
        ? product.specifications
        : [
            { label: 'Platform Type', value: `${product.category || 'Digital'} Platform` },
            { label: 'Deployment', value: 'Cloud SaaS / Dedicated Hosting' },
            { label: 'Security', value: 'End-to-End Encryption & RBAC' },
            { label: 'SLA Support', value: '24/7 Monitored Uptime' }
          ];

      modalSpecsGrid.innerHTML = specs
        .map(
          (s) => `
            <div class="p-2.5 rounded-lg bg-[#252e40]/70 border border-[#60697d]/25 flex items-center justify-between gap-3 text-xs">
              <span class="text-slate-400 font-mono uppercase text-[10px] tracking-wider">${s.label}</span>
              <span class="text-white font-semibold text-right">${s.value}</span>
            </div>
          `
        )
        .join('');
    }

    // Tech Stack Badges
    if (modalTech) {
      const techList = (product.tech && product.tech.length)
        ? product.tech
        : ['Node.js', 'Cloud Architecture', 'Secure REST APIs'];

      modalTech.innerHTML = techList
        .map(
          (t) => `
            <span class="px-2.5 py-1 text-xs rounded-md bg-[#252e40] text-slate-200 border border-[#60697d]/35 font-mono shadow-sm">
              ${t}
            </span>
          `
        )
        .join('');
    }

    // Configure "Add to Cart" button
    if (modalAddCartBtn && modalCartText) {
      modalCartText.textContent = 'Add to Cart';
      modalAddCartBtn.onclick = (e) => {
        e.preventDefault();
        try {
          const cart = JSON.parse(localStorage.getItem('vani_cart') || '[]');
          if (!cart.some((item) => item.id === product.id)) {
            cart.push({
              id: product.id,
              name: product.title || product.name,
              category: product.category,
              pricing: product.pricing || product.price,
              addedAt: new Date().toISOString()
            });
            localStorage.setItem('vani_cart', JSON.stringify(cart));
          }
        } catch (err) {}

        modalAddCartBtn.classList.add('bg-emerald-600', 'text-white');
        modalCartText.innerHTML = '<i class="fa-solid fa-check mr-1 text-white"></i> Added!';
        showToast(`${product.title} added to cart!`, 'Saved to your inquiry list. You can finalize your inquiry below.');

        setTimeout(() => {
          modalAddCartBtn.classList.remove('bg-emerald-600', 'text-white');
          modalCartText.textContent = 'Add to Cart';
        }, 2200);
      };
    }

    // Configure "Buy Now / Visit Product / Inquire" button
    if (modalVisitBtn) {
      modalVisitBtn.href = product.link || '#contact';
      if (product.isExternal) {
        modalVisitBtn.target = '_blank';
        modalVisitBtn.rel = 'noopener noreferrer';
        if (modalVisitText) modalVisitText.textContent = 'Visit Live Product';
        if (modalVisitIcon) modalVisitIcon.className = 'fa-solid fa-arrow-up-right-from-square text-xs';
        modalVisitBtn.onclick = null;
      } else {
        modalVisitBtn.removeAttribute('target');
        modalVisitBtn.removeAttribute('rel');
        if (modalVisitText) modalVisitText.textContent = 'Inquire / Buy Now';
        if (modalVisitIcon) modalVisitIcon.className = 'fa-solid fa-bolt text-xs';
        modalVisitBtn.onclick = (e) => {
          e.preventDefault();
          closeProductModal();

          const contactSection = document.querySelector('#contact');
          if (contactSection) {
            const navbarHeight = 72;
            const targetPos = contactSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });

            const msgBox = document.getElementById('contact-message');
            if (msgBox) {
              msgBox.value = `Hello Vani Technologies Team,\n\nI am interested in acquiring / licensing "${product.title}" (${product.pricing || 'Custom'}). Please provide availability details, deployment timelines, and pricing options.`;
              msgBox.dispatchEvent(new Event('input', { bubbles: true }));
            }
            const serviceSelect = document.getElementById('contact-service');
            if (serviceSelect) {
              serviceSelect.value = 'General Inquiry';
            }
          }
        };
      }
    }

    // Update URL hash for clean slug routing / bookmarking
    try {
      if (window.location.hash !== `#/products/${product.id}`) {
        window.history.replaceState(null, '', `#/products/${encodeURIComponent(product.id)}`);
      }
    } catch (e) {}

    // Open Modal with Animation
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  /**
   * Closes the Product Details Modal and resets URL hash cleanly
   */
  const closeProductModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentActiveProduct = null;

    // Reset URL hash cleanly back to #products
    try {
      if (window.location.hash.startsWith('#/products/')) {
        window.history.replaceState(null, '', '#products');
      }
    } catch (e) {}
  };

  /**
   * 1. Make EVERY product card clickable
   */
  const attachCardListeners = () => {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card) => {
      card.style.cursor = 'pointer';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      card.addEventListener('click', (e) => {
        // If clicking directly on an external anchor with target="_blank", allow standard link navigation
        const clickedExternalLink = e.target.closest('a[target="_blank"]');
        if (clickedExternalLink) {
          return;
        }

        e.preventDefault();
        const pId = card.getAttribute('data-product-id') || card.querySelector('[data-product-id]')?.getAttribute('data-product-id');
        if (pId) {
          openProductModal(pId);
        }
      });

      // Keyboard accessibility (Enter or Space)
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const pId = card.getAttribute('data-product-id');
          if (pId) openProductModal(pId);
        }
      });
    });

    // Also attach to any explicit .product-modal-trigger buttons
    document.querySelectorAll('.product-modal-trigger').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pId = btn.getAttribute('data-product-id') || btn.closest('.product-card')?.getAttribute('data-product-id');
        if (pId) openProductModal(pId);
      });
    });
  };

  attachCardListeners();

  // Close handlers
  if (modalBackBtn) modalBackBtn.addEventListener('click', closeProductModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProductModal);
  if (modalCloseFooter) modalCloseFooter.addEventListener('click', closeProductModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeProductModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeProductModal();
    }
  });

  // Deep-linking / URL hash router: check URL on load & on hashchange
  const handleUrlProductRoute = () => {
    const hash = window.location.hash || '';
    const searchParams = new URLSearchParams(window.location.search);
    const paramProduct = searchParams.get('product');

    let targetId = null;

    if (paramProduct) {
      targetId = paramProduct;
    } else if (hash.startsWith('#/products/')) {
      targetId = hash.replace('#/products/', '').split('?')[0];
    } else if (hash.startsWith('#product-')) {
      targetId = hash.replace('#product-', '').split('?')[0];
    }

    if (targetId) {
      setTimeout(() => {
        openProductModal(targetId);
      }, 150);
    }
  };

  window.addEventListener('hashchange', handleUrlProductRoute);
  handleUrlProductRoute();

  // Expose openProductModal globally for direct programmatic calls
  window.openProductModal = openProductModal;
  window.closeProductModal = closeProductModal;
}

/**
 * Phase 7: Initialize Contact Form Handler & Validations
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('contact-submit-btn');
  const btnText = document.getElementById('contact-btn-text');
  const btnIcon = document.getElementById('contact-btn-icon');
  const alertContainerId = 'contact-alert';
  const messageInput = document.getElementById('contact-message');
  const charCount = document.getElementById('char-count');

  // Auto-fill form if logged in
  if (window.Auth && window.Auth.isAuthenticated()) {
    const user = window.Auth.getUser();
    if (user) {
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const phoneInput = document.getElementById('contact-phone');

      if (nameInput && !nameInput.value) nameInput.value = user.fullName || '';
      if (emailInput && !emailInput.value) emailInput.value = user.email || '';
      if (phoneInput && !phoneInput.value) phoneInput.value = user.phone || '';
    }
  }

  // Live character counter for message
  if (messageInput && charCount) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      if (len < 10) {
        charCount.textContent = `${len}/10 min characters`;
        charCount.className = 'text-[11px] text-amber-400 font-medium';
      } else {
        charCount.textContent = `${len} characters`;
        charCount.className = 'text-[11px] text-emerald-400 font-medium';
      }
    });
  }

  // Pre-select service from URL query param if present
  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get('service');
  if (requestedService) {
    const serviceSelect = document.getElementById('contact-service');
    if (serviceSelect) {
      for (let opt of serviceSelect.options) {
        if (opt.value.toLowerCase() === requestedService.toLowerCase()) {
          serviceSelect.value = opt.value;
          break;
        }
      }
    }
  }

  // Form submission handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (window.Auth) window.Auth.hideAlert(alertContainerId);

    const name = document.getElementById('contact-name')?.value.trim();
    const email = document.getElementById('contact-email')?.value.trim();
    const phone = document.getElementById('contact-phone')?.value.trim();
    const company = document.getElementById('contact-company')?.value.trim();
    const service = document.getElementById('contact-service')?.value.trim();
    const message = messageInput ? messageInput.value.trim() : '';

    // Validations
    if (!name || name.length < 2) {
      if (window.Auth) window.Auth.showAlert(alertContainerId, 'Please enter your full name (at least 2 characters).', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      if (window.Auth) window.Auth.showAlert(alertContainerId, 'Please enter a valid email address.', 'warning');
      return;
    }

    if (!phone || phone.length < 7) {
      if (window.Auth) window.Auth.showAlert(alertContainerId, 'Please enter a valid phone number (at least 7 digits).', 'warning');
      return;
    }

    if (!service) {
      if (window.Auth) window.Auth.showAlert(alertContainerId, 'Please select a service or technology discipline.', 'warning');
      return;
    }

    if (!message || message.length < 10) {
      if (window.Auth) window.Auth.showAlert(alertContainerId, 'Please enter a detailed message (minimum 10 characters).', 'warning');
      return;
    }

    // Set Loading State
    submitBtn.disabled = true;
    btnText.textContent = 'Sending Inquiry...';
    btnIcon.className = 'fa-solid fa-spinner animate-spin text-xs';
    if (window.Auth) {
      window.Auth.showAlert(alertContainerId, 'Loading... Transmitting your project inquiry to our team.', 'warning');
    }

    try {
      const res = await (window.Auth ? window.Auth.submitContact({
        name,
        email,
        phone,
        company,
        service,
        message,
      }) : fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, company, service, message })
      }).then(r => r.json()));

      if (res.ok !== false && (res.success || res.status === 201)) {
        // Success message
        if (window.Auth) {
          window.Auth.showAlert(
            alertContainerId,
            `<strong>Success!</strong> ${res.message || 'Your inquiry has been received. Our team will contact you within 24 hours.'}`,
            'success'
          );
        }
        form.reset();
        if (charCount) {
          charCount.textContent = 'min 10 characters';
          charCount.className = 'text-[11px] text-slate-400';
        }
      } else {
        // Error message (including 429 rate limit or validation)
        const errMsg = res.message || 'Failed to submit inquiry. Please try again.';
        if (window.Auth) {
          window.Auth.showAlert(alertContainerId, errMsg, res.status === 429 ? 'warning' : 'error');
        }
      }
    } catch (err) {
      console.error(err);
      if (window.Auth) {
        window.Auth.showAlert(alertContainerId, 'Network error. Please ensure the backend server is reachable.', 'error');
      }
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = 'Send Inquiry';
      btnIcon.className = 'fa-solid fa-paper-plane text-xs';
    }
  });
}


