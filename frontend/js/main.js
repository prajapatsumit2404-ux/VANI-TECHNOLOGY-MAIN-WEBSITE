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

  // 8a. Premium product showcase (above #products)
  initProductShowcase();

  // 8b. Cinematic Product Story Controller (Main Products)
  initCinematicProductStories();

  // 8c. SaaS product presenter (#products tabbed layout)
  initVaniProductsSection();

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

  const resetStats = () => {
    statElements.forEach((el) => {
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      el.textContent = (0).toFixed(decimals) + suffix;
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          statElements.forEach((el) => {
            const target = parseFloat(el.getAttribute('data-target') || '0');
            const suffix = el.getAttribute('data-suffix') || '';
            const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
            animateValue(el, 0, target, 1600, decimals, suffix);
          });
        } else {
          resetStats();
        }
      });
    },
    { threshold: 0.25 }
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
    if (card.closest('#home')) return;
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
    title: 'TravelJioo',
    name: 'TravelJioo',
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
    image: 'assets/images/portfolio/software-testing-qa.jpg',
    fallbackImage: 'assets/images/portfolio/3.png',
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
 * In-phone nav taps + press feedback — #products only
 */
function initVaniProdPhoneDeviceFeel(root, demo) {
  if (!root) return;

  const transitionAppView = (panelKey, viewId) => {
    const panel = root.querySelector(`[data-vani-prod-panel="${panelKey}"]`);
    if (!panel || typeof gsap === 'undefined') {
      if (demo && demo.setAppView) demo.setAppView(panelKey, viewId);
      return;
    }
    const current = panel.querySelector('.vani-prod-app-view.is-active-view');
    const next = panel.querySelector(`.vani-prod-app-view[data-app-view="${viewId}"]`);
    if (!next || current === next) return;
    const body = panel.querySelector('.vani-prod-app-body');
    if (body) body.classList.add('is-nav-switching');
    gsap
      .timeline({
        onComplete: () => {
          if (body) {
            body.classList.remove('is-nav-switching');
            body.scrollTop = 0;
          }
          next.classList.remove('is-view-enter');
        },
      })
      .to(current, { opacity: 0, y: -4, duration: 0.2, ease: 'power2.in' })
      .call(() => {
        if (demo && demo.setAppView) demo.setAppView(panelKey, viewId);
        else {
          panel.querySelectorAll('.vani-prod-app-view').forEach((view) => {
            const on = view.getAttribute('data-app-view') === viewId;
            view.classList.toggle('is-active-view', on);
            if (on) view.removeAttribute('hidden');
            else view.setAttribute('hidden', '');
          });
          panel.querySelectorAll('.vani-prod-app-nav [data-nav]').forEach((tab) => {
            tab.classList.toggle('is-on', tab.getAttribute('data-nav') === viewId);
          });
        }
        next.classList.add('is-view-enter');
      })
      .fromTo(next, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' });
  };

  root.querySelectorAll('[data-vani-prod-panel]').forEach((panel) => {
    const panelKey = panel.getAttribute('data-vani-prod-panel');
    panel.querySelectorAll('.vani-prod-app-nav [data-nav]').forEach((nav) => {
      nav.addEventListener('click', () => {
        nav.classList.add('is-tapped');
        window.setTimeout(() => nav.classList.remove('is-tapped'), 220);
        transitionAppView(panelKey, nav.getAttribute('data-nav'));
      });
    });
  });
}

/**
 * Static feature navigation when GSAP demo is disabled — #products only
 */
function bindVaniProdStaticFeatureExplore(root) {
  ensureVaniProdStackPanelsVisible(root);

  const panelKeys = ['aitalksy', 'community', 'traveljioo'];
  const staticViews = {
    aitalksy: ['hiw-connect', 'hiw-contacts', 'hiw-campaign', 'hiw-results'],
    community: ['home', 'verify', 'services', 'hub'],
    traveljioo: ['tj-overview', 'tj-crm', 'tj-flight', 'tj-hotel', 'tj-package', 'tj-group', 'tj-email', 'tj-analytics', 'tj-integrations'],
  };

  const setActiveFeatureStatic = (panelKey, index) => {
    const panel = root.querySelector(`[data-vani-prod-panel="${panelKey}"]`);
    if (!panel) return;
    panel.querySelectorAll('[data-vani-feature]').forEach((step) => {
      const n = parseInt(step.getAttribute('data-vani-feature') || '0', 10);
      step.classList.toggle('is-active', index > 0 && n === index);
      step.classList.toggle('is-done', index > 0 && n < index);
    });
    const now = panel.querySelector('[data-vani-feature-now]');
    const active = panel.querySelector(`[data-vani-feature="${index}"]`);
    if (now && active) {
      const title = active.querySelector('strong')?.textContent?.trim() || '';
      const desc =
        active.querySelector('.vani-prod-feature-step-body > span')?.textContent?.trim() || '';
      now.innerHTML = title ? `<strong>${title}</strong> — ${desc}` : 'Select a feature to preview';
      now.classList.toggle('is-live', !!title);
    }
    panel.querySelectorAll('[data-vani-feature-dot]').forEach((dot) => {
      const n = parseInt(dot.getAttribute('data-vani-feature-dot') || '0', 10);
      const on = n === index;
      dot.classList.toggle('is-active', on);
      dot.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    const prev = panel.querySelector('[data-vani-feature-prev]');
    const next = panel.querySelector('[data-vani-feature-next]');
    if (prev) prev.disabled = index <= 1;
    if (next) next.disabled = index >= 4;

    const viewId = staticViews[panelKey]?.[index - 1];
    const screen = panel.querySelector('[data-vani-app]');
    if (screen && viewId) {
      screen.querySelectorAll('.vani-prod-app-view').forEach((view) => {
        const on = view.getAttribute('data-app-view') === viewId;
        view.classList.toggle('is-active-view', on);
        if (on) view.removeAttribute('hidden');
        else view.setAttribute('hidden', '');
      });
      screen.querySelectorAll('.vani-prod-app-nav [data-nav]').forEach((tab) => {
        tab.classList.toggle('is-on', tab.getAttribute('data-nav') === viewId);
      });
    }
    const stage = panel.querySelector('.vani-prod-demo-stage');
    if (stage) stage.classList.add('is-visible');
  };

  const go = (panelKey, index) => {
    if (index < 1) index = 1;
    if (index > 4) index = 4;
    root.classList.add('vani-prod-user-driving');
    setActiveFeatureStatic(panelKey, index);
  };

  panelKeys.forEach((panelKey) => {
    const panel = root.querySelector(`[data-vani-prod-panel="${panelKey}"]`);
    if (!panel) return;
    if (panelKey === 'traveljioo' && panel.hasAttribute('data-vani-travel-auto-demo')) return;
    if (panelKey === 'community' && panel.querySelector('[data-vani-community-showcase]')) return;
    let current = 1;

    panel.querySelectorAll('[data-vani-feature]').forEach((btn) => {
      btn.addEventListener('click', () => {
        current = parseInt(btn.getAttribute('data-vani-feature') || '1', 10);
        go(panelKey, current);
      });
    });
    panel.querySelectorAll('[data-vani-feature-dot]').forEach((dot) => {
      dot.addEventListener('click', () => {
        current = parseInt(dot.getAttribute('data-vani-feature-dot') || '1', 10);
        go(panelKey, current);
      });
    });
    const prev = panel.querySelector('[data-vani-feature-prev]');
    const next = panel.querySelector('[data-vani-feature-next]');
    if (prev) {
      prev.addEventListener('click', () => {
        current = Math.max(1, current - 1);
        go(panelKey, current);
      });
    }
    if (next) {
      next.addEventListener('click', () => {
        current = Math.min(4, current + 1);
        go(panelKey, current);
      });
    }
    panel.querySelector('[data-vani-feature-resume]')?.addEventListener('click', () => {
      root.classList.remove('vani-prod-user-driving');
      current = 1;
      setActiveFeatureStatic(panelKey, 1);
    });

    const swipeZone = panel.querySelector('[data-vani-swipe-zone]');
    if (swipeZone) {
      let startX = 0;
      swipeZone.addEventListener(
        'touchstart',
        (e) => {
          startX = e.changedTouches[0]?.clientX || 0;
        },
        { passive: true }
      );
      swipeZone.addEventListener(
        'touchend',
        (e) => {
          const dx = (e.changedTouches[0]?.clientX || 0) - startX;
          if (Math.abs(dx) < 48) return;
          if (dx < 0) current = Math.min(4, current + 1);
          else current = Math.max(1, current - 1);
          go(panelKey, current);
        },
        { passive: true }
      );
    }
  });
}

/**
 * AI Talksy — keyboard navigation for interactive controls (#vani-prod-panel-aitalksy only)
 */
function initAitalksyKeyboardNav(panel, ctx) {
  const bindRoving = (items, opts) => {
    if (!items.length) return;
    items.forEach((el, i) => el.setAttribute('tabindex', i === 0 ? '0' : '-1'));
    const focusAt = (idx) => {
      const i = ((idx % items.length) + items.length) % items.length;
      items.forEach((el, j) => el.setAttribute('tabindex', j === i ? '0' : '-1'));
      items[i]?.focus();
    };
    items.forEach((el, i) => {
      el.addEventListener('keydown', (e) => {
        const prevKey = opts.horizontal ? 'ArrowLeft' : 'ArrowUp';
        const nextKey = opts.horizontal ? 'ArrowRight' : 'ArrowDown';
        if (e.key === prevKey) {
          e.preventDefault();
          focusAt(i - 1);
        } else if (e.key === nextKey) {
          e.preventDefault();
          focusAt(i + 1);
        } else if (e.key === 'Home') {
          e.preventDefault();
          focusAt(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          focusAt(items.length - 1);
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });
  };

  bindRoving(ctx.featureCards, { horizontal: true });
  bindRoving(ctx.hiwSteps, { horizontal: false });
  bindRoving(ctx.phoneStepNav, { horizontal: true });
  if (ctx.phoneFeatureNav?.length) bindRoving(ctx.phoneFeatureNav, { horizontal: true });
  if (ctx.integrationCards?.length) bindRoving(ctx.integrationCards, { horizontal: true });
  bindRoving(ctx.storySteps, { horizontal: false });

  panel.querySelector('[data-vani-aitalksy-preview-controls]')?.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const pause = panel.querySelector('[data-vani-aitalksy-pause]');
    if (pause) pause.click();
  });
}

/**
 * Community Forum — interactive screen showcase (#vani-prod-panel-community only)
 */
function initCommunityInteractivePreview(productsRoot) {
  const panel = productsRoot.querySelector('[data-vani-prod-panel="community"]');
  if (!panel?.querySelector('[data-vani-community-showcase]')) return null;

  if (typeof panel._vaniCfAbort === 'function') panel._vaniCfAbort();

  let autoplayTimer = null;
  let uidaiTimer = null;
  let autoplayPlaying = false;
  let reducedMotion = false;
  try {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (err) {}
  const AUTOPLAY_STEP_MS = reducedMotion ? 1100 : 2600;

  const ac = new AbortController();
  const sig = ac.signal;
  const bind = (node, type, handler, opts = {}) => {
    if (!node) return;
    node.addEventListener(type, handler, { ...opts, signal: sig });
  };

  const screenList = panel.querySelector('.vani-prod-cf-screens-list');
  const screenNow = panel.querySelector('[data-vani-cf-screen-now]');
  const caption = productsRoot.querySelector('[data-vani-demo-caption="community"]');
  const deviceInner = panel.querySelector('[data-vani-cf-device-inner]');
  const deviceHeader = panel.querySelector('[data-vani-cf-device-header]');
  const appNav = panel.querySelector('[data-vani-cf-app-nav]');
  const appScreen = panel.querySelector('[data-vani-app="community"]');
  const progressWrap = panel.querySelector('[data-vani-cf-progress-wrap]');
  const progressFill = panel.querySelector('[data-vani-cf-progress-fill]');
  const progressLabel = panel.querySelector('[data-vani-cf-progress-label]');
  const phoneStage = panel.querySelector('[data-vani-cf-phone-stage]');
  const autoplayPlayBtn = panel.querySelector('[data-vani-cf-autoplay-play]');
  const autoplayPauseBtn = panel.querySelector('[data-vani-cf-autoplay-pause]');
  const autoplayStatus = panel.querySelector('[data-vani-cf-autoplay-status]');

  const DEMO_OTP = '123456';
  const DEMO_AADHAAR = '999988887777';

  const ONBOARDING_FLOW = [
    'cf-onboarding',
    'cf-mobile',
    'cf-otp',
    'cf-aadhaar',
    'cf-uidai',
    'cf-review',
    'cf-personal',
    'cf-work',
    'cf-photo',
    'cf-submit',
    'cf-awaiting',
    'cf-approved',
  ];

  const MAIN_APP_IDS = new Set([
    'cf-dashboard',
    'cf-feed',
    'cf-ai',
    'cf-reels',
    'cf-matrimony',
    'cf-marketplace',
    'cf-market-detail',
    'cf-bill-pay',
    'cf-e-voting',
    'cf-events',
    'cf-event-detail',
    'cf-committee',
    'cf-announcements',
    'cf-announcement-detail',
    'cf-family-tree',
    'cf-profile',
    'cf-earnings',
  ]);

  const bottomNavForView = (viewId) => {
    if (viewId === 'cf-feed') return 'cf-feed';
    if (viewId === 'cf-ai') return 'cf-ai';
    if (viewId === 'cf-reels') return 'cf-reels';
    if (viewId === 'cf-profile' || viewId === 'cf-family-tree') return 'cf-profile';
    return 'cf-dashboard';
  };

  const SCREENS = [
    {
      id: 'cf-onboarding',
      journey: 'onboarding',
      label: 'Welcome',
      desc: 'Brand mark, welcome message, and account entry.',
      icon: 'fa-hand-sparkles',
      caption: 'Onboarding — welcome & account entry',
    },
    {
      id: 'cf-mobile',
      journey: 'onboarding',
      label: 'Mobile number',
      desc: 'Enter a demo phone number (not stored).',
      icon: 'fa-mobile-screen',
      caption: 'Onboarding — mobile number (demo)',
    },
    {
      id: 'cf-otp',
      journey: 'onboarding',
      label: 'OTP verify',
      desc: 'Use demo OTP 123456 — simulated SMS only.',
      icon: 'fa-comment-sms',
      caption: 'Onboarding — OTP verification (demo)',
    },
    {
      id: 'cf-aadhaar',
      journey: 'onboarding',
      label: 'Aadhaar KYC',
      desc: 'Fictional demo ID — not real UIDAI.',
      icon: 'fa-id-card',
      caption: 'Onboarding — demo KYC (not UIDAI)',
    },
    {
      id: 'cf-uidai',
      journey: 'onboarding',
      label: 'UIDAI fetch',
      desc: 'Simulated registry fetch for demonstration.',
      icon: 'fa-cloud-arrow-down',
      caption: 'Onboarding — simulated UIDAI fetch (demo)',
    },
    {
      id: 'cf-review',
      journey: 'onboarding',
      label: 'Review details',
      desc: 'Confirm sample KYC fields.',
      icon: 'fa-list-check',
      caption: 'Onboarding — review demo details',
    },
    {
      id: 'cf-personal',
      journey: 'onboarding',
      label: 'Personal info',
      desc: 'Demo name and city.',
      icon: 'fa-user',
      caption: 'Onboarding — personal info',
    },
    {
      id: 'cf-work',
      journey: 'onboarding',
      label: 'Work profile',
      desc: 'Occupation and organization.',
      icon: 'fa-briefcase',
      caption: 'Onboarding — work profile',
    },
    {
      id: 'cf-photo',
      journey: 'onboarding',
      label: 'Profile photo',
      desc: 'Accept demo avatar.',
      icon: 'fa-camera',
      caption: 'Onboarding — profile photo (demo)',
    },
    {
      id: 'cf-submit',
      journey: 'onboarding',
      label: 'Submit',
      desc: 'Send demo application (no API).',
      icon: 'fa-paper-plane',
      caption: 'Onboarding — submit demo application',
    },
    {
      id: 'cf-awaiting',
      journey: 'onboarding',
      label: 'Awaiting approval',
      desc: 'Simulated pending community review.',
      icon: 'fa-hourglass-half',
      caption: 'Onboarding — awaiting approval (demo)',
    },
    {
      id: 'cf-approved',
      journey: 'onboarding',
      label: 'Membership approved',
      desc: 'Demonstration approval — not official.',
      icon: 'fa-circle-check',
      caption: 'Onboarding — demo membership approved',
    },
    {
      id: 'cf-dashboard',
      journey: 'main',
      label: 'Dashboard',
      desc: 'Stories, KPIs, and quick service tiles.',
      icon: 'fa-house',
      caption: 'Main app — dashboard / डैशबोर्ड',
    },
    {
      id: 'cf-feed',
      journey: 'main',
      label: 'Community feed',
      desc: 'Searchable posts and category chips.',
      icon: 'fa-newspaper',
      caption: 'Main app — community feed',
    },
    {
      id: 'cf-matrimony',
      journey: 'main',
      label: 'Matrimony',
      desc: 'Verified profiles and connect requests.',
      icon: 'fa-heart',
      caption: 'Main app — matrimony / विवाह',
    },
    {
      id: 'cf-marketplace',
      journey: 'main',
      label: 'Marketplace',
      desc: 'Listings with demo product detail.',
      icon: 'fa-store',
      caption: 'Main app — marketplace',
    },
    {
      id: 'cf-bill-pay',
      journey: 'main',
      label: 'Bill pay',
      desc: 'Simulated payment confirmation.',
      icon: 'fa-receipt',
      caption: 'Main app — bill pay (demo)',
    },
    {
      id: 'cf-e-voting',
      journey: 'main',
      label: 'E-voting',
      desc: 'Simulated ballot and vote submitted.',
      icon: 'fa-check-to-slot',
      caption: 'Main app — e-voting demo',
    },
    {
      id: 'cf-events',
      journey: 'main',
      label: 'Events',
      desc: 'RSVP cards and event detail.',
      icon: 'fa-calendar-days',
      caption: 'Main app — events',
    },
    {
      id: 'cf-committee',
      journey: 'main',
      label: 'Committee',
      desc: 'Sample leadership directory.',
      icon: 'fa-user-tie',
      caption: 'Main app — committee',
    },
    {
      id: 'cf-announcements',
      journey: 'main',
      label: 'Announcements',
      desc: 'Readable notice detail views.',
      icon: 'fa-bullhorn',
      caption: 'Main app — announcements',
    },
    {
      id: 'cf-family-tree',
      journey: 'main',
      label: 'Family tree',
      desc: 'Sample bilingual relationships.',
      icon: 'fa-sitemap',
      caption: 'Main app — family tree',
    },
    {
      id: 'cf-profile',
      journey: 'main',
      label: 'Member profile',
      desc: 'Posts, About, Family, Activity tabs.',
      icon: 'fa-user',
      caption: 'Main app — member profile',
    },
    {
      id: 'cf-earnings',
      journey: 'main',
      label: 'Earnings',
      desc: 'Demo wallet and referral samples.',
      icon: 'fa-wallet',
      caption: 'Main app — earnings (demo)',
    },
  ];

  let activeJourney = 'onboarding';
  let activeScreenId = 'cf-onboarding';
  const demoState = { mobile: '', fullName: '', city: '', occupation: '' };

  const screensForJourney = (journey) => SCREENS.filter((s) => s.journey === journey);

  const isOnboardingStep = (viewId) => ONBOARDING_FLOW.includes(viewId);
  const onboardingIndex = (viewId) => ONBOARDING_FLOW.indexOf(viewId);

  const clearViewError = (viewEl) => {
    const err = viewEl?.querySelector('[data-vani-cf-error]');
    if (err) {
      err.textContent = '';
      err.hidden = true;
    }
  };

  const showViewError = (viewId, message) => {
    const viewEl = appScreen?.querySelector(`[data-app-view="${viewId}"]`);
    const err = viewEl?.querySelector('[data-vani-cf-error]');
    if (err) {
      err.textContent = message;
      err.hidden = !message;
    }
  };

  const getFieldValue = (viewId, key) => {
    const viewEl = appScreen?.querySelector(`[data-app-view="${viewId}"]`);
    const input = viewEl?.querySelector(`[data-vani-cf-field="${key}"]`);
    if (!input) return '';
    if (input.type === 'checkbox') return input.checked;
    return (input.value || '').trim();
  };

  const normalizeDigits = (s) => (s || '').replace(/\D/g, '');

  const validateScreen = (viewId) => {
    clearViewError(appScreen?.querySelector(`[data-app-view="${viewId}"]`));
    if (viewId === 'cf-mobile') {
      const mobile = normalizeDigits(getFieldValue(viewId, 'mobile'));
      if (!/^[6-9]\d{9}$/.test(mobile)) {
        showViewError(viewId, 'Enter a valid 10-digit demo mobile number (starts with 6–9).');
        return false;
      }
      demoState.mobile = mobile;
      return true;
    }
    if (viewId === 'cf-otp') {
      const otp = normalizeDigits(getFieldValue(viewId, 'otp'));
      if (otp !== DEMO_OTP) {
        showViewError(viewId, `Use the demo OTP ${DEMO_OTP}. No SMS is sent.`);
        return false;
      }
      return true;
    }
    if (viewId === 'cf-aadhaar') {
      const aadhaar = normalizeDigits(getFieldValue(viewId, 'aadhaar'));
      if (aadhaar !== DEMO_AADHAAR) {
        showViewError(viewId, 'For this demo only, enter 9999 8888 7777 (fictional — not a real Aadhaar).');
        return false;
      }
      return true;
    }
    if (viewId === 'cf-review') {
      if (!getFieldValue(viewId, 'reviewConfirm')) {
        showViewError(viewId, 'Please confirm the demo details to continue.');
        return false;
      }
      return true;
    }
    if (viewId === 'cf-personal') {
      const fullName = getFieldValue(viewId, 'fullName');
      const city = getFieldValue(viewId, 'city');
      if (!fullName || fullName.length < 2) {
        showViewError(viewId, 'Enter a demo full name (at least 2 characters).');
        return false;
      }
      if (!city || city.length < 2) {
        showViewError(viewId, 'Enter a demo city.');
        return false;
      }
      demoState.fullName = fullName;
      demoState.city = city;
      return true;
    }
    if (viewId === 'cf-work') {
      const occupation = getFieldValue(viewId, 'occupation');
      if (!occupation || occupation.length < 2) {
        showViewError(viewId, 'Enter an occupation for the demo work profile.');
        return false;
      }
      demoState.occupation = occupation;
      return true;
    }
    if (viewId === 'cf-photo') {
      if (!getFieldValue(viewId, 'photoOk')) {
        showViewError(viewId, 'Check the box to use the demo profile photo.');
        return false;
      }
      return true;
    }
    if (viewId === 'cf-submit') {
      if (!getFieldValue(viewId, 'submitAgree')) {
        showViewError(viewId, 'Please acknowledge this is a website demonstration.');
        return false;
      }
      return true;
    }
    return true;
  };

  const clearAutoplayTimer = () => {
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
  };

  const clearUidaiTimer = () => {
    if (uidaiTimer) {
      clearTimeout(uidaiTimer);
      uidaiTimer = null;
    }
  };

  const setAutoplayUI = (mode) => {
    autoplayPlaying = mode === 'playing';
    if (autoplayPlayBtn) autoplayPlayBtn.hidden = autoplayPlaying;
    if (autoplayPauseBtn) autoplayPauseBtn.hidden = !autoplayPlaying;
    if (autoplayStatus) {
      if (mode === 'playing') autoplayStatus.textContent = 'Auto-play running…';
      else if (mode === 'paused') autoplayStatus.textContent = 'Auto-play paused';
      else if (mode === 'done') autoplayStatus.textContent = 'Journey complete — Restart or pick a step';
      else autoplayStatus.textContent = 'Ready — select a step or auto-play';
    }
  };

  const stopAutoplay = (resetUi = true) => {
    clearAutoplayTimer();
    if (resetUi) setAutoplayUI('idle');
  };

  const pauseAutoplay = () => {
    clearAutoplayTimer();
    setAutoplayUI('paused');
  };

  const sidebarHighlightId = (viewId) =>
    viewId === 'cf-market-detail'
      ? 'cf-marketplace'
      : viewId === 'cf-event-detail'
        ? 'cf-events'
        : viewId === 'cf-announcement-detail'
          ? 'cf-announcements'
          : viewId;

  const prefillDemoForStep = (viewId) => {
    const viewEl = appScreen?.querySelector(`[data-app-view="${viewId}"]`);
    if (!viewEl) return;
    const setVal = (key, val) => {
      const input = viewEl.querySelector(`[data-vani-cf-field="${key}"]`);
      if (input && input.type !== 'checkbox') input.value = val;
    };
    const setCheck = (key, on) => {
      const input = viewEl.querySelector(`[data-vani-cf-field="${key}"]`);
      if (input?.type === 'checkbox') input.checked = on;
    };
    if (viewId === 'cf-mobile') setVal('mobile', '9876543210');
    if (viewId === 'cf-otp') setVal('otp', DEMO_OTP);
    if (viewId === 'cf-aadhaar') setVal('aadhaar', '9999 8888 7777');
    if (viewId === 'cf-review') setCheck('reviewConfirm', true);
    if (viewId === 'cf-personal') {
      setVal('fullName', 'Priya Sharma');
      setVal('city', 'Pune');
    }
    if (viewId === 'cf-work') setVal('occupation', 'Community volunteer');
    if (viewId === 'cf-photo') setCheck('photoOk', true);
    if (viewId === 'cf-submit') setCheck('submitAgree', true);
  };

  const resetDemoFormsAndState = () => {
    demoState.mobile = '';
    demoState.fullName = '';
    demoState.city = '';
    demoState.occupation = '';
    panel.querySelectorAll('[data-vani-cf-field]').forEach((input) => {
      if (input.type === 'checkbox') input.checked = false;
      else input.value = '';
    });
    panel.querySelectorAll('[data-vani-cf-pay-success], [data-vani-cf-vote-success]').forEach((el) => {
      el.hidden = true;
    });
    panel.querySelectorAll('[data-vani-cf-vote-demo]').forEach((b) => {
      b.disabled = false;
    });
    panel.querySelectorAll('[data-vani-cf-filter-root]').forEach((rootEl) => applyFilterChip(rootEl, 'all'));
    const profileRoot = panel.querySelector('[data-vani-cf-profile-root]');
    if (profileRoot) {
      profileRoot.querySelectorAll('[data-vani-cf-profile-tab]').forEach((tab, i) => tab.classList.toggle('is-on', i === 0));
      profileRoot.querySelectorAll('[data-vani-cf-profile-pane]').forEach((pane, i) => {
        const on = i === 0;
        pane.classList.toggle('is-on', on);
        if (on) pane.removeAttribute('hidden');
        else pane.setAttribute('hidden', '');
      });
    }
  };

  const restartJourney = () => {
    stopAutoplay();
    resetDemoFormsAndState();
    const first = screensForJourney(activeJourney)[0];
    if (first) showScreen(first.id, { keepJourney: true, skipTransition: reducedMotion });
  };

  const scheduleAutoplayAdvance = () => {
    clearAutoplayTimer();
    if (!autoplayPlaying) return;
    const list = screensForJourney(activeJourney);
    const idx = list.findIndex((s) => s.id === activeScreenId);
    if (idx < 0 || idx >= list.length - 1) {
      stopAutoplay();
      setAutoplayUI('done');
      return;
    }
    autoplayTimer = window.setTimeout(() => {
      if (!autoplayPlaying) return;
      const next = list[idx + 1];
      prefillDemoForStep(next.id);
      showScreen(next.id, { keepJourney: true, fromAutoplay: true });
      scheduleAutoplayAdvance();
    }, AUTOPLAY_STEP_MS);
  };

  const startAutoplay = () => {
    stopAutoplay(false);
    setAutoplayUI('playing');
    prefillDemoForStep(activeScreenId);
    scheduleAutoplayAdvance();
  };

  const runUidaiDemoFetch = () => {
    clearUidaiTimer();
    const viewEl = appScreen?.querySelector('[data-app-view="cf-uidai"]');
    if (!viewEl) return;
    const loading = viewEl.querySelector('[data-vani-cf-uidai-loading]');
    const done = viewEl.querySelector('[data-vani-cf-uidai-done]');
    if (loading) loading.hidden = false;
    if (done) done.hidden = true;
    uidaiTimer = window.setTimeout(() => {
      if (loading) loading.hidden = true;
      if (done) done.hidden = false;
      uidaiTimer = null;
    }, reducedMotion ? 200 : 900);
  };

  const syncReviewPanel = () => {
    const mobileEl = panel.querySelector('[data-vani-cf-review-mobile]');
    if (mobileEl) mobileEl.textContent = demoState.mobile ? `+91 ${demoState.mobile}` : '+91 demo';
    const nameEl = panel.querySelector('[data-vani-cf-review-name]');
    if (nameEl && demoState.fullName) nameEl.textContent = `${demoState.fullName} (demo)`;
  };

  const applyChrome = (viewId) => {
    const welcome = viewId === 'cf-onboarding';
    const inFlow = isOnboardingStep(viewId) && !welcome;
    deviceInner?.classList.toggle('vani-prod-cf-hide-chrome', welcome);
    deviceInner?.classList.toggle('vani-prod-cf-onboarding-flow', inFlow || welcome);
    if (deviceHeader) {
      if (welcome) deviceHeader.setAttribute('hidden', '');
      else deviceHeader.removeAttribute('hidden');
    }
    if (progressWrap) {
      if (isOnboardingStep(viewId) && viewId !== 'cf-onboarding') {
        progressWrap.removeAttribute('hidden');
        const idx = onboardingIndex(viewId);
        const pct = ((idx + 1) / ONBOARDING_FLOW.length) * 100;
        if (progressFill) progressFill.style.width = `${pct}%`;
        if (progressLabel) progressLabel.textContent = `Step ${idx + 1} of ${ONBOARDING_FLOW.length}`;
      } else {
        progressWrap.setAttribute('hidden', '');
      }
    }
    if (appNav) {
      if (MAIN_APP_IDS.has(viewId)) appNav.removeAttribute('hidden');
      else appNav.setAttribute('hidden', '');
    }
    if (appNav && MAIN_APP_IDS.has(viewId)) {
      const activeNav = bottomNavForView(viewId);
      appNav.querySelectorAll('[data-vani-cf-nav]').forEach((tab) => {
        const navId = tab.getAttribute('data-vani-cf-nav');
        tab.classList.toggle('is-on', navId === activeNav);
      });
    }
  };

  const applyFilterChip = (rootEl, chipKey) => {
    if (!rootEl) return;
    rootEl.querySelectorAll('[data-vani-cf-chip]').forEach((chip) => {
      chip.classList.toggle('is-on', chip.getAttribute('data-vani-cf-chip') === chipKey);
    });
    const searchVal = (rootEl.querySelector('[data-vani-cf-search]')?.value || '').trim().toLowerCase();
    rootEl.querySelectorAll('[data-vani-cf-filter-item]').forEach((item) => {
      const tags = (item.getAttribute('data-cf-tags') || '').split(/\s+/);
      const text = (item.getAttribute('data-cf-text') || item.textContent || '').toLowerCase();
      const tagOk = chipKey === 'all' || tags.includes(chipKey);
      const searchOk = !searchVal || text.includes(searchVal);
      item.hidden = !(tagOk && searchOk);
    });
  };

  const bindMainAppInteractions = () => {
    panel.querySelectorAll('[data-vani-cf-goto]').forEach((el) => {
      bind(el, 'click', () => {
        pauseAutoplay();
        const target = el.getAttribute('data-vani-cf-goto');
        if (target) {
          activeJourney = 'main';
          showScreen(target, { keepJourney: true });
        }
      });
    });

    panel.querySelectorAll('[data-vani-cf-open]').forEach((el) => {
      bind(el, 'click', () => {
        pauseAutoplay();
        const target = el.getAttribute('data-vani-cf-open');
        if (target) showScreen(target);
      });
    });

    panel.querySelectorAll('[data-vani-cf-back]').forEach((el) => {
      bind(el, 'click', () => {
        pauseAutoplay();
        const target = el.getAttribute('data-vani-cf-back');
        if (target) showScreen(target);
      });
    });

    panel.querySelectorAll('[data-vani-cf-filter-root]').forEach((rootEl) => {
      rootEl.querySelectorAll('[data-vani-cf-chip]').forEach((chip) => {
        bind(chip, 'click', () => {
          applyFilterChip(rootEl, chip.getAttribute('data-vani-cf-chip') || 'all');
        });
      });
      bind(rootEl.querySelector('[data-vani-cf-search]'), 'input', () => {
        const active = rootEl.querySelector('[data-vani-cf-chip].is-on');
        applyFilterChip(rootEl, active?.getAttribute('data-vani-cf-chip') || 'all');
      });
    });

    const profileRoot = panel.querySelector('[data-vani-cf-profile-root]');
    if (profileRoot) {
      profileRoot.querySelectorAll('[data-vani-cf-profile-tab]').forEach((tab) => {
        bind(tab, 'click', () => {
          const key = tab.getAttribute('data-vani-cf-profile-tab');
          profileRoot.querySelectorAll('[data-vani-cf-profile-tab]').forEach((t) => t.classList.toggle('is-on', t === tab));
          profileRoot.querySelectorAll('[data-vani-cf-profile-pane]').forEach((pane) => {
            const on = pane.getAttribute('data-vani-cf-profile-pane') === key;
            pane.classList.toggle('is-on', on);
            if (on) pane.removeAttribute('hidden');
            else pane.setAttribute('hidden', '');
          });
        });
      });
    }

    bind(panel.querySelector('[data-vani-cf-pay-demo]'), 'click', () => {
      const view = appScreen?.querySelector('[data-app-view="cf-bill-pay"]');
      const ok = view?.querySelector('[data-vani-cf-pay-success]');
      if (ok) ok.hidden = false;
    });

    panel.querySelectorAll('[data-vani-cf-vote-demo]').forEach((btn) => {
      bind(btn, 'click', () => {
        const view = appScreen?.querySelector('[data-app-view="cf-e-voting"]');
        const ok = view?.querySelector('[data-vani-cf-vote-success]');
        if (ok) ok.hidden = false;
        panel.querySelectorAll('[data-vani-cf-vote-demo]').forEach((b) => {
          b.disabled = true;
        });
      });
    });
  };

  const showScreen = (viewId, opts = {}) => {
    const meta = SCREENS.find((s) => s.id === viewId);
    if (!meta) return;
    if (!opts.fromAutoplay && !opts.skipTransition) pauseAutoplay();
    activeScreenId = viewId;
    if (meta.journey !== activeJourney && !opts.keepJourney) {
      activeJourney = meta.journey;
      panel.querySelectorAll('[data-vani-cf-journey]').forEach((tab) => {
        const on = tab.getAttribute('data-vani-cf-journey') === activeJourney;
        tab.classList.toggle('is-active', on);
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.tabIndex = on ? 0 : -1;
      });
      renderScreenList();
    }
    let activeViewEl = null;
    appScreen?.querySelectorAll('.vani-prod-cf-view').forEach((view) => {
      const on = view.getAttribute('data-app-view') === viewId;
      view.classList.toggle('is-active-view', on);
      if (on) {
        view.removeAttribute('hidden');
        clearViewError(view);
        activeViewEl = view;
      } else view.setAttribute('hidden', '');
    });
    if (activeViewEl && !opts.skipTransition && !reducedMotion) {
      activeViewEl.classList.remove('vani-prod-cf-view-animate');
      void activeViewEl.offsetWidth;
      activeViewEl.classList.add('vani-prod-cf-view-animate');
    }
    if (phoneStage && !reducedMotion) {
      phoneStage.classList.remove('vani-prod-cf-phone-pulse');
      void phoneStage.offsetWidth;
      phoneStage.classList.add('vani-prod-cf-phone-pulse');
    }
    applyChrome(viewId);
    if (viewId === 'cf-uidai') runUidaiDemoFetch();
    if (viewId === 'cf-review') syncReviewPanel();
    const sidebarId = sidebarHighlightId(viewId);
    panel.querySelectorAll('.vani-prod-cf-screen-item').forEach((btn) => {
      const on = btn.getAttribute('data-vani-cf-screen') === sidebarId;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    const activeStepBtn = panel.querySelector(`.vani-prod-cf-screen-item[data-vani-cf-screen="${sidebarId}"]`);
    if (activeStepBtn) {
      const list = activeStepBtn.closest('.vani-prod-cf-screens-list');
      if (list && list.scrollHeight > list.clientHeight + 1) {
        const itemTop = activeStepBtn.offsetTop;
        const itemBottom = itemTop + activeStepBtn.offsetHeight;
        const viewTop = list.scrollTop;
        const viewBottom = viewTop + list.clientHeight;
        if (itemTop < viewTop) list.scrollTop = itemTop;
        else if (itemBottom > viewBottom) list.scrollTop = itemBottom - list.clientHeight;
      }
    }
    if (screenNow) screenNow.textContent = `${meta.label} — ${meta.desc}`;
    if (caption) caption.textContent = meta.caption;
    syncNavButtons();
    syncScreenListTabIndex();
  };

  const getScreenListItems = () => [...panel.querySelectorAll('.vani-prod-cf-screen-item')];

  const syncScreenListTabIndex = () => {
    const items = getScreenListItems();
    if (!items.length) return;
    let focusIdx = items.findIndex((btn) => btn.classList.contains('is-active'));
    if (focusIdx < 0) focusIdx = 0;
    items.forEach((btn, i) => {
      btn.tabIndex = i === focusIdx ? 0 : -1;
    });
  };

  const focusScreenListItem = (index) => {
    const items = getScreenListItems();
    if (!items.length) return;
    const i = ((index % items.length) + items.length) % items.length;
    items.forEach((btn, j) => {
      btn.tabIndex = j === i ? 0 : -1;
    });
    items[i]?.focus();
  };

  const renderScreenList = () => {
    if (!screenList) return;
    screenList.innerHTML = '';
    screensForJourney(activeJourney).forEach((meta) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'vani-prod-cf-screen-item';
      btn.setAttribute('data-vani-cf-screen', meta.id);
      btn.setAttribute('role', 'option');
      btn.innerHTML = `<span class="vani-prod-cf-screen-item-icon" aria-hidden="true"><i class="fa-solid ${meta.icon}"></i></span><span><strong>${meta.label}</strong><span class="vani-prod-cf-screen-desc">${meta.desc}</span></span>`;
      if (meta.id === sidebarHighlightId(activeScreenId)) {
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
      }
      bind(btn, 'click', () => {
        pauseAutoplay();
        if (meta.journey === 'main') activeJourney = 'main';
        showScreen(meta.id, { keepJourney: true });
      });
      li.appendChild(btn);
      screenList.appendChild(li);
    });
    syncScreenListTabIndex();
  };

  bind(screenList, 'keydown', (e) => {
    const items = getScreenListItems();
    if (!items.length) return;
    const current = items.findIndex((btn) => btn.tabIndex === 0);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusScreenListItem(current + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusScreenListItem(current - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusScreenListItem(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusScreenListItem(items.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      const focused = document.activeElement;
      if (focused?.classList?.contains('vani-prod-cf-screen-item')) {
        e.preventDefault();
        focused.click();
      }
    }
  });

  const journeyTabs = [...panel.querySelectorAll('[data-vani-cf-journey]')];
  journeyTabs.forEach((tab, idx) => {
    bind(tab, 'keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const next = e.key === 'ArrowRight' ? (idx + 1) % journeyTabs.length : (idx - 1 + journeyTabs.length) % journeyTabs.length;
      journeyTabs[next]?.focus();
      journeyTabs[next]?.click();
    });
  });

  const stepScreen = (delta, opts = {}) => {
    const list = screensForJourney(activeJourney);
    const idx = list.findIndex((s) => s.id === activeScreenId);
    if (delta > 0 && !opts.skipValidate && activeJourney === 'onboarding') {
      if (!validateScreen(activeScreenId)) return;
    }
    const next = list[Math.max(0, Math.min(list.length - 1, idx + delta))];
    if (next) showScreen(next.id);
  };

  const goToWelcome = () => {
    activeJourney = 'onboarding';
    panel.querySelectorAll('[data-vani-cf-journey]').forEach((t) => {
      const on = t.getAttribute('data-vani-cf-journey') === 'onboarding';
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    renderScreenList();
    showScreen('cf-onboarding', { keepJourney: true });
  };

  const syncNavButtons = () => {
    const list = screensForJourney(activeJourney);
    const idx = list.findIndex((s) => s.id === activeScreenId);
    const prev = panel.querySelector('[data-vani-cf-screen-prev]');
    const next = panel.querySelector('[data-vani-cf-screen-next]');
    if (prev) prev.disabled = idx <= 0;
    if (next) next.disabled = idx >= list.length - 1;
  };

  panel.querySelectorAll('[data-vani-cf-journey]').forEach((tab) => {
    bind(tab, 'click', () => {
      const journey = tab.getAttribute('data-vani-cf-journey');
      if (!journey || journey === activeJourney) return;
      stopAutoplay();
      activeJourney = journey;
      panel.querySelectorAll('[data-vani-cf-journey]').forEach((t) => {
        const on = t.getAttribute('data-vani-cf-journey') === journey;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      renderScreenList();
      const first = screensForJourney(journey)[0];
      if (first) showScreen(first.id, { keepJourney: true, skipTransition: reducedMotion });
    });
  });

  bind(panel.querySelector('[data-vani-cf-screen-prev]'), 'click', () => {
    pauseAutoplay();
    stepScreen(-1, { skipValidate: true });
  });
  bind(panel.querySelector('[data-vani-cf-screen-next]'), 'click', () => {
    pauseAutoplay();
    stepScreen(1);
  });

  bind(autoplayPlayBtn, 'click', () => startAutoplay());
  bind(autoplayPauseBtn, 'click', () => pauseAutoplay());
  bind(panel.querySelector('[data-vani-cf-restart]'), 'click', () => restartJourney());

  panel.querySelectorAll('[data-vani-cf-step-back]').forEach((btn) => {
    bind(btn, 'click', () => {
      pauseAutoplay();
      stepScreen(-1, { skipValidate: true });
    });
  });
  panel.querySelectorAll('[data-vani-cf-step-continue]').forEach((btn) => {
    bind(btn, 'click', () => {
      pauseAutoplay();
      stepScreen(1);
    });
  });
  panel.querySelectorAll('[data-vani-cf-to-welcome]').forEach((btn) => {
    bind(btn, 'click', () => {
      pauseAutoplay();
      goToWelcome();
    });
  });

  bind(panel.querySelector('[data-vani-cf-action="get-started"]'), 'click', () => {
    activeJourney = 'onboarding';
    panel.querySelectorAll('[data-vani-cf-journey]').forEach((t) => {
      const on = t.getAttribute('data-vani-cf-journey') === 'onboarding';
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    renderScreenList();
    showScreen('cf-mobile', { keepJourney: true });
  });

  bind(panel.querySelector('[data-vani-cf-action="open-main"]'), 'click', () => {
    activeJourney = 'main';
    panel.querySelectorAll('[data-vani-cf-journey]').forEach((t) => {
      const on = t.getAttribute('data-vani-cf-journey') === 'main';
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    renderScreenList();
    showScreen('cf-dashboard', { keepJourney: true });
  });

  bind(panel.querySelector('[data-vani-cf-action="sign-in"]'), 'click', () => {
    activeJourney = 'main';
    panel.querySelectorAll('[data-vani-cf-journey]').forEach((t) => {
      const on = t.getAttribute('data-vani-cf-journey') === 'main';
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    renderScreenList();
    showScreen('cf-dashboard', { keepJourney: true });
  });

  appNav?.querySelectorAll('[data-vani-cf-nav]').forEach((tab) => {
    bind(tab, 'click', () => {
      pauseAutoplay();
      const viewId = tab.getAttribute('data-vani-cf-nav');
      if (viewId) {
        activeJourney = 'main';
        showScreen(viewId, { keepJourney: true });
      }
    });
  });

  bindMainAppInteractions();

  const swipeZone = panel.querySelector('[data-vani-cf-swipe]');
  if (swipeZone) {
    let startX = 0;
    bind(
      swipeZone,
      'touchstart',
      (e) => {
        startX = e.changedTouches[0]?.clientX || 0;
      },
      { passive: true }
    );
    bind(
      swipeZone,
      'touchend',
      (e) => {
        const dx = (e.changedTouches[0]?.clientX || 0) - startX;
        if (Math.abs(dx) < 48) return;
        pauseAutoplay();
        if (dx < 0) stepScreen(1);
        else stepScreen(-1, { skipValidate: true });
      },
      { passive: true }
    );
  }

  panel._vaniCfAbort = () => {
    stopAutoplay();
    clearUidaiTimer();
    ac.abort();
    delete panel.dataset.vaniCfInit;
    panel._vaniCfAbort = null;
  };
  panel.dataset.vaniCfInit = '1';

  renderScreenList();
  showScreen('cf-onboarding', { keepJourney: true, skipTransition: true });
  setAutoplayUI('idle');

  return {
    isInteractive: true,
    showScreen,
    destroy: () => panel._vaniCfAbort?.(),
    onPanelPlay() {
      showScreen(activeScreenId || 'cf-onboarding', { keepJourney: true, skipTransition: reducedMotion });
    },
  };
}

/**
 * TravelJioo — automatic phone overview (#vani-prod-panel-traveljioo only)
 */
function initTravelJiooAutoDemo(productsRoot) {
  const panel = productsRoot.querySelector('[data-vani-prod-panel="traveljioo"]');
  if (!panel?.hasAttribute('data-vani-travel-auto-demo')) return null;

  if (typeof panel._vaniTjAbort === 'function') panel._vaniTjAbort();

  let stepTimer = null;
  let animTimers = [];
  let stepIndex = 0;
  let panelVisible = false;
  let tabVisible = typeof document.hidden === 'boolean' ? !document.hidden : true;
  let revealReady = false;
  let panelIo = null;
  let reducedMotion = false;
  try {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (err) {}
  const STEP_MS = reducedMotion ? 1400 : 3200;

  const ac = new AbortController();
  const sig = ac.signal;
  const bind = (node, type, handler, opts = {}) => {
    if (!node) return;
    node.addEventListener(type, handler, { ...opts, signal: sig });
  };

  const appScreen = panel.querySelector('[data-vani-app="traveljioo"]');
  const stepLabel = panel.querySelector('[data-vani-tj-step-label]');
  const caption = productsRoot.querySelector('[data-vani-demo-caption="traveljioo"]');
  const autoNow = panel.querySelector('[data-vani-travel-auto-now]');
  const progressEl = panel.querySelector('[data-vani-tj-progress]');
  const dotsHost = panel.querySelector('[data-vani-tj-dots]');
  const ecoCards = [...panel.querySelectorAll('[data-vani-travel-sync]')];
  const flowRail = panel.querySelector('[data-vani-flow-rail="traveljioo"]');
  const storyRail = panel.querySelector('.vani-prod-travel-copy [data-story-phase]')
    ? panel.querySelector('.vani-prod-travel-copy .vani-prod-story-rail')
    : panel.querySelector('.vani-prod-copy .vani-prod-story-rail');

  const STEPS = [
    {
      view: 'tj-overview',
      sync: null,
      label: 'Overview dashboard',
      caption: 'TravelJioo overview — pipeline & module tiles (demo)',
      story: 'input',
      flow: 'input',
    },
    {
      view: 'tj-crm',
      sync: 'analytics',
      label: 'CRM enquiries',
      caption: 'Travel CRM — sample enquiry on deal pipeline',
      story: 'input',
      flow: 'input',
    },
    {
      view: 'tj-flight',
      sync: 'flight',
      label: 'Flight summary',
      caption: 'Flight legs added to quote — illustrative search only',
      story: 'action',
      flow: 'action',
    },
    {
      view: 'tj-hotel',
      sync: 'hotel',
      label: 'Hotel summary',
      caption: 'Hotel stays on package — sample lines, not live inventory',
      story: 'action',
      flow: 'action',
    },
    {
      view: 'tj-package',
      sync: 'package',
      label: 'Package builder',
      caption: 'Dynamic package & PDF itinerary preview (demo)',
      story: 'action',
      flow: 'action',
    },
    {
      view: 'tj-group',
      sync: 'group',
      label: 'Group travel',
      caption: 'Group dossier — simulated passenger context',
      story: 'action',
      flow: 'action',
    },
    {
      view: 'tj-email',
      sync: 'integrations',
      label: 'Follow-ups',
      caption: 'Follow-up task completes — no email sent from site',
      story: 'action',
      flow: 'action',
    },
    {
      view: 'tj-analytics',
      sync: 'analytics',
      label: 'Analytics',
      caption: 'Commission & revenue snapshot — demo metrics',
      story: 'result',
      flow: 'result',
    },
    {
      view: 'tj-integrations',
      sync: 'integrations',
      label: 'Integrations',
      caption: 'REST exports & RBAC — enable on your deployment',
      story: 'result',
      flow: 'result',
    },
  ];

  if (dotsHost) {
    dotsHost.innerHTML = '';
    STEPS.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'vani-prod-tj-dot';
      dotsHost.appendChild(dot);
    });
  }

  const setStoryPhases = (phase) => {
    panel.querySelectorAll('[data-story-phase]').forEach((chip) => {
      chip.classList.toggle('is-active', chip.getAttribute('data-story-phase') === phase);
    });
    flowRail?.querySelectorAll('[data-flow]').forEach((chip) => {
      chip.classList.toggle('is-active', chip.getAttribute('data-flow') === phase);
    });
  };

  const syncEcoHighlight = (syncKey) => {
    ecoCards.forEach((card) => {
      const on = syncKey && card.getAttribute('data-vani-travel-sync') === syncKey;
      card.classList.toggle('is-demo-active', on);
      card.classList.toggle('is-demo-pulse', on && !reducedMotion);
      if (on) card.setAttribute('aria-current', 'step');
      else card.removeAttribute('aria-current');
    });
  };

  const clearAnimTimers = () => {
    animTimers.forEach((id) => window.clearTimeout(id));
    animTimers = [];
  };

  const deferAnim = (fn, ms) => {
    const id = window.setTimeout(fn, ms);
    animTimers.push(id);
    return id;
  };

  const resetViewAnimations = () => {
    appScreen?.querySelectorAll('[data-vani-tj-anim]').forEach((el) => {
      el.classList.remove('is-tj-visible', 'is-tj-highlight');
    });
    appScreen?.querySelectorAll('[data-vani-tj-bar]').forEach((bar) => {
      bar.classList.remove('is-tj-visible');
    });
    appScreen?.querySelectorAll('[data-vani-tj-status]').forEach((status) => {
      status.classList.remove('is-tj-status-complete');
      const draft = status.querySelector('.is-draft');
      const complete = status.querySelector('.is-complete');
      if (draft) draft.hidden = false;
      if (complete) complete.hidden = true;
    });
    appScreen?.querySelectorAll('[data-vani-tj-pipeline] [data-tj-pipe]').forEach((pipe) => {
      pipe.classList.remove('is-active', 'is-done');
    });
    appScreen?.querySelectorAll('[data-vani-tj-flight-search]').forEach((el) => {
      el.hidden = false;
      el.classList.remove('is-tj-visible');
    });
    appScreen?.querySelectorAll('[data-vani-tj-group-summary]').forEach((el) => {
      el.hidden = true;
      el.classList.remove('is-tj-visible');
    });
    appScreen?.querySelectorAll('[data-vani-tj-hotel-highlight]').forEach((el) => {
      el.classList.remove('is-tj-highlight');
    });
    appScreen?.querySelectorAll('.vani-prod-tj-view').forEach((view) => {
      view.classList.remove('is-tj-enter');
    });
  };

  const revealAnimElements = (viewEl, staggerMs = 120) => {
    const items = [...viewEl.querySelectorAll('[data-vani-tj-anim]')];
    if (reducedMotion) {
      items.forEach((el) => el.classList.add('is-tj-visible'));
      return;
    }
    items.forEach((el, i) => {
      deferAnim(() => {
        if (!el.isConnected) return;
        el.classList.add('is-tj-visible');
      }, i * staggerMs);
    });
  };

  const animateStatusDraftToComplete = (viewEl, delayMs = 700) => {
    const status = viewEl.querySelector('[data-vani-tj-status]');
    if (!status) return;
    const draft = status.querySelector('.is-draft');
    const complete = status.querySelector('.is-complete');
    if (reducedMotion) {
      if (draft) draft.hidden = true;
      if (complete) complete.hidden = false;
      status.classList.add('is-tj-status-complete');
      return;
    }
    deferAnim(() => {
      if (!status.isConnected) return;
      if (draft) draft.hidden = true;
      if (complete) complete.hidden = false;
      status.classList.add('is-tj-status-complete');
    }, delayMs);
  };

  const animatePipelineStages = (viewEl) => {
    const pipes = [...viewEl.querySelectorAll('[data-vani-tj-pipeline] [data-tj-pipe]')];
    if (!pipes.length) return;
    const stepMs = reducedMotion ? 0 : 450;
    pipes.forEach((pipe, idx) => {
      deferAnim(() => {
        if (!pipe.isConnected) return;
        pipes.forEach((p, j) => {
          p.classList.toggle('is-done', j < idx);
          p.classList.toggle('is-active', j === idx);
        });
      }, idx * stepMs);
    });
  };

  const animateOverviewKpis = (viewEl) => {
    viewEl.querySelectorAll('[data-vani-tj-count]').forEach((el) => {
      const raw = el.getAttribute('data-vani-tj-count') || '';
      if (raw.includes('.')) {
        el.textContent = reducedMotion ? `₹${raw}L` : '₹0L';
        if (!reducedMotion) {
          deferAnim(() => {
            if (el.isConnected) el.textContent = `₹${raw}L`;
          }, 500);
        }
      } else {
        el.textContent = reducedMotion ? raw : '0';
        if (!reducedMotion) {
          deferAnim(() => {
            if (el.isConnected) el.textContent = raw;
          }, 500);
        }
      }
    });
  };

  const runViewAnimations = (viewId, viewEl) => {
    if (!viewEl) return;
    viewEl.classList.add('is-tj-enter');
    const deferInitialReveal = viewId === 'tj-flight' && !reducedMotion;
    if (!deferInitialReveal) {
      revealAnimElements(viewEl, reducedMotion ? 0 : 110);
    }

    switch (viewId) {
      case 'tj-overview':
        animateOverviewKpis(viewEl);
        animateStatusDraftToComplete(viewEl, reducedMotion ? 0 : 900);
        break;
      case 'tj-crm':
        animatePipelineStages(viewEl);
        animateStatusDraftToComplete(viewEl, reducedMotion ? 0 : 1100);
        break;
      case 'tj-flight': {
        const search = viewEl.querySelector('[data-vani-tj-flight-search]');
        if (search && !reducedMotion) {
          search.hidden = false;
          deferAnim(() => {
            if (!search.isConnected) return;
            search.classList.add('is-tj-visible');
            deferAnim(() => {
              search.hidden = true;
              revealAnimElements(viewEl, 140);
            }, 650);
          }, 200);
        } else {
          if (search) search.hidden = true;
          revealAnimElements(viewEl, 0);
        }
        break;
      }
      case 'tj-hotel':
        deferAnim(() => {
          const pick = viewEl.querySelector('[data-vani-tj-hotel-highlight]');
          if (pick?.isConnected) pick.classList.add('is-tj-highlight');
        }, reducedMotion ? 0 : 750);
        break;
      case 'tj-package':
        animateStatusDraftToComplete(viewEl, reducedMotion ? 0 : 950);
        break;
      case 'tj-group':
        deferAnim(() => {
          const banner = viewEl.querySelector('[data-vani-tj-group-summary]');
          if (!banner) return;
          banner.hidden = false;
          banner.classList.add('is-tj-visible');
        }, reducedMotion ? 0 : 800);
        break;
      case 'tj-email':
        break;
      case 'tj-analytics': {
        const bars = [...viewEl.querySelectorAll('[data-vani-tj-bar]')];
        if (reducedMotion) {
          bars.forEach((b) => b.classList.add('is-tj-visible'));
        } else {
          bars.forEach((bar, i) => {
            deferAnim(() => {
              if (bar.isConnected) bar.classList.add('is-tj-visible');
            }, 400 + i * 120);
          });
        }
        break;
      }
      case 'tj-integrations':
        animateStatusDraftToComplete(viewEl, reducedMotion ? 0 : 850);
        break;
      default:
        break;
    }
  };

  const showStepResult = (viewEl, delayMs = 0) => {
    const result = viewEl?.querySelector('.vani-prod-tj-result');
    if (!result) return;
    const reveal = () => {
      if (!result.isConnected) return;
      result.classList.add('is-show');
    };
    if (delayMs <= 0 || reducedMotion) reveal();
    else deferAnim(reveal, delayMs);
  };

  const syncProgress = (index) => {
    if (progressEl) {
      progressEl.style.setProperty('--vani-tj-progress', `${((index + 1) / STEPS.length) * 100}%`);
    }
    dotsHost?.querySelectorAll('.vani-prod-tj-dot').forEach((dot, i) => {
      dot.classList.toggle('is-on', i === index);
    });
  };

  const showStep = (index) => {
    const step = STEPS[index];
    if (!step || !appScreen) return;
    stepIndex = index;
    clearAnimTimers();
    resetViewAnimations();

    appScreen.querySelectorAll('.vani-prod-tj-result').forEach((el) => {
      el.classList.remove('is-show');
    });

    appScreen.querySelectorAll('.vani-prod-tj-view').forEach((view) => {
      const on = view.getAttribute('data-app-view') === step.view;
      view.classList.toggle('is-active-view', on);
      if (on) view.removeAttribute('hidden');
      else view.setAttribute('hidden', '');
    });

    const activeView = appScreen.querySelector(`[data-app-view="${step.view}"]`);
    runViewAnimations(step.view, activeView);

    const emailView = appScreen.querySelector('[data-app-view="tj-email"]');
    if (emailView) {
      const due = emailView.querySelector('.is-due');
      const done = emailView.querySelector('[data-vani-tj-mail-done]');
      if (step.view === 'tj-email') {
        if (due) {
          due.hidden = false;
          due.classList.add('is-tj-visible');
        }
        if (done) done.hidden = true;
        deferAnim(() => {
          if (stepIndex !== index || STEPS[index]?.view !== 'tj-email') return;
          if (due) due.hidden = true;
          if (done) {
            done.hidden = false;
            done.classList.add('is-tj-visible');
          }
        }, reducedMotion ? 400 : 900);
        showStepResult(activeView, reducedMotion ? 0 : 1000);
      } else {
        if (due) due.hidden = false;
        if (done) done.hidden = true;
      }
    }

    const resultDelay =
      step.view === 'tj-flight'
        ? reducedMotion
          ? 0
          : 1100
        : step.view === 'tj-package' || step.view === 'tj-integrations'
          ? reducedMotion
            ? 0
            : 1000
          : step.view === 'tj-analytics'
            ? reducedMotion
              ? 0
              : 950
            : reducedMotion
              ? 0
              : 650;
    if (step.view !== 'tj-email') showStepResult(activeView, resultDelay);

    if (stepLabel) stepLabel.textContent = step.label;
    if (caption) caption.textContent = step.caption;
    if (autoNow) autoNow.textContent = step.caption;
    setStoryPhases(step.story);
    flowRail?.querySelectorAll('[data-flow]').forEach((chip) => {
      chip.classList.toggle('is-active', chip.getAttribute('data-flow') === step.flow);
    });
    syncEcoHighlight(step.sync);
    syncProgress(index);
  };

  const clearStepTimer = () => {
    if (stepTimer) {
      window.clearTimeout(stepTimer);
      stepTimer = null;
    }
  };

  const scheduleNext = () => {
    clearStepTimer();
    stepTimer = window.setTimeout(() => {
      stepTimer = null;
      const next = (stepIndex + 1) % STEPS.length;
      showStep(next);
      if (shouldPlay()) scheduleNext();
    }, STEP_MS);
  };

  const shouldPlay = () => panelVisible && tabVisible && revealReady;

  const startLoop = () => {
    if (!shouldPlay()) return;
    clearStepTimer();
    showStep(stepIndex);
    scheduleNext();
  };

  const stopLoop = () => {
    clearStepTimer();
    clearAnimTimers();
  };

  const syncPlayback = () => {
    if (shouldPlay()) startLoop();
    else stopLoop();
  };

  bind(document, 'visibilitychange', () => {
    tabVisible = !document.hidden;
    syncPlayback();
  });

  if ('IntersectionObserver' in window) {
    panelIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          panelVisible = entry.isIntersecting && entry.intersectionRatio >= 0.2;
          syncPlayback();
        });
      },
      { threshold: [0, 0.15, 0.2, 0.35], rootMargin: '0px 0px -6% 0px' }
    );
    panelIo.observe(panel);
  } else {
    panelVisible = true;
  }

  panel._vaniTjAbort = () => {
    stopLoop();
    clearAnimTimers();
    panelIo?.disconnect();
    panelIo = null;
    ac.abort();
    resetViewAnimations();
    syncEcoHighlight(null);
    ecoCards.forEach((card) => card.classList.remove('is-demo-pulse'));
    delete panel.dataset.vaniTjInit;
    panel._vaniTjAbort = null;
  };
  panel.dataset.vaniTjInit = '1';

  showStep(0);

  return {
    isAutoDemo: true,
    onRevealComplete() {
      revealReady = true;
      syncPlayback();
    },
    onPanelPlay() {
      revealReady = true;
      syncPlayback();
    },
    destroy: () => panel._vaniTjAbort?.(),
  };
}

/**
 * AI Talksy — interactive preview + how-it-works (simulated only, no real APIs)
 */
function initAitalksyInteractivePreview(productsRoot) {
  const panel = productsRoot.querySelector('[data-vani-prod-panel="aitalksy"]');
  const block = panel?.querySelector('[data-vani-aitalksy-hiw]');
  if (!panel) return null;

  let reducedMotion = false;
  try {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (err) {}

  const hasGsap = typeof gsap !== 'undefined' && !reducedMotion;
  const steps = block ? [...block.querySelectorAll('[data-vani-hiw-step]')] : [];
  const scenes = block ? [...block.querySelectorAll('[data-vani-hiw-scene]')] : [];
  const replayBtn = block?.querySelector('[data-vani-hiw-replay]');
  const hiwProgress = block?.querySelector('[data-vani-hiw-progress]');
  const hiwComplete = block?.querySelector('[data-vani-hiw-complete]');
  const hiwPreview = block?.querySelector('[data-vani-hiw-preview]');
  const campaignPreview = block?.querySelector('[data-vani-hiw-campaign-preview]');
  const connectBtn = block?.querySelector('[data-vani-hiw-connect]');
  const status1 = block?.querySelector('[data-vani-hiw-status-1]');
  const contacts = block ? [...block.querySelectorAll('[data-vani-hiw-contact]')] : [];
  const importFoot = block?.querySelector('[data-vani-hiw-import-count]');
  const templateEl = block?.querySelector('[data-vani-hiw-template]');
  const botReady = block?.querySelector('[data-vani-hiw-bot-ready]');
  const resultEl = block?.querySelector('[data-vani-hiw-result]');
  const metricSpec = [
    { key: 'deliver', pct: 92, label: '92% (demo)' },
    { key: 'read', pct: 68, label: '68% (demo)' },
    { key: 'reply', pct: 41, label: '41% (demo)' },
  ];

  let tabActive = true;
  let demoCtrl = null;
  let activeFeatureKey = 'bulk';
  let phoneMode = 'feature';
  let featureReplayTimer = null;

  const FEATURE_ORDER = ['bulk', 'chatbot', 'analytics', 'autoreply', 'secure', 'integrate'];

  const FEATURE_META = {
    bulk: {
      viewId: 'feat-bulk',
      hiwStep: 3,
      caption: 'Bulk messaging — queue a demo campaign (no messages sent)',
      sync: 'Bulk messaging · demo preview',
      storyNow: 'Bulk Messaging — compose audience & template in the web app',
      float: {
        input: ['Audience', '248 demo contacts selected'],
        action: ['Template', 'Flash sale message staged'],
        result: ['Queue', 'Send simulated only'],
        orbitStatus: 'Campaign staging',
        orbitToast: 'No production sends',
      },
    },
    chatbot: {
      viewId: 'feat-chatbot',
      hiwStep: 3,
      caption: 'AI chatbot — simulated OpenAI conversation on web chat',
      sync: 'AI chatbot · demo conversation',
      storyNow: 'AI Chatbot — intent detection & reply generation (demo)',
      float: {
        input: ['Visitor', 'Shipping question (demo)'],
        action: ['AI', 'OpenAI / Gemini routing'],
        result: ['Reply', 'Answer with CRM tag'],
        orbitStatus: 'Bot responding',
        orbitToast: 'Sample transcript only',
      },
    },
    analytics: {
      viewId: 'feat-analytics',
      hiwStep: 4,
      caption: 'Analytics dashboard — illustrative delivery & read rates',
      sync: 'Analytics · dashboard preview',
      storyNow: 'Analytics Dashboard — demo KPIs & engagement bars',
      float: {
        input: ['Campaign', 'Demo broadcast ID'],
        action: ['Metrics', 'Delivery & read rates'],
        result: ['Insight', '41% demo reply rate'],
        orbitStatus: 'Dashboard loaded',
        orbitToast: 'Not live production data',
      },
    },
    autoreply: {
      viewId: 'feat-autoreply',
      hiwStep: 3,
      caption: 'Auto replies — keyword rule fires on incoming demo message',
      sync: 'Auto replies · keyword rule',
      storyNow: 'Auto Replies — hours keyword triggers canned response',
      float: {
        input: ['Keyword', '“hours” in message'],
        action: ['Rule', 'Match & compose reply'],
        result: ['Sent', 'Auto reply logged (demo)'],
        orbitStatus: 'Rule matched',
        orbitToast: 'Workflow simulated',
      },
    },
    secure: {
      viewId: 'feat-secure',
      hiwStep: 1,
      caption: 'Secure & compliant — encryption and opt-out handling overview',
      sync: 'Security · compliance center',
      storyNow: 'Secure and Compliant — TLS, opt-out & sandbox workspace',
      float: {
        input: ['Policy', 'Opt-out & encryption'],
        action: ['Review', 'Compliance checklist'],
        result: ['OK', 'Sandbox-only demo'],
        orbitStatus: 'Controls visible',
        orbitToast: 'No account changes',
      },
    },
    integrate: {
      viewId: 'feat-integrate',
      hiwStep: 1,
      caption: 'Integrations — verified connections available in AI Talksy',
      sync: 'Integrations · connection hub',
      storyNow: 'Easy Integration — WhatsApp, Slack, web chat & APIs',
      float: {
        input: ['Channels', 'Omnichannel inbox'],
        action: ['Link', 'OAuth / webhooks (demo)'],
        result: ['Ready', 'Tap a logo to preview'],
        orbitStatus: 'Connections hub',
        orbitToast: 'Representative setup',
      },
    },
  };

  const INTEGRATION_META = {
    whatsapp: {
      title: 'WhatsApp',
      icon: 'fa-brands fa-whatsapp',
      status: 'Status: Connected (sandbox) · no messages sent',
      foot: 'WhatsApp Business link is simulated in this preview.',
    },
    openai: {
      title: 'OpenAI',
      icon: 'fa-solid fa-brain',
      status: 'Status: API key configured (demo workspace)',
      foot: 'Model routing shown for illustration — no API calls made.',
    },
    gemini: {
      title: 'Google Gemini',
      icon: 'fa-solid fa-wand-magic-sparkles',
      status: 'Status: Alternate LLM route available (demo)',
      foot: 'Gemini path is representative; not invoked on this site.',
    },
    slack: {
      title: 'Slack',
      icon: 'fa-brands fa-slack',
      status: 'Status: Workspace webhook ready (demo)',
      foot: 'Slack notifications are simulated only.',
    },
    webchat: {
      title: 'Web chat',
      icon: 'fa-solid fa-window-maximize',
      status: 'Status: Embed snippet generated (demo)',
      foot: 'Copy-paste widget preview — not deployed from here.',
    },
    webhooks: {
      title: 'Webhooks',
      icon: 'fa-solid fa-webhook',
      status: 'Status: Test endpoint https://demo.aitalksy.local/hook',
      foot: 'Sample URL only — no outbound webhook fired.',
    },
    rest: {
      title: 'REST API',
      icon: 'fa-solid fa-code',
      status: 'Status: Bearer token scoped to sandbox (demo)',
      foot: 'API operations are not executed during this demo.',
    },
  };

  const barEls = {};
  const valEls = {};
  metricSpec.forEach(({ key }) => {
    barEls[key] = block?.querySelector(`[data-vani-hiw-bar="${key}"]`);
    valEls[key] = block?.querySelector(`[data-vani-hiw-val="${key}"]`);
  });

  const phoneBarEls = {};
  const phoneValEls = {};
  metricSpec.forEach(({ key }) => {
    phoneBarEls[key] = panel.querySelector(`[data-vani-phone-bar="${key}"]`);
    phoneValEls[key] = panel.querySelector(`[data-vani-phone-val="${key}"]`);
  });

  const phoneConnectBtn = panel.querySelector('[data-seq="hiw-connect-btn"]');
  const phoneConnectStatus = panel.querySelector('[data-vani-phone-connect-status]');
  const phoneWaReply = panel.querySelector('[data-vani-phone-wa-reply]');
  const phoneContacts = [...panel.querySelectorAll('[data-vani-phone-contact]')];
  const phoneImportFoot = panel.querySelector('[data-vani-phone-import-foot]');
  const phoneTemplate = panel.querySelector('[data-vani-phone-template]');
  const phoneBotFoot = panel.querySelector('[data-vani-phone-bot-foot]');
  const phoneSuccess = panel.querySelector('[data-vani-phone-success]');
  const phoneStepNav = [...panel.querySelectorAll('[data-vani-phone-step]')];
  const featureCards = [...panel.querySelectorAll('[data-vani-aitalksy-feature]')];
  const floatInput = panel.querySelector('[data-vani-aitalksy-float="input"]');
  const floatAction = panel.querySelector('[data-vani-aitalksy-float="action"]');
  const floatResult = panel.querySelector('[data-vani-aitalksy-float="result"]');
  const orbitStatus = panel.querySelector('[data-vani-aitalksy-orbit="status"]');
  const orbitToast = panel.querySelector('[data-vani-aitalksy-orbit="toast"]');
  const pauseBtn = panel.querySelector('[data-vani-aitalksy-pause]');
  const replayPhoneBtn = panel.querySelector('[data-vani-aitalksy-replay-phone]');
  const featurePrevBtn = panel.querySelector('[data-vani-aitalksy-feature-prev]');
  const featureNextBtn = panel.querySelector('[data-vani-aitalksy-feature-next]');
  const phoneSyncLabel = panel.querySelector('[data-vani-aitalksy-phone-sync]');
  const phoneFeatureNav = [...panel.querySelectorAll('[data-vani-phone-feature]')].filter((el) =>
    el.closest('[data-vani-aitalksy-phone-nav="feature"]')
  );
  const phoneNavHiw = panel.querySelector('[data-vani-aitalksy-phone-nav="hiw"]');
  const phoneNavFeature = panel.querySelector('[data-vani-aitalksy-phone-nav="feature"]');
  const integrationCards = [...panel.querySelectorAll('[data-vani-aitalksy-integration]')];
  const intBackBtn = panel.querySelector('[data-vani-feat-int-back]');
  const featureStoryNow = panel.querySelector('[data-vani-feature-now]');

  const HIW_VIEW = {
    1: 'hiw-connect',
    2: 'hiw-contacts',
    3: 'hiw-campaign',
    4: 'hiw-results',
  };

  const HIW_STEP_FEATURE = {
    1: 'integrate',
    2: 'bulk',
    3: 'chatbot',
    4: 'analytics',
  };

  const HIW_PHONE_SYNC = {
    1: 'Step 1 · Connect WhatsApp (demo)',
    2: 'Step 2 · Import demo contacts',
    3: 'Step 3 · Campaign & chatbot setup',
    4: 'Step 4 · Illustrative results',
  };

  const HIW_STORY_NOW = {
    1: 'Connect WhatsApp — link your Business channel (simulated)',
    2: 'Import contacts — sample audience rows in the workspace',
    3: 'Build campaign or bot — template + AI flow (demo)',
    4: 'View results — delivery & engagement metrics (illustrative)',
  };

  const FLOAT_COPY = {
    1: {
      input: ['Connect', 'WhatsApp Business channel (demo)'],
      action: ['Link', 'Simulated channel OAuth'],
      result: ['Live', 'Demo auto-reply ready'],
      orbitStatus: 'WhatsApp linked (demo)',
      orbitToast: 'No messages sent',
    },
    2: {
      input: ['Import', 'Audience CSV · demo'],
      action: ['Validate', 'Deduplicate sample rows'],
      result: ['Ready', '3 demo contacts imported'],
      orbitStatus: 'Import in progress',
      orbitToast: 'Sample data only',
    },
    3: {
      input: ['Template', 'Welcome & qualify lead'],
      action: ['Bot', 'AI flow configured'],
      result: ['Queue', 'Campaign staged (demo)'],
      orbitStatus: 'Chatbot enabled',
      orbitToast: 'Campaign queued (demo)',
    },
    4: {
      input: ['Metrics', 'Delivery · read · reply'],
      action: ['Dashboard', 'Illustrative analytics'],
      result: ['Success', 'Demo run complete'],
      orbitStatus: 'Campaign finished',
      orbitToast: 'Metrics are illustrative',
    },
  };

  const setFloatCopy = (step) => {
    const copy = FLOAT_COPY[step] || FLOAT_COPY[1];
    const apply = (el, title, sub) => {
      if (!el) return;
      const strong = el.querySelector('strong');
      const span = el.querySelector('span');
      if (strong) strong.textContent = title;
      if (span) span.textContent = sub;
    };
    apply(floatInput, copy.input[0], copy.input[1]);
    apply(floatAction, copy.action[0], copy.action[1]);
    apply(floatResult, copy.result[0], copy.result[1]);
    const statusText = orbitStatus?.querySelector('[data-vani-aitalksy-orbit-text]');
    const toastText = orbitToast?.querySelector('[data-vani-aitalksy-orbit-text]');
    if (statusText) statusText.textContent = copy.orbitStatus;
    if (toastText) toastText.textContent = copy.orbitToast;
  };

  const setCaptionLocal = (text) => {
    const el = productsRoot.querySelector('[data-vani-demo-caption="aitalksy"]');
    if (el && text) el.textContent = text;
    if (demoCtrl?.setCaption && text) demoCtrl.setCaption('aitalksy', text);
  };

  const setPhoneNavMode = (mode) => {
    if (phoneNavHiw) phoneNavHiw.hidden = mode !== 'hiw';
    if (phoneNavFeature) phoneNavFeature.hidden = mode !== 'feature';
  };

  const setPhoneViewById = (viewId) => {
    const screen = panel.querySelector('[data-vani-app="aitalksy"]');
    if (!screen) return;
    screen.querySelectorAll('.vani-prod-app-view').forEach((view) => {
      const on = view.getAttribute('data-app-view') === viewId;
      view.classList.toggle('is-active-view', on);
      if (on) view.removeAttribute('hidden');
      else view.setAttribute('hidden', '');
    });
  };

  const setPhoneView = (step) => {
    phoneMode = 'hiw';
    setPhoneNavMode('hiw');
    const viewId = HIW_VIEW[step] || HIW_VIEW[1];
    setPhoneViewById(viewId);
    phoneStepNav.forEach((btn) => {
      const n = parseInt(btn.getAttribute('data-vani-phone-step') || '0', 10);
      btn.classList.toggle('is-on', n === step);
    });
    phoneFeatureNav.forEach((btn) => btn.classList.remove('is-on'));
    integrationCards.forEach((card) => card.classList.remove('is-active'));
  };

  const crossfadePhoneView = (tl, step, duration = 0.38) => {
    if (typeof gsap === 'undefined') {
      setPhoneView(step);
      return;
    }
    const viewId = HIW_VIEW[step];
    const current = panel.querySelector('.vani-prod-app-view.is-active-view');
    const next = panel.querySelector(`.vani-prod-app-view[data-app-view="${viewId}"]`);
    if (!next) return;
    tl.call(() => setPhoneView(step));
    if (current && current !== next) {
      tl.to(current, { opacity: 0, y: -6, duration: duration * 0.45, ease: 'power2.in' });
    }
    tl.fromTo(next, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration, ease: 'power2.out' });
  };

  const syncA11yState = (step, featureKey = '') => {
    const n = Math.min(4, Math.max(1, step || 1));
    featureCards.forEach((card) => {
      const cardStep = parseInt(card.getAttribute('data-vani-aitalksy-hiw-step') || '0', 10);
      const key = card.getAttribute('data-vani-aitalksy-feature') || '';
      const pressed = featureKey ? key === featureKey : phoneMode === 'hiw' && cardStep === n;
      card.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    });
    steps.forEach((btn) => {
      const s = parseInt(btn.getAttribute('data-vani-hiw-step') || '0', 10);
      btn.setAttribute('aria-current', phoneMode === 'hiw' && s === n ? 'step' : 'false');
    });
    phoneStepNav.forEach((btn) => {
      const s = parseInt(btn.getAttribute('data-vani-phone-step') || '0', 10);
      btn.setAttribute('aria-current', phoneMode === 'hiw' && s === n ? 'step' : 'false');
    });
    phoneFeatureNav.forEach((btn) => {
      const key = btn.getAttribute('data-vani-phone-feature') || '';
      btn.setAttribute('aria-current', phoneMode === 'feature' && key === activeFeatureKey ? 'step' : 'false');
    });
    const storySteps = panel.querySelectorAll('[data-vani-feature]');
    storySteps.forEach((btn) => {
      const s = parseInt(btn.getAttribute('data-vani-feature') || '0', 10);
      btn.setAttribute('aria-current', phoneMode === 'hiw' && s === n ? 'step' : 'false');
    });
  };

  const highlightFeatureCards = (step, featureKey = '') => {
    if (featureKey) activeFeatureKey = featureKey;
    featureCards.forEach((card) => {
      const cardStep = parseInt(card.getAttribute('data-vani-aitalksy-hiw-step') || '0', 10);
      const key = card.getAttribute('data-vani-aitalksy-feature') || '';
      const on = featureKey ? key === featureKey : phoneMode === 'hiw' && cardStep === step;
      card.classList.toggle('is-active', on);
    });
    syncA11yState(step, featureKey || (phoneMode === 'feature' ? activeFeatureKey : ''));
  };

  const applyFeatureFloatCopy = (key) => {
    const meta = FEATURE_META[key] || FEATURE_META.bulk;
    const copy = meta.float;
    const apply = (el, title, sub) => {
      if (!el) return;
      const strong = el.querySelector('strong');
      const span = el.querySelector('span');
      if (strong) strong.textContent = title;
      if (span) span.textContent = sub;
    };
    apply(floatInput, copy.input[0], copy.input[1]);
    apply(floatAction, copy.action[0], copy.action[1]);
    apply(floatResult, copy.result[0], copy.result[1]);
    const statusText = orbitStatus?.querySelector('[data-vani-aitalksy-orbit-text]');
    const toastText = orbitToast?.querySelector('[data-vani-aitalksy-orbit-text]');
    if (statusText) statusText.textContent = copy.orbitStatus;
    if (toastText) toastText.textContent = copy.orbitToast;
    if (orbitStatus) orbitStatus.hidden = false;
    if (orbitToast) orbitToast.hidden = false;
  };

  const resetFeatureViewAnimState = (viewId) => {
    panel.querySelectorAll('[data-vani-feat-bulk-proc], [data-vani-feat-bulk-done]').forEach((el) => {
      if (el.hasAttribute('data-vani-feat-bulk-proc')) el.hidden = true;
      if (el.hasAttribute('data-vani-feat-bulk-done')) el.hidden = true;
    });
    ['chat-user', 'chat-proc', 'chat-reply', 'chat-foot'].forEach((suffix) => {
      panel.querySelector(`[data-vani-feat-${suffix.replace('chat-', 'chat-')}]`);
    });
    const hideSel = [
      '[data-vani-feat-chat-user]',
      '[data-vani-feat-chat-proc]',
      '[data-vani-feat-chat-reply]',
      '[data-vani-feat-chat-foot]',
      '[data-vani-feat-auto-in]',
      '[data-vani-feat-auto-out]',
      '[data-vani-feat-auto-foot]',
      '[data-vani-feat-int-proc]',
    ];
    hideSel.forEach((sel) => {
      panel.querySelectorAll(sel).forEach((el) => {
        el.hidden = true;
      });
    });
    metricSpec.forEach(({ key }) => {
      const bar = panel.querySelector(`[data-vani-feat-bar="${key}"]`);
      const val = panel.querySelector(`[data-vani-feat-val="${key}"]`);
      if (bar) bar.style.width = '0%';
      if (val) val.textContent = '—';
    });
    const sent = panel.querySelector('[data-vani-feat-analytics-sent]');
    const replies = panel.querySelector('[data-vani-feat-analytics-replies]');
    if (sent) sent.textContent = '—';
    if (replies) replies.textContent = '—';
    if (viewId !== 'feat-integration-detail' && intBackBtn) {
      /* keep detail fields */
    }
  };

  const runFeatureMicroDemo = (key) => {
    if (featureReplayTimer) {
      clearTimeout(featureReplayTimer);
      featureReplayTimer = null;
    }
    const meta = FEATURE_META[key];
    if (!meta) return;
    resetFeatureViewAnimState(meta.viewId);

    const after = (ms, fn) => {
      featureReplayTimer = setTimeout(fn, ms);
    };

    if (key === 'bulk') {
      after(400, () => {
        const proc = panel.querySelector('[data-vani-feat-bulk-proc]');
        if (proc) proc.hidden = false;
      });
      after(1400, () => {
        const proc = panel.querySelector('[data-vani-feat-bulk-proc]');
        const done = panel.querySelector('[data-vani-feat-bulk-done]');
        if (proc) proc.hidden = true;
        if (done) done.hidden = false;
      });
      return;
    }
    if (key === 'chatbot') {
      after(350, () => {
        const u = panel.querySelector('[data-vani-feat-chat-user]');
        if (u) u.hidden = false;
      });
      after(900, () => {
        const p = panel.querySelector('[data-vani-feat-chat-proc]');
        if (p) p.hidden = false;
      });
      after(1700, () => {
        const p = panel.querySelector('[data-vani-feat-chat-proc]');
        const r = panel.querySelector('[data-vani-feat-chat-reply]');
        if (p) p.hidden = true;
        if (r) r.hidden = false;
      });
      after(2200, () => {
        const f = panel.querySelector('[data-vani-feat-chat-foot]');
        if (f) f.hidden = false;
      });
      return;
    }
    if (key === 'analytics') {
      after(300, () => {
        const sent = panel.querySelector('[data-vani-feat-analytics-sent]');
        const rep = panel.querySelector('[data-vani-feat-analytics-replies]');
        if (sent) sent.textContent = '1.2k';
        if (rep) rep.textContent = '41%';
      });
      metricSpec.forEach(({ key: mk, pct, label }, i) => {
        after(500 + i * 450, () => {
          const bar = panel.querySelector(`[data-vani-feat-bar="${mk}"]`);
          const val = panel.querySelector(`[data-vani-feat-val="${mk}"]`);
          if (bar) bar.style.width = `${pct}%`;
          if (val) val.textContent = label;
        });
      });
      return;
    }
    if (key === 'autoreply') {
      after(400, () => {
        const inn = panel.querySelector('[data-vani-feat-auto-in]');
        if (inn) inn.hidden = false;
      });
      after(1100, () => {
        const out = panel.querySelector('[data-vani-feat-auto-out]');
        if (out) out.hidden = false;
      });
      after(1600, () => {
        const f = panel.querySelector('[data-vani-feat-auto-foot]');
        if (f) f.hidden = false;
      });
      return;
    }
    if (key === 'integrate') return;
    if (key === 'secure') return;
  };

  const runIntegrationMicroDemo = () => {
    const proc = panel.querySelector('[data-vani-feat-int-proc]');
    if (proc) proc.hidden = true;
    if (featureReplayTimer) clearTimeout(featureReplayTimer);
    setTimeout(() => {
      if (proc) proc.hidden = false;
    }, 350);
    featureReplayTimer = setTimeout(() => {
      if (proc) proc.hidden = true;
    }, 1200);
  };

  const populateIntegrationDetail = (integrationKey) => {
    const data = INTEGRATION_META[integrationKey];
    if (!data) return;
    const badge = panel.querySelector('[data-vani-feat-int-badge]');
    const title = panel.querySelector('[data-vani-feat-int-title]');
    const status = panel.querySelector('[data-vani-feat-int-status]');
    const foot = panel.querySelector('[data-vani-feat-int-foot]');
    if (badge) {
      const icon = badge.querySelector('i');
      if (icon) icon.className = data.icon;
    }
    if (title) title.textContent = data.title;
    if (status) status.textContent = data.status;
    if (foot) foot.textContent = data.foot;
  };

  const pauseAutoDemo = () => {
    if (pauseBtn && pauseBtn.getAttribute('aria-pressed') !== 'true') {
      pauseBtn.click();
    } else if (demoCtrl?.setPaused) {
      demoCtrl.setPaused('aitalksy', true);
    }
  };

  const goToPhoneFeature = (key, { integrationKey = '', skipAnim = false } = {}) => {
    if (integrationKey) {
      pauseAutoDemo();
      phoneMode = 'feature';
      activeFeatureKey = 'integrate';
      setPhoneNavMode('feature');
      populateIntegrationDetail(integrationKey);
      setPhoneViewById('feat-integration-detail');
      phoneFeatureNav.forEach((btn) => {
        btn.classList.toggle('is-on', btn.getAttribute('data-vani-phone-feature') === 'integrate');
      });
      integrationCards.forEach((card) => {
        card.classList.toggle('is-active', card.getAttribute('data-vani-aitalksy-integration') === integrationKey);
      });
      highlightFeatureCards(1, 'integrate');
      const cap = `${INTEGRATION_META[integrationKey]?.title || 'Integration'} — demo connection preview (simulated)`;
      setCaptionLocal(cap);
      if (phoneSyncLabel) phoneSyncLabel.textContent = `${INTEGRATION_META[integrationKey]?.title || 'Integration'} · demo`;
      if (featureStoryNow) featureStoryNow.textContent = cap;
      applyFeatureFloatCopy('integrate');
      if (!skipAnim) runIntegrationMicroDemo();
      return;
    }

    const meta = FEATURE_META[key] || FEATURE_META.bulk;
    pauseAutoDemo();
    phoneMode = 'feature';
    activeFeatureKey = key;
    setPhoneNavMode('feature');
    setPhoneViewById(meta.viewId);
    phoneFeatureNav.forEach((btn) => {
      btn.classList.toggle('is-on', btn.getAttribute('data-vani-phone-feature') === key);
    });
    integrationCards.forEach((card) => card.classList.remove('is-active'));
    highlightFeatureCards(meta.hiwStep || 1, key);
    setCaptionLocal(meta.caption);
    if (phoneSyncLabel) phoneSyncLabel.textContent = meta.sync;
    if (featureStoryNow) featureStoryNow.textContent = meta.storyNow;
    applyFeatureFloatCopy(key);
    if (!skipAnim) runFeatureMicroDemo(key);
  };

  const syncHiwSidebarStep = (index, { markDoneThrough = false } = {}) => {
    if (!block) return Math.min(4, Math.max(1, index));
    return setActiveStep(index, { markDoneThrough });
  };

  const syncWorkflowChrome = (index, { workflowComplete = false } = {}) => {
    const n = Math.min(4, Math.max(1, index));
    if (hiwProgress) hiwProgress.style.width = `${(n / 4) * 100}%`;
    if (phoneSyncLabel) phoneSyncLabel.textContent = HIW_PHONE_SYNC[n] || HIW_PHONE_SYNC[1];
    if (featureStoryNow) featureStoryNow.textContent = HIW_STORY_NOW[n] || HIW_STORY_NOW[1];
    if (block) block.classList.toggle('is-workflow-complete', workflowComplete);
    if (hiwComplete) hiwComplete.hidden = !workflowComplete;
  };

  const pulseHiwPreview = (tl, stepIndex) => {
    if (!hiwPreview || !hasGsap) return;
    tl.call(() => {
      hiwPreview.classList.remove('is-step-pulse');
      void hiwPreview.offsetWidth;
      hiwPreview.classList.add('is-step-pulse');
    });
    const scene = block?.querySelector(`[data-vani-hiw-scene="${stepIndex}"]`);
    if (scene && hasGsap) {
      const items = scene.querySelectorAll(
        '.vani-prod-aitalksy-hiw-ui-card, .vani-prod-aitalksy-hiw-contact, .vani-prod-aitalksy-hiw-metric, .vani-prod-aitalksy-hiw-ui-title, .vani-prod-aitalksy-hiw-field, .vani-prod-aitalksy-hiw-ui-btn'
      );
      if (items.length) {
        tl.fromTo(items, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.34, stagger: 0.05, ease: 'power2.out' });
      }
    }
  };

  const setActiveStep = (index, { markDoneThrough = false } = {}) => {
    const n = Math.min(4, Math.max(1, index));
    steps.forEach((btn) => {
      const s = parseInt(btn.getAttribute('data-vani-hiw-step') || '0', 10);
      btn.classList.toggle('is-active', s === n);
      btn.classList.toggle('is-done', markDoneThrough && s < n);
    });
    scenes.forEach((scene) => {
      const s = parseInt(scene.getAttribute('data-vani-hiw-scene') || '0', 10);
      const on = s === n;
      scene.classList.toggle('is-active', on);
      if (on) scene.removeAttribute('hidden');
      else scene.setAttribute('hidden', '');
    });
    syncWorkflowChrome(n, { workflowComplete: markDoneThrough && n >= 4 });
    return n;
  };

  const resetPhoneState = () => {
    if (phoneConnectStatus) phoneConnectStatus.hidden = true;
    if (phoneWaReply) phoneWaReply.hidden = true;
    if (phoneImportFoot) phoneImportFoot.hidden = true;
    if (phoneBotFoot) phoneBotFoot.hidden = true;
    if (phoneSuccess) phoneSuccess.hidden = true;
    if (phoneConnectBtn) phoneConnectBtn.classList.remove('is-pulse');
    if (phoneTemplate) phoneTemplate.classList.remove('is-highlight');
    if (orbitStatus) orbitStatus.hidden = true;
    if (orbitToast) orbitToast.hidden = true;
    phoneContacts.forEach((el) => {
      el.style.opacity = '';
      el.style.transform = '';
    });
    metricSpec.forEach(({ key }) => {
      if (phoneBarEls[key]) phoneBarEls[key].style.width = '0%';
      if (phoneValEls[key]) phoneValEls[key].textContent = '—';
    });
    setPhoneView(1);
    setFloatCopy(1);
    highlightFeatureCards(1);
  };

  const resetPreview = () => {
    if (status1) status1.hidden = true;
    if (importFoot) importFoot.hidden = true;
    if (botReady) botReady.hidden = true;
    if (resultEl) resultEl.hidden = true;
    if (connectBtn) connectBtn.classList.remove('is-pulse');
    if (templateEl) templateEl.classList.remove('is-highlight');
    if (campaignPreview) {
      campaignPreview.classList.remove('is-visible');
      campaignPreview.setAttribute('aria-hidden', 'true');
    }
    if (hiwComplete) hiwComplete.hidden = true;
    if (block) block.classList.remove('is-workflow-complete');
    contacts.forEach((el) => {
      el.style.opacity = '';
      el.style.transform = '';
    });
    metricSpec.forEach(({ key }) => {
      if (barEls[key]) barEls[key].style.width = '0%';
      if (valEls[key]) valEls[key].textContent = '—';
    });
    steps.forEach((btn) => btn.classList.remove('is-done'));
    setActiveStep(1);
    syncWorkflowChrome(1);
    resetPhoneState();
  };

  const applyStepInstant = (stepIndex, { featureKey = '' } = {}) => {
    phoneMode = 'hiw';
    setPhoneNavMode('hiw');
    const n = syncHiwSidebarStep(stepIndex, { markDoneThrough: stepIndex >= 4 });
    setFloatCopy(n);
    highlightFeatureCards(n, featureKey || HIW_STEP_FEATURE[n] || '');
    syncWorkflowChrome(n, { workflowComplete: stepIndex >= 4 });
    setPhoneView(n);
    if (n === 1) {
      if (status1) status1.hidden = false;
      if (phoneConnectStatus) phoneConnectStatus.hidden = false;
      if (phoneWaReply) phoneWaReply.hidden = false;
    }
    if (n >= 2) {
      contacts.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      phoneContacts.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      if (importFoot) importFoot.hidden = false;
      if (phoneImportFoot) phoneImportFoot.hidden = false;
    }
    if (n >= 3) {
      if (templateEl) templateEl.classList.add('is-highlight');
      if (phoneTemplate) phoneTemplate.classList.add('is-highlight');
      if (botReady) botReady.hidden = false;
      if (phoneBotFoot) phoneBotFoot.hidden = false;
      if (campaignPreview) {
        campaignPreview.classList.add('is-visible');
        campaignPreview.setAttribute('aria-hidden', 'false');
      }
    }
    if (n >= 4) {
      metricSpec.forEach(({ key, pct, label }) => {
        if (barEls[key]) barEls[key].style.width = `${pct}%`;
        if (valEls[key]) valEls[key].textContent = label;
        if (phoneBarEls[key]) phoneBarEls[key].style.width = `${pct}%`;
        if (phoneValEls[key]) phoneValEls[key].textContent = label;
      });
      if (resultEl) resultEl.hidden = false;
      if (phoneSuccess) phoneSuccess.hidden = false;
      if (hiwComplete) hiwComplete.hidden = false;
      if (block) block.classList.add('is-workflow-complete');
    }
    if (orbitStatus) orbitStatus.hidden = false;
    if (orbitToast) orbitToast.hidden = false;
    return n;
  };

  const appendHiwStep = (tl, stepIndex, hooks = {}) => {
    const { setActiveFeature, setCaption, setStoryPhase, pauseBeat, onStepDone } = hooks;
    const primaryFeature = HIW_STEP_FEATURE[stepIndex] || '';
    tl.call(() => {
      phoneMode = 'hiw';
      setPhoneNavMode('hiw');
      syncHiwSidebarStep(stepIndex);
      setFloatCopy(stepIndex);
      highlightFeatureCards(stepIndex, primaryFeature);
      syncWorkflowChrome(stepIndex);
      if (setActiveFeature) setActiveFeature('aitalksy', stepIndex);
      if (orbitStatus) orbitStatus.hidden = false;
      if (orbitToast) orbitToast.hidden = false;
    });
    pulseHiwPreview(tl, stepIndex);
    if (stepIndex > 1) {
      crossfadePhoneView(tl, stepIndex);
    } else {
      tl.call(() => setPhoneView(1));
    }

    if (stepIndex === 1) {
      tl.call(() => {
        if (setStoryPhase) setStoryPhase('aitalksy', 'input');
        if (setCaption) setCaption('aitalksy', 'Step 1 — Connect WhatsApp Business (simulated)');
      });
      tl.call(() => {
        if (connectBtn) connectBtn.classList.add('is-pulse');
        if (phoneConnectBtn) phoneConnectBtn.classList.add('is-pulse');
      });
      tl.to({}, { duration: 0.95 });
      tl.call(() => {
        if (connectBtn) connectBtn.classList.remove('is-pulse');
        if (phoneConnectBtn) phoneConnectBtn.classList.remove('is-pulse');
        if (status1) status1.hidden = false;
        if (phoneConnectStatus) phoneConnectStatus.hidden = false;
        if (setStoryPhase) setStoryPhase('aitalksy', 'result');
      });
      tl.to({}, { duration: 0.45 });
      tl.call(() => {
        if (phoneWaReply) phoneWaReply.hidden = false;
      });
      if (pauseBeat) pauseBeat(tl, 0.85);
      return;
    }

    if (stepIndex === 2) {
      tl.call(() => {
        if (setStoryPhase) setStoryPhase('aitalksy', 'action');
        if (setCaption) setCaption('aitalksy', 'Step 2 — Import demo contacts into the web workspace');
        if (hasGsap) {
          contacts.forEach((el) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(8px)';
          });
          phoneContacts.forEach((el) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(8px)';
          });
        }
      });
      if (hasGsap && contacts.length) {
        tl.fromTo(
          contacts,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.38, stagger: 0.2, ease: 'power2.out' }
        );
        tl.fromTo(
          phoneContacts,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.38, stagger: 0.2, ease: 'power2.out' },
          '-=0.55'
        );
      }
      tl.call(() => {
        if (importFoot) importFoot.hidden = false;
        if (phoneImportFoot) phoneImportFoot.hidden = false;
        if (setStoryPhase) setStoryPhase('aitalksy', 'result');
      });
      if (pauseBeat) pauseBeat(tl, 0.8);
      return;
    }

    if (stepIndex === 3) {
      tl.call(() => {
        if (setStoryPhase) setStoryPhase('aitalksy', 'action');
        if (setCaption) setCaption('aitalksy', 'Step 3 — Configure campaign template & AI chatbot (demo)');
        if (templateEl) templateEl.classList.add('is-highlight');
        if (phoneTemplate) phoneTemplate.classList.add('is-highlight');
      });
      tl.to({}, { duration: 0.55 });
      tl.call(() => {
        if (campaignPreview) {
          campaignPreview.classList.add('is-visible');
          campaignPreview.setAttribute('aria-hidden', 'false');
        }
      });
      tl.to({}, { duration: 0.45 });
      tl.call(() => {
        if (botReady) botReady.hidden = false;
        if (phoneBotFoot) phoneBotFoot.hidden = false;
        if (setStoryPhase) setStoryPhase('aitalksy', 'result');
      });
      if (pauseBeat) pauseBeat(tl, 0.75);
      return;
    }

    if (stepIndex === 4) {
      tl.call(() => {
        if (setStoryPhase) setStoryPhase('aitalksy', 'action');
        if (setCaption) setCaption('aitalksy', 'Step 4 — View illustrative delivery & engagement metrics');
      });
      metricSpec.forEach(({ key, pct, label }) => {
        tl.call(() => {
          if (barEls[key]) barEls[key].style.width = `${pct}%`;
          if (valEls[key]) valEls[key].textContent = label;
          if (phoneBarEls[key]) phoneBarEls[key].style.width = `${pct}%`;
          if (phoneValEls[key]) phoneValEls[key].textContent = label;
        });
        tl.to({}, { duration: 0.48 });
      });
      tl.call(() => {
        if (resultEl) resultEl.hidden = false;
        if (phoneSuccess) phoneSuccess.hidden = false;
        if (setStoryPhase) setStoryPhase('aitalksy', 'result');
        if (setCaption) setCaption('aitalksy', 'Demo success — metrics shown are illustrative only');
        syncWorkflowChrome(4, { workflowComplete: true });
      });
      if (pauseBeat) pauseBeat(tl, 1.05);
    }

    tl.call(() => {
      steps.forEach((btn) => {
        const s = parseInt(btn.getAttribute('data-vani-hiw-step') || '0', 10);
        btn.classList.toggle('is-done', s <= stepIndex);
      });
      if (stepIndex >= 4) {
        if (block) block.classList.add('is-workflow-complete');
        if (hiwComplete) hiwComplete.hidden = false;
      }
      if (onStepDone) onStepDone(stepIndex);
    });
  };

  const jumpToStep = (index, opts = {}) => {
    ensureVaniProdStackPanelsVisible(productsRoot);
    if (demoCtrl?.goToFeature) {
      demoCtrl.goToFeature('aitalksy', index);
      if (opts.featureKey) highlightFeatureCards(index, opts.featureKey);
      return;
    }
    resetPreview();
    applyStepInstant(index, { featureKey: opts.featureKey || '' });
  };

  steps.forEach((btn) => {
    btn.addEventListener('click', () => {
      pauseAutoDemo();
      const index = parseInt(btn.getAttribute('data-vani-hiw-step') || '1', 10);
      jumpToStep(index);
    });
  });

  phoneStepNav.forEach((btn) => {
    btn.addEventListener('click', () => {
      pauseAutoDemo();
      const index = parseInt(btn.getAttribute('data-vani-phone-step') || '1', 10);
      jumpToStep(index);
    });
  });

  featureCards.forEach((card) => {
    card.setAttribute('aria-pressed', 'false');
    card.addEventListener('click', () => {
      const featureKey = card.getAttribute('data-vani-aitalksy-feature') || '';
      goToPhoneFeature(featureKey);
    });
  });

  integrationCards.forEach((card) => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-vani-aitalksy-integration') || '';
      goToPhoneFeature('integrate', { integrationKey: key });
    });
  });

  phoneFeatureNav.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-vani-phone-feature') || '';
      goToPhoneFeature(key);
    });
  });

  intBackBtn?.addEventListener('click', () => goToPhoneFeature('integrate'));

  const stepFeatureBy = (delta) => {
    const idx = FEATURE_ORDER.indexOf(activeFeatureKey);
    const base = idx >= 0 ? idx : 0;
    const nextKey = FEATURE_ORDER[(base + delta + FEATURE_ORDER.length) % FEATURE_ORDER.length];
    goToPhoneFeature(nextKey);
  };

  featurePrevBtn?.addEventListener('click', () => stepFeatureBy(-1));
  featureNextBtn?.addEventListener('click', () => stepFeatureBy(1));

  const swipeZone = panel.querySelector('[data-vani-swipe-zone]');
  if (swipeZone) {
    let startX = 0;
    swipeZone.addEventListener(
      'touchstart',
      (e) => {
        startX = e.changedTouches[0]?.clientX || 0;
      },
      { passive: true }
    );
    swipeZone.addEventListener(
      'touchend',
      (e) => {
        if (phoneMode !== 'feature') return;
        const dx = (e.changedTouches[0]?.clientX || 0) - startX;
        if (Math.abs(dx) < 48) return;
        stepFeatureBy(dx < 0 ? 1 : -1);
      },
      { passive: true }
    );
  }

  initAitalksyKeyboardNav(panel, {
    featureCards,
    integrationCards,
    hiwSteps: steps,
    phoneStepNav,
    phoneFeatureNav,
    storySteps: [...panel.querySelectorAll('[data-vani-feature]')],
    onSelectStep: (index, featureKey) => jumpToStep(index, { featureKey }),
    getFeatureKeyForCard: (card) => card.getAttribute('data-vani-aitalksy-feature') || '',
    getStepForCard: (card) => parseInt(card.getAttribute('data-vani-aitalksy-hiw-step') || '1', 10),
  });

  const replayAll = () => {
    if (pauseBtn) {
      pauseBtn.setAttribute('aria-pressed', 'false');
      const icon = pauseBtn.querySelector('i');
      const label = pauseBtn.querySelector('span');
      if (icon) icon.className = 'fa-solid fa-pause';
      if (label) label.textContent = 'Pause';
    }
    if (demoCtrl?.setPaused) demoCtrl.setPaused('aitalksy', false);
    if (demoCtrl?.resumeAutoDemo) demoCtrl.resumeAutoDemo('aitalksy');
    else resetPreview();
  };

  replayBtn?.addEventListener('click', () => replayAll());
  replayPhoneBtn?.addEventListener('click', () => {
    if (phoneMode === 'feature') {
      const onDetail = panel.querySelector('[data-app-view="feat-integration-detail"]')?.classList.contains('is-active-view');
      if (onDetail) {
        const activeInt = integrationCards.find((c) => c.classList.contains('is-active'));
        const key = activeInt?.getAttribute('data-vani-aitalksy-integration') || 'whatsapp';
        resetFeatureViewAnimState('feat-integration-detail');
        runIntegrationMicroDemo();
        return;
      }
      resetFeatureViewAnimState(FEATURE_META[activeFeatureKey]?.viewId);
      runFeatureMicroDemo(activeFeatureKey);
      return;
    }
    replayAll();
  });

  pauseBtn?.addEventListener('click', () => {
    const pressed = pauseBtn.getAttribute('aria-pressed') === 'true';
    const next = !pressed;
    pauseBtn.setAttribute('aria-pressed', next ? 'true' : 'false');
    const icon = pauseBtn.querySelector('i');
    const label = pauseBtn.querySelector('span');
    if (icon) icon.className = next ? 'fa-solid fa-play' : 'fa-solid fa-pause';
    if (label) label.textContent = next ? 'Resume' : 'Pause';
    if (demoCtrl?.setPaused) demoCtrl.setPaused('aitalksy', next);
  });

  resetPreview();

  if (!hasGsap) {
    productsRoot.classList.add('vani-prod-hiw-static');
    applyStepInstant(1);
  }

  return {
    attachDemo(ctrl) {
      demoCtrl = ctrl;
    },
    resetPreview,
    resetPhoneState,
    applyStepInstant,
    appendHiwStep,
    jumpToStep,
    goToPhoneFeature,
    onTabChange(key) {
      tabActive = key === 'aitalksy';
    },
    onProductsReveal() {},
  };
}

/**
 * Vertical stack — keep every product panel in the document flow (#products only).
 */
function ensureVaniProdStackPanelsVisible(root) {
  if (!root?.classList.contains('vani-prod-stacked')) return;
  root.querySelectorAll('.vani-prod-panel[data-vani-prod-panel]').forEach((panel) => {
    panel.classList.add('is-active');
    panel.removeAttribute('hidden');
  });
}

/**
 * Tabbed SaaS product presenter + GSAP workflow demos — #products only
 */
function initVaniProductsSection() {
  const root = document.getElementById('products');
  if (!root) return;

  ensureVaniProdStackPanelsVisible(root);

  const tabs = root.querySelectorAll('.vani-prod-tab[data-vani-prod-tab]');
  const panels = root.querySelectorAll('.vani-prod-panel[data-vani-prod-panel]');
  if (!panels.length) return;

  const communityPreview = initCommunityInteractivePreview(root);
  const travelPreview = initTravelJiooAutoDemo(root);
  const aitalksyPreview = initAitalksyInteractivePreview(root);
  const demo = createVaniProductsDemoController(root, { aitalksyPreview, communityPreview, travelPreview });
  if (aitalksyPreview?.attachDemo) aitalksyPreview.attachDemo(demo);
  if (demo && demo.bindFeatureExplore) demo.bindFeatureExplore();
  initVaniProdPhoneDeviceFeel(root, demo);
  initVaniProductsScrollReveal(root, () => {
    if (demo && demo.markRevealComplete) demo.markRevealComplete();
    if (aitalksyPreview?.onProductsReveal) aitalksyPreview.onProductsReveal();
    if (travelPreview?.onRevealComplete) travelPreview.onRevealComplete();
  });
  const isStacked = root.classList.contains('vani-prod-stacked');

  const showAllPanels = () => {
    panels.forEach((panel) => {
      panel.classList.add('is-active');
      panel.removeAttribute('hidden');
    });
  };

  const activate = (key) => {
    if (isStacked) {
      if (demo) demo.play(key);
      if (aitalksyPreview?.onTabChange) aitalksyPreview.onTabChange(key);
      return;
    }
    tabs.forEach((tab) => {
      const isActive = tab.getAttribute('data-vani-prod-tab') === key;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    panels.forEach((panel) => {
      const isActive = panel.getAttribute('data-vani-prod-panel') === key;
      panel.classList.toggle('is-active', isActive);
      if (isActive) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    });
    if (demo) demo.play(key);
    if (aitalksyPreview?.onTabChange) aitalksyPreview.onTabChange(key);
  };

  if (isStacked) {
    showAllPanels();
    tabs.forEach((tab) => {
      tab.setAttribute('tabindex', '-1');
      tab.setAttribute('aria-hidden', 'true');
    });
  } else if (tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        activate(tab.getAttribute('data-vani-prod-tab'));
      });
    });
    activate('aitalksy');
  }
}

/**
 * One-time scroll-into-view reveal for #products (IntersectionObserver + GSAP)
 */
function initVaniProductsScrollReveal(root, onComplete) {
  let reducedMotion = false;
  try {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (err) {}

  const finish = () => {
    root.classList.remove('vani-prod-scroll-pending');
    root.classList.add('vani-prod-scroll-revealed');
    if (typeof onComplete === 'function') onComplete();
  };

  if (reducedMotion || typeof gsap === 'undefined') {
    finish();
    return;
  }

  const isStacked = root.classList.contains('vani-prod-stacked');
  const header = root.querySelector('.vani-prod-section-header');
  const tablist = root.querySelector('.vani-prod-tablist');
  const tabs = tablist && !isStacked ? tablist.querySelectorAll('.vani-prod-tab') : [];
  const stackedPanels = isStacked ? [...root.querySelectorAll('.vani-prod-panel[data-vani-prod-panel]')] : [];
  const activePanel = isStacked ? stackedPanels[0] : root.querySelector('.vani-prod-panel.is-active');

  const getPanelParts = (panel) => {
    if (!panel) return null;
    return {
      storyRail: panel.querySelector('.vani-prod-story-rail'),
      headline: panel.querySelector('.vani-prod-copy h3'),
      description: panel.querySelector('.vani-prod-copy > p.text-sm, .vani-prod-copy > p.text-sm.sm\\:text-base'),
      features: panel.querySelectorAll('.vani-prod-feature-step'),
      featureStory: panel.querySelector('.vani-prod-feature-story'),
      ctas: panel.querySelector('.vani-prod-copy > div.flex'),
      hero: panel.querySelector('.vani-prod-hero-canvas'),
      flowRail: panel.querySelector('.vani-prod-flow-rail'),
    };
  };

  const parts = getPanelParts(activePanel);
  const stackedParts = isStacked ? stackedPanels.map((panel) => getPanelParts(panel)).filter(Boolean) : [];
  root.classList.add('vani-prod-scroll-pending');

  const headerBits = header ? header.children : [];
  gsap.set(headerBits, { opacity: 0, y: 22 });
  if (tabs.length) gsap.set(tabs, { opacity: 0, y: 14 });
  const applyPanelInitialState = (p) => {
    if (!p) return;
    if (p.storyRail) gsap.set(p.storyRail, { opacity: 0, y: 10 });
    if (p.headline) gsap.set(p.headline, { opacity: 0, y: 18 });
    if (p.description) gsap.set(p.description, { opacity: 0, y: 14 });
    if (p.featureStory) gsap.set(p.featureStory, { opacity: 0, y: 12 });
    if (p.features.length) gsap.set(p.features, { opacity: 0, x: -10 });
    if (p.ctas) gsap.set(p.ctas, { opacity: 0, y: 10 });
    if (p.flowRail) gsap.set(p.flowRail, { opacity: 0, y: 8 });
    if (p.hero) gsap.set(p.hero, { opacity: 0, scale: 0.94, y: 28 });
  };
  if (isStacked) stackedParts.forEach(applyPanelInitialState);
  else applyPanelInitialState(parts);
  if (isStacked) {
    root.querySelectorAll('.vani-prod-stack-header').forEach((el) => gsap.set(el, { opacity: 0, y: 12 }));
  }

  let revealed = false;

  const runReveal = () => {
    if (revealed) return;
    revealed = true;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out', force3D: true },
      onComplete: finish,
    });

    if (headerBits.length) {
      tl.to(headerBits, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 });
    }
    if (tabs.length) {
      tl.to(tabs, { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 }, '-=0.15');
    }

    const revealOnePanel = (p, position) => {
      if (!p) return;
      if (p.storyRail) tl.to(p.storyRail, { opacity: 1, y: 0, duration: 0.32 }, position);
      if (p.headline) tl.to(p.headline, { opacity: 1, y: 0, duration: 0.42 }, '-=0.05');
      if (p.description) tl.to(p.description, { opacity: 1, y: 0, duration: 0.38 }, '-=0.22');
      if (p.featureStory) tl.to(p.featureStory, { opacity: 1, y: 0, duration: 0.4 }, '-=0.18');
      if (p.features.length) tl.to(p.features, { opacity: 1, x: 0, duration: 0.34, stagger: 0.07 }, '-=0.28');
      if (p.hero) {
        tl.to(
          p.hero,
          { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'power3.out' },
          p.features.length ? '-=0.35' : '-=0.2'
        );
      }
      if (p.flowRail) tl.to(p.flowRail, { opacity: 1, y: 0, duration: 0.3 }, '-=0.45');
      if (p.ctas) tl.to(p.ctas, { opacity: 1, y: 0, duration: 0.32 }, '-=0.35');
    };

    if (isStacked && stackedParts.length) {
      const stackHeaders = root.querySelectorAll('.vani-prod-stack-header');
      if (stackHeaders.length) {
        tl.to(stackHeaders, { opacity: 1, y: 0, duration: 0.35, stagger: 0.12 }, '-=0.05');
      }
      stackedParts.forEach((p, i) => {
        revealOnePanel(p, i === 0 ? '-=0.08' : '-=0.55');
      });
    } else {
      const panel = root.querySelector('.vani-prod-panel.is-active');
      const p = getPanelParts(panel);
      if (p) revealOnePanel(p, '-=0.1');
      else tl.to({}, { duration: 0.01 });
    }
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runReveal();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -4% 0px' }
    );
    observer.observe(root);

    const rect = root.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh * 0.88 && rect.bottom > vh * 0.08) {
      runReveal();
      observer.disconnect();
    }
  } else {
    runReveal();
  }
}

function createVaniProductsDemoController(root, opts = {}) {
  const aitalksyPreview = opts.aitalksyPreview || null;
  const communityPreview = opts.communityPreview || null;
  const travelPreview = opts.travelPreview || null;
  const communityInteractive = !!communityPreview?.isInteractive;
  const travelAutoDemo = !!travelPreview?.isAutoDemo;
  let reducedMotion = false;
  try {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (err) {}

  if (reducedMotion || typeof gsap === 'undefined') {
    root.classList.add('vani-prod-demo-static');
    ensureVaniProdStackPanelsVisible(root);
    return {
      markRevealComplete() {},
      play() {},
      bindFeatureExplore: () => bindVaniProdStaticFeatureExplore(root),
      goToFeature(panelKey, index) {
        if (panelKey === 'aitalksy' && aitalksyPreview?.applyStepInstant) {
          aitalksyPreview.applyStepInstant(index);
        }
      },
      resumeAutoDemo() {},
      setPaused() {},
      setAppView(panelKey, viewId) {
        const panel = root.querySelector(`[data-vani-prod-panel="${panelKey}"]`);
        const screen = panel?.querySelector('[data-vani-app]');
        if (!screen) return;
        screen.querySelectorAll('.vani-prod-app-view').forEach((view) => {
          const on = view.getAttribute('data-app-view') === viewId;
          view.classList.toggle('is-active-view', on);
          if (on) view.removeAttribute('hidden');
          else view.setAttribute('hidden', '');
        });
      },
    };
  }

  ensureVaniProdStackPanelsVisible(root);
  root.classList.add('vani-prod-demo-ready');

  const captions = {
    aitalksy: root.querySelector('[data-vani-demo-caption="aitalksy"]'),
    community: root.querySelector('[data-vani-demo-caption="community"]'),
    traveljioo: root.querySelector('[data-vani-demo-caption="traveljioo"]'),
  };

  const setCaption = (key, text) => {
    if (captions[key]) captions[key].textContent = text;
  };

  const toggleHighlight = (el, on) => {
    if (el) el.classList.toggle('vani-prod-demo-highlight', !!on);
  };

  const setStoryPhase = (panelKey, phase) => {
    const panel = root.querySelector(`[data-vani-prod-panel="${panelKey}"]`);
    if (!panel) return;
    panel.querySelectorAll('.vani-prod-flow-step[data-flow]').forEach((step) => {
      step.classList.toggle('is-active', step.getAttribute('data-flow') === phase);
    });
    panel.querySelectorAll('.vani-prod-story-chip[data-story-phase]').forEach((chip) => {
      chip.classList.toggle('is-active', chip.getAttribute('data-story-phase') === phase);
    });
  };

  const clearStoryPhases = (panelKey) => {
    const panel = root.querySelector(`[data-vani-prod-panel="${panelKey}"]`);
    if (!panel) return;
    panel.querySelectorAll('.vani-prod-flow-step, .vani-prod-story-chip').forEach((el) => {
      el.classList.remove('is-active');
    });
  };

  const setAppView = (panelKey, viewId) => {
    const panel = root.querySelector(`[data-vani-prod-panel="${panelKey}"]`);
    const screen = panel?.querySelector('[data-vani-app]');
    if (!screen) return;
    screen.querySelectorAll('.vani-prod-app-view').forEach((view) => {
      const on = view.getAttribute('data-app-view') === viewId;
      view.classList.toggle('is-active-view', on);
      if (on) view.removeAttribute('hidden');
      else view.setAttribute('hidden', '');
    });
    screen.querySelectorAll('.vani-prod-app-nav [data-nav]').forEach((tab) => {
      tab.classList.toggle('is-on', tab.getAttribute('data-nav') === viewId);
    });
  };

  const crossfadeAppView = (tl, panelKey, viewId, duration = 0.36) => {
    const panel = root.querySelector(`[data-vani-prod-panel="${panelKey}"]`);
    if (!panel) return;
    const body = panel.querySelector('.vani-prod-app-body');
    const current = panel.querySelector('.vani-prod-app-view.is-active-view');
    const next = panel.querySelector(`.vani-prod-app-view[data-app-view="${viewId}"]`);
    if (!next) return;
    if (current && current !== next) {
      tl.to(current, {
        opacity: 0,
        y: -6,
        scale: 0.99,
        duration: duration * 0.5,
        ease: 'power2.in',
      });
    }
    tl.call(() => {
      setAppView(panelKey, viewId);
      if (body) gsap.set(body, { scrollTop: 0 });
      next.classList.add('is-view-enter');
    }).fromTo(
      next,
      { opacity: 0, y: 10, scale: 0.995 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration,
        ease: 'power2.out',
        onComplete: () => next.classList.remove('is-view-enter'),
      }
    );
  };

  const getDeviceInner = (panelKey) =>
    root.querySelector(`[data-vani-prod-panel="${panelKey}"] .vani-prod-device-inner`);

  const setScreenMode = (panelKey, mode) => {
    const inner = getDeviceInner(panelKey);
    if (!inner) return;
    inner.classList.remove('is-screen-loading', 'is-screen-success');
    if (mode === 'loading') inner.classList.add('is-screen-loading');
    if (mode === 'success') inner.classList.add('is-screen-success');
  };

  const clearScreenMode = (panelKey) => setScreenMode(panelKey, null);

  const pulseNotifBadge = (el) => {
    if (!el) return;
    el.classList.remove('is-notif-pulse');
    void el.offsetWidth;
    el.classList.add('is-notif-pulse');
  };

  const revealToast = (tl, toast) => {
    if (!toast) return;
    tl.call(() => {
      toast.hidden = false;
      toast.classList.remove('is-toast-pop');
      void toast.offsetWidth;
      toast.classList.add('is-toast-pop');
    }).fromTo(toast, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' });
  };

  const scrollAppBody = (tl, panel, toBottom = true) => {
    const body = panel?.querySelector('.vani-prod-app-body');
    if (!body) return;
    const target = toBottom ? body.scrollHeight - body.clientHeight : 0;
    tl.to(body, { scrollTop: Math.max(0, target), duration: 0.55, ease: 'power2.out' }, '-=0.15');
  };

  const resetProcSteps = (panel, containerSel) => {
    panel.querySelectorAll(`${containerSel} [data-proc]`).forEach((step) => {
      step.classList.remove('is-active', 'is-done');
    });
  };

  const DEMO = {
    beat: 0.95,
    proc: 0.72,
    result: 1.2,
    betweenFeatures: 0.65,
    repeatDelay: 2.75,
    typeChar: 0.058,
  };

  const setStepLabel = (panel, text) => {
    const el = panel?.querySelector('[data-demo-step-label]');
    if (el) el.textContent = text;
  };

  const simulateTap = (tl, el) => {
    if (!el) return;
    tl.call(() => el.classList.add('is-tapped'))
      .to(el, { scale: 0.965, duration: 0.16, ease: 'power2.in' })
      .to(el, { scale: 1, duration: 0.24, ease: 'power2.out' })
      .call(() => el.classList.remove('is-tapped'));
  };

  const pauseBeat = (tl, scale = 1) => tl.to({}, { duration: DEMO.beat * scale });

  const setActiveFeature = (panelKey, index) => {
    const panel = root.querySelector(`[data-vani-prod-panel="${panelKey}"]`);
    if (!panel) return;
    panel.querySelectorAll('[data-vani-feature]').forEach((step) => {
      const n = parseInt(step.getAttribute('data-vani-feature') || '0', 10);
      step.classList.toggle('is-active', index > 0 && n === index);
      step.classList.toggle('is-done', index > 0 && n < index);
      step.setAttribute('aria-current', index > 0 && n === index ? 'step' : 'false');
    });
    const now = panel.querySelector('[data-vani-feature-now]');
    if (!now) return;
    if (!index) {
      now.textContent = 'Phone demo starting…';
      now.classList.remove('is-live');
      return;
    }
    const active = panel.querySelector(`[data-vani-feature="${index}"]`);
    if (active) {
      const title = active.querySelector('strong')?.textContent?.trim() || '';
      const desc =
        active.querySelector('.vani-prod-feature-step-body > span')?.textContent?.trim() ||
        active.querySelector('.vani-prod-feature-step-body span')?.textContent?.trim() ||
        '';
      now.innerHTML = `<strong>${title}</strong> — ${desc}`;
      now.classList.add('is-live');
    }
  };

  const clearActiveFeature = (panelKey) => setActiveFeature(panelKey, 0);

  const animateProcSteps = (tl, panel, containerSel, total, stepDur = DEMO.proc) => {
    const procRoot = panel.querySelector(containerSel);
    tl.call(() => procRoot?.classList.add('is-loading-shimmer'));
    for (let i = 1; i <= total; i++) {
      tl.call(() => {
        panel.querySelectorAll(`${containerSel} [data-proc]`).forEach((step) => {
          const n = parseInt(step.getAttribute('data-proc') || '0', 10);
          step.classList.toggle('is-active', n === i);
          step.classList.toggle('is-done', n < i);
        });
      }).to({}, { duration: stepDur });
    }
    tl.call(() => procRoot?.classList.remove('is-loading-shimmer'));
  };

  const timelines = {};
  const featureClips = { aitalksy: [], community: [], traveljioo: [] };
  const introClips = {};
  let floatTweens = [];
  let activeKey = null;
  let sectionInView = false;
  let revealComplete = false;
  let userDriving = false;
  let userFeatureTl = null;
  const userFeatureIndex = { aitalksy: 0, community: 0, traveljioo: 0 };

  const stopFloat = () => {
    floatTweens.forEach((t) => t.kill());
    floatTweens = [];
  };

  const startFloat = (key) => {
    stopFloat();
    const panel = root.querySelector(`[data-vani-prod-panel="${key}"]`);
    const phone3d = panel?.querySelector('.vani-prod-phone-3d');
    const drop = panel?.querySelector('.vani-prod-phone-drop');
    if (!phone3d) return;
    gsap.set(phone3d, { y: 0 });
    floatTweens.push(
      gsap.to(phone3d, {
        y: -6,
        duration: 3.4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
    );
    if (drop) {
      gsap.set(drop, { scaleX: 1, opacity: 1 });
      floatTweens.push(
        gsap.to(drop, {
          scaleX: 0.9,
          opacity: 0.82,
          duration: 3.4,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          transformOrigin: '50% 50%',
        })
      );
    }
  };

  const pauseAll = () => {
    Object.values(timelines).forEach((tl) => tl.pause(0));
    stopFloat();
  };

  const resetAitalksy = () => {
    const panel = root.querySelector('[data-vani-prod-panel="aitalksy"]');
    if (!panel) return;
    const stage = panel.querySelector('.vani-prod-demo-stage');
    if (aitalksyPreview?.resetPreview) aitalksyPreview.resetPreview();
    else setAppView('aitalksy', 'hiw-connect');
    const seqEls = panel.querySelectorAll('.vani-prod-seq');
    gsap.set(seqEls, { opacity: 0, y: 10, x: 0, scale: 1 });
    gsap.set(panel.querySelectorAll('.vani-prod-app-view'), { opacity: 1, x: 0 });
    gsap.set(panel.querySelectorAll('[data-seq="steps"] [data-step]'), { opacity: 0, y: 8 });
    if (stage) gsap.set(stage, { opacity: 0, scale: 0.92, y: 14 });
    const userText = panel.querySelector('[data-seq="user-text"]');
    if (userText) userText.textContent = '';
    const processing = panel.querySelector('[data-seq="processing"]');
    if (processing) processing.hidden = true;
    resetProcSteps(panel, '[data-seq="processing"]');
    panel.querySelectorAll('[data-seq="steps"] [data-step]').forEach((s) => {
      s.classList.remove('is-done', 'is-processing');
    });
    panel.querySelector('[data-seq="status-pill"]')?.classList.remove('is-thinking');
    const homeSync = panel.querySelector('[data-seq="home-sync"]');
    const homeSyncDone = panel.querySelector('[data-seq="home-sync-done"]');
    if (homeSync) homeSync.hidden = true;
    if (homeSyncDone) {
      homeSyncDone.hidden = true;
      gsap.set(homeSyncDone, { opacity: 0, y: 8 });
    }
    resetProcSteps(panel, '[data-seq="home-sync"]');
    setStepLabel(panel, 'Feature demo');
    clearActiveFeature('aitalksy');
    clearScreenMode('aitalksy');
    panel.querySelectorAll('.vani-prod-demo-highlight').forEach((el) => el.classList.remove('vani-prod-demo-highlight'));
    clearStoryPhases('aitalksy');
  };

  const resetCommunity = () => {
    const panel = root.querySelector('[data-vani-prod-panel="community"]');
    if (!panel) return;
    if (communityInteractive) return;
    const stage = panel.querySelector('.vani-prod-demo-stage');
    setAppView('community', 'home');
    gsap.set(panel.querySelectorAll('.vani-prod-seq'), { opacity: 0, y: 10, scale: 1 });
    gsap.set(panel.querySelectorAll('.vani-prod-app-view'), { opacity: 1, x: 0 });
    gsap.set(panel.querySelectorAll('[data-service]'), { opacity: 0.35, scale: 0.92 });
    if (stage) gsap.set(stage, { opacity: 0, scale: 0.92, y: 14 });
    const verify = panel.querySelector('[data-seq="verify"]');
    if (verify) gsap.set(verify, { opacity: 0 });
    resetProcSteps(panel, '[data-seq="verify-loading"]');
    panel.querySelectorAll('[data-service]').forEach((s) => s.classList.remove('vani-prod-demo-highlight'));
    setStepLabel(panel, 'Feature demo');
    clearActiveFeature('community');
    clearScreenMode('community');
    panel.querySelectorAll('.vani-prod-demo-highlight').forEach((el) => el.classList.remove('vani-prod-demo-highlight'));
    clearStoryPhases('community');
  };

  const resetTravel = () => {
    const panel = root.querySelector('[data-vani-prod-panel="traveljioo"]');
    if (!panel) return;
    const stage = panel.querySelector('.vani-prod-demo-stage');
    setAppView('traveljioo', 'dashboard');
    gsap.set(panel.querySelectorAll('.vani-prod-seq'), { opacity: 0, y: 10 });
    gsap.set(panel.querySelectorAll('.vani-prod-app-view'), { opacity: 1, x: 0 });
    if (stage) gsap.set(stage, { opacity: 0, scale: 0.94, y: 12 });
    const pipes = panel.querySelectorAll('[data-pipe]');
    pipes.forEach((p) => p.classList.remove('is-done', 'is-active'));
    const due = panel.querySelector('.vani-prod-followup-due');
    const done = panel.querySelector('.vani-prod-followup-done');
    if (due) due.hidden = false;
    if (done) done.hidden = true;
    const itinLoad = panel.querySelector('[data-seq="itinerary-loading"]');
    if (itinLoad) itinLoad.hidden = true;
    resetProcSteps(panel, '[data-seq="itinerary-loading"]');
    setStepLabel(panel, 'Feature demo');
    clearActiveFeature('traveljioo');
    clearScreenMode('traveljioo');
    panel.querySelectorAll('.vani-prod-demo-highlight').forEach((el) => el.classList.remove('vani-prod-demo-highlight'));
    clearStoryPhases('traveljioo');
  };

  const addTyping = (tl, el, text, charDelay) => {
    tl.call(() => {
      if (el) el.textContent = '';
    });
    for (let i = 1; i <= text.length; i++) {
      tl.call(() => {
        if (el) el.textContent = text.slice(0, i);
      }).to({}, { duration: charDelay });
    }
  };

  const applyAitalksyIntroEnd = () => {
    const panel = root.querySelector('[data-vani-prod-panel="aitalksy"]');
    if (!panel) return;
    const stage = panel.querySelector('.vani-prod-demo-stage');
    const hiwSeq = panel.querySelectorAll('[data-app-view="hiw-connect"] .vani-prod-seq, [data-seq="web-badge"], [data-seq="header"]');
    resetAitalksy();
    if (stage) gsap.set(stage, { opacity: 1, scale: 1, y: 0 });
    gsap.set(hiwSeq, { opacity: 1, y: 0 });
    gsap.set(panel.querySelectorAll('[data-seq="float-input"], [data-seq="float-action"], [data-seq="float-result"]'), {
      opacity: 1,
      y: 0,
    });
  };

  const primeAitalksyForFeature = (featureIndex) => {
    applyAitalksyIntroEnd();
    if (featureIndex >= 1 && aitalksyPreview?.applyStepInstant) {
      aitalksyPreview.applyStepInstant(featureIndex);
    }
  };

  const applyCommunityIntroEnd = () => {
    const panel = root.querySelector('[data-vani-prod-panel="community"]');
    if (!panel) return;
    const stage = panel.querySelector('.vani-prod-demo-stage');
    const homeSeq = panel.querySelectorAll('[data-app-view="home"] .vani-prod-seq');
    resetCommunity();
    setAppView('community', 'home');
    if (stage) gsap.set(stage, { opacity: 1, scale: 1, y: 0 });
    gsap.set(homeSeq, { opacity: 1, y: 0 });
  };

  const primeCommunityForFeature = (featureIndex) => {
    applyCommunityIntroEnd();
    const panel = root.querySelector('[data-vani-prod-panel="community"]');
    if (!panel || featureIndex < 2) return;
    const dashDirectory = panel.querySelector('[data-seq="dash-directory"]');
    if (featureIndex >= 2) toggleHighlight(dashDirectory, false);
    if (featureIndex >= 3) {
      const verify = panel.querySelector('[data-seq="verify"]');
      setAppView('community', 'verify');
      gsap.set(verify, { opacity: 1, y: 0 });
      toggleHighlight(verify, false);
    }
    if (featureIndex >= 4) {
      const thread1 = panel.querySelector('[data-seq="thread-1"]');
      const thread2 = panel.querySelector('[data-seq="thread-2"]');
      const services = panel.querySelector('[data-seq="services"]');
      const serviceItems = panel.querySelectorAll('[data-service]');
      setAppView('community', 'services');
      gsap.set([thread1, thread2, services], { opacity: 1, y: 0 });
      gsap.set(serviceItems, { opacity: 1, scale: 1 });
    }
  };

  const applyTravelIntroEnd = () => {
    const panel = root.querySelector('[data-vani-prod-panel="traveljioo"]');
    if (!panel) return;
    const stage = panel.querySelector('.vani-prod-demo-stage');
    const dashSeq = panel.querySelectorAll('[data-app-view="dashboard"] .vani-prod-seq');
    const floatInput = panel.querySelector('[data-seq="float-input"]');
    resetTravel();
    setAppView('traveljioo', 'dashboard');
    if (stage) gsap.set(stage, { opacity: 1, scale: 1, y: 0 });
    gsap.set(dashSeq, { opacity: 1, y: 0 });
    if (floatInput) gsap.set(floatInput, { opacity: 1, y: 0 });
  };

  const primeTravelForFeature = (featureIndex) => {
    applyTravelIntroEnd();
    const panel = root.querySelector('[data-vani-prod-panel="traveljioo"]');
    if (!panel || featureIndex < 2) return;
    const dashPipeline = panel.querySelector('[data-seq="dash-pipeline"]');
    if (featureIndex >= 2) toggleHighlight(dashPipeline, false);
    if (featureIndex >= 3) {
      const lead = panel.querySelector('[data-seq="lead"]');
      setAppView('traveljioo', 'lead');
      gsap.set(lead, { opacity: 1, y: 0 });
      toggleHighlight(lead, false);
    }
    if (featureIndex >= 4) {
      const pipes = panel.querySelectorAll('[data-pipe]');
      const followup = panel.querySelector('[data-seq="followup"]');
      const due = panel.querySelector('.vani-prod-followup-due');
      const done = panel.querySelector('.vani-prod-followup-done');
      setAppView('traveljioo', 'lead');
      pipes.forEach((p) => {
        p.classList.add('is-done');
        p.classList.remove('is-active');
      });
      if (due) due.hidden = true;
      if (done) done.hidden = false;
      gsap.set(followup, { opacity: 1, y: 0 });
    }
  };

  const buildAitalksyTimeline = () => {
    const panel = root.querySelector('[data-vani-prod-panel="aitalksy"]');
    const stage = panel.querySelector('.vani-prod-demo-stage');
    const hiwIntroSeq = panel.querySelectorAll(
      '[data-seq="header"], [data-seq="web-badge"], [data-app-view="hiw-connect"] .vani-prod-seq, [data-seq="float-input"], [data-seq="float-action"], [data-seq="float-result"], [data-seq="orbit-status"], [data-seq="orbit-toast"]'
    );
    const hiwHooks = {
      setActiveFeature,
      setCaption,
      setStoryPhase,
      pauseBeat,
    };

    resetAitalksy();
    gsap.set(stage, { opacity: 0, scale: 0.92, y: 14 });

    const master = gsap.timeline({
      paused: true,
      repeat: -1,
      repeatDelay: DEMO.repeatDelay,
      onRepeat: resetAitalksy,
    });
    const introSeg = gsap.timeline();
    let tl = introSeg;
    let f1;
    let f2;
    let f3;
    let f4;

    tl.to(stage, { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: 'power2.out' })
      .call(() => {
        setStoryPhase('aitalksy', 'input');
        setCaption('aitalksy', 'AI Talksy — interactive web preview (simulated workflow)');
        setStepLabel(panel, 'Preview · Phone ready');
        panel.querySelector('[data-vani-aitalksy-orbit="status"]')?.removeAttribute('hidden');
        panel.querySelector('[data-vani-aitalksy-orbit="toast"]')?.removeAttribute('hidden');
      });
    pauseBeat(tl, 0.55);
    tl.call(() => {
      setStepLabel(panel, 'How it works · Step 01');
      setCaption('aitalksy', 'Connect → Import → Campaign → Results');
    }).to(hiwIntroSeq, { opacity: 1, y: 0, duration: 0.38, stagger: 0.06, ease: 'power2.out' });
    pauseBeat(tl);

    master.add(introSeg);

    const makeStepClip = (stepIndex) => {
      const seg = gsap.timeline();
      if (aitalksyPreview?.appendHiwStep) {
        aitalksyPreview.appendHiwStep(seg, stepIndex, {
          ...hiwHooks,
          onStepDone: () => setStepLabel(panel, `How it works · Step 0${stepIndex} complete`),
        });
      }
      pauseBeat(seg, DEMO.betweenFeatures);
      return seg;
    };

    f1 = makeStepClip(1);
    f2 = makeStepClip(2);
    f3 = makeStepClip(3);
    f4 = makeStepClip(4);

    master.add(f1).add(f2).add(f3).add(f4);
    featureClips.aitalksy = [null, f1, f2, f3, f4];
    introClips.aitalksy = introSeg;
    return master;
  };

  const buildCommunityTimeline = () => {
    if (communityInteractive) {
      return gsap.timeline({ paused: true });
    }
    const panel = root.querySelector('[data-vani-prod-panel="community"]');
    const stage = panel.querySelector('.vani-prod-demo-stage');
    const homeSeq = panel.querySelectorAll('[data-app-view="home"] .vani-prod-seq');
    const dashDirectory = panel.querySelector('[data-seq="dash-directory"]');
    const startVerify = panel.querySelector('[data-seq="start-verify"]');
    const verify = panel.querySelector('[data-seq="verify"]');
    const navServices = panel.querySelector('[data-seq="nav-services"]');
    const navHub = panel.querySelector('[data-seq="nav-hub"]');
    const thread1 = panel.querySelector('[data-seq="thread-1"]');
    const thread2 = panel.querySelector('[data-seq="thread-2"]');
    const services = panel.querySelector('[data-seq="services"]');
    const serviceItems = panel.querySelectorAll('[data-service]');
    const hubSeq = panel.querySelectorAll('[data-app-view="hub"] .vani-prod-seq');
    const success = panel.querySelector('[data-seq="success"]');
    const floatAction = panel.querySelector('[data-seq="float-action"]');
    const floatResult = panel.querySelector('[data-seq="float-result"]');

    resetCommunity();
    gsap.set(stage, { opacity: 0, scale: 0.92, y: 14 });

    const master = gsap.timeline({ paused: true, repeat: -1, repeatDelay: DEMO.repeatDelay, onRepeat: resetCommunity });
    const introSeg = gsap.timeline();
    let tl = introSeg;
    let f1;
    let f2;
    let f3;
    let f4;

    tl.to(stage, { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: 'power2.out' })
      .call(() => {
        setStoryPhase('community', 'input');
        setCaption('community', 'Community Forum — feature-by-feature demo');
        setStepLabel(panel, 'Step 1 · Phone ready');
      });
    pauseBeat(tl, 0.75);
    tl.call(() => {
      setStepLabel(panel, 'Step 2 · Community home');
      setCaption('community', 'Home — member stats & modules');
    })
      .to(homeSeq, { opacity: 1, y: 0, duration: 0.38, stagger: 0.09 });
    pauseBeat(tl);

    master.add(introSeg);
    f1 = gsap.timeline();
    tl = f1;

    /* Feature 1 — Member directory & threads */
    tl.call(() => {
      setActiveFeature('community', 1);
      setStoryPhase('community', 'input');
      setStepLabel(panel, 'User action · Open directory');
      setCaption('community', 'Feature 1 — User opens member directory');
    });
    simulateTap(tl, dashDirectory);
    tl.call(() => {
      setStoryPhase('community', 'action');
      setStepLabel(panel, 'Community Forum · Member network');
      setCaption('community', 'Product — profiles, threads & reputation');
    })
      .fromTo(floatAction, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 });
    pauseBeat(tl, 0.85);
    tl.call(() => {
      setStoryPhase('community', 'result');
      setStepLabel(panel, 'Result · Directory ready');
      setCaption('community', 'Benefit — find members & RSVP to events');
      toggleHighlight(dashDirectory, true);
    });
    pauseBeat(tl, DEMO.result);
    tl.call(() => toggleHighlight(dashDirectory, false));
    pauseBeat(tl, DEMO.betweenFeatures);

    master.add(f1);
    f2 = gsap.timeline();
    tl = f2;

    /* Feature 2 — Verified identity */
    tl.call(() => {
      setActiveFeature('community', 2);
      setStoryPhase('community', 'input');
      setStepLabel(panel, 'User action · Verify member ID');
      setCaption('community', 'Feature 2 — User submits ID verification');
    });
    simulateTap(tl, startVerify);
    crossfadeAppView(tl, 'community', 'verify', 0.38);
    tl.call(() => {
      setStoryPhase('community', 'action');
      setStepLabel(panel, 'Community Forum · ID verification');
      setCaption('community', 'Product — moderation & zero fake profiles');
    });
    animateProcSteps(tl, panel, '[data-seq="verify-loading"]', 2);
    tl.call(() => {
      setStoryPhase('community', 'result');
      setStepLabel(panel, 'Result · Trusted member');
    })
      .to(verify, { opacity: 1, y: 0, duration: 0.42 })
      .call(() => {
        toggleHighlight(verify, true);
        setCaption('community', 'Benefit — verified identity unlocks community tools');
      });
    pauseBeat(tl, DEMO.result);
    tl.call(() => toggleHighlight(verify, false));
    pauseBeat(tl, DEMO.betweenFeatures);

    master.add(f2);
    f3 = gsap.timeline();
    tl = f3;

    /* Feature 3 — Multi-service hub */
    tl.call(() => {
      setActiveFeature('community', 3);
      setStoryPhase('community', 'input');
      setStepLabel(panel, 'User action · Open Services tab');
      setCaption('community', 'Feature 3 — User opens multi-service hub');
    });
    simulateTap(tl, navServices);
    crossfadeAppView(tl, 'community', 'services', 0.38);
    tl.call(() => {
      setStoryPhase('community', 'action');
      setStepLabel(panel, 'Community Forum · Service modules');
      setCaption('community', 'Product — directory, marketplace, matrimony & more');
    })
      .to(thread1, { opacity: 1, y: 0, duration: 0.38 })
      .to(thread2, { opacity: 1, y: 0, duration: 0.38 })
      .to(services, { opacity: 1, y: 0, duration: 0.35 });
    serviceItems.forEach((item, idx) => {
      tl.fromTo(item, { scale: 0.92, opacity: 0.45 }, { scale: 1, opacity: 1, duration: 0.32, ease: 'power2.out' });
      if (idx === serviceItems.length - 1) {
        tl.call(() => {
          setStoryPhase('community', 'result');
          setStepLabel(panel, 'Result · Modules active');
          setCaption('community', 'Benefit — seven services in one platform');
          toggleHighlight(services, true);
        });
      }
    });
    pauseBeat(tl, DEMO.result);
    tl.call(() => toggleHighlight(services, false));
    pauseBeat(tl, DEMO.betweenFeatures);

    master.add(f3);
    f4 = gsap.timeline();
    tl = f4;

    /* Feature 4 — Engagement & notifications */
    tl.call(() => {
      setActiveFeature('community', 4);
      setStoryPhase('community', 'input');
      setStepLabel(panel, 'User action · Open Hub');
      setCaption('community', 'Feature 4 — User checks engagement hub');
    });
    simulateTap(tl, navHub);
    crossfadeAppView(tl, 'community', 'hub', 0.38);
    tl.call(() => {
      setStoryPhase('community', 'action');
      setStepLabel(panel, 'Community Forum · Notifications');
      setCaption('community', 'Product — push, email alerts & moderation');
    })
      .fromTo(floatResult, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.42 })
      .to(hubSeq, { opacity: 1, y: 0, duration: 0.36, stagger: 0.1 })
      .to(success, { opacity: 1, y: 0, duration: 0.4 });
    tl.call(() => {
      setStoryPhase('community', 'result');
      setStepLabel(panel, 'Result · Unified hub');
      setCaption('community', 'Benefit — SEO-friendly threads with instant alerts');
      toggleHighlight(success, true);
    });
    pauseBeat(tl, DEMO.result);
    tl.call(() => toggleHighlight(success, false));

    master.add(f4);
    featureClips.community = [null, f1, f2, f3, f4];
    introClips.community = introSeg;
    return master;
  };

  const buildTravelTimeline = () => {
    if (travelAutoDemo) {
      return gsap.timeline({ paused: true });
    }
    const panel = root.querySelector('[data-vani-prod-panel="traveljioo"]');
    const stage = panel.querySelector('.vani-prod-demo-stage');
    const dashSeq = panel.querySelectorAll('[data-app-view="dashboard"] .vani-prod-seq');
    const dashPipeline = panel.querySelector('[data-seq="dash-pipeline"]');
    const newLeadToast = panel.querySelector('[data-seq="new-lead-toast"]');
    const navLead = panel.querySelector('[data-seq="nav-lead"]');
    const navBooked = panel.querySelector('[data-seq="nav-booked"]');
    const lead = panel.querySelector('[data-seq="lead"]');
    const pipes = panel.querySelectorAll('[data-pipe]');
    const followup = panel.querySelector('[data-seq="followup"]');
    const due = panel.querySelector('.vani-prod-followup-due');
    const done = panel.querySelector('.vani-prod-followup-done');
    const itinLoad = panel.querySelector('[data-seq="itinerary-loading"]');
    const bookedSeq = panel.querySelectorAll('[data-app-view="booked"] .vani-prod-seq');
    const success = panel.querySelector('[data-seq="success"]');
    const floatInput = panel.querySelector('[data-seq="float-input"]');
    const floatAction = panel.querySelector('[data-seq="float-action"]');
    const floatResult = panel.querySelector('[data-seq="float-result"]');

    resetTravel();
    gsap.set(stage, { opacity: 0, scale: 0.94, y: 12 });

    const master = gsap.timeline({ paused: true, repeat: -1, repeatDelay: DEMO.repeatDelay, onRepeat: resetTravel });
    const introSeg = gsap.timeline();
    let tl = introSeg;
    let f1;
    let f2;
    let f3;
    let f4;

    tl.to(stage, { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: 'power2.out' })
      .call(() => {
        setStoryPhase('traveljioo', 'input');
        setCaption('traveljioo', 'TravelJioo — automated CRM feature tour');
        setStepLabel(panel, 'Step 1 · Phone ready');
      });
    pauseBeat(tl, 0.75);
    tl.call(() => {
      setStepLabel(panel, 'Step 2 · Revenue dashboard');
      setCaption('traveljioo', 'Home — pipeline value & deal count');
    })
      .fromTo(floatInput, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 })
      .to(dashSeq, { opacity: 1, y: 0, duration: 0.38, stagger: 0.09 });
    pauseBeat(tl);

    master.add(introSeg);
    f1 = gsap.timeline();
    tl = f1;

    /* Feature 1 — Deal pipeline tracking */
    tl.call(() => {
      setActiveFeature('traveljioo', 1);
      setStoryPhase('traveljioo', 'input');
      setStepLabel(panel, 'User action · View pipeline');
      setCaption('traveljioo', 'Feature 1 — User opens deal pipeline');
    });
    simulateTap(tl, dashPipeline);
    tl.call(() => {
      setStoryPhase('traveljioo', 'action');
      setStepLabel(panel, 'TravelJioo · Pipeline tracking');
      setCaption('traveljioo', 'Product — live deal stages for tour operators');
    })
      .fromTo(floatAction, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 });
    pauseBeat(tl, 0.85);
    tl.call(() => {
      setStoryPhase('traveljioo', 'result');
      setStepLabel(panel, 'Result · Pipeline visible');
      setCaption('traveljioo', 'Benefit — revenue visibility across every stage');
      toggleHighlight(dashPipeline, true);
    });
    pauseBeat(tl, DEMO.result);
    tl.call(() => toggleHighlight(dashPipeline, false));
    pauseBeat(tl, DEMO.betweenFeatures);

    master.add(f1);
    f2 = gsap.timeline();
    tl = f2;

    /* Feature 2 — Lead capture */
    tl.call(() => {
      setActiveFeature('traveljioo', 2);
      setStoryPhase('traveljioo', 'input');
      setStepLabel(panel, 'User action · Open new lead');
      setCaption('traveljioo', 'Feature 2 — Inbound inquiry arrives');
    });
    revealToast(tl, newLeadToast);
    simulateTap(tl, newLeadToast);
    simulateTap(tl, navLead);
    crossfadeAppView(tl, 'traveljioo', 'lead', 0.38);
    tl.call(() => {
      setStoryPhase('traveljioo', 'action');
      setStepLabel(panel, 'TravelJioo · Lead ingestion');
      setCaption('traveljioo', 'Product — John Smith · Bali & Singapore · ₹85,000');
    })
      .to(lead, { opacity: 1, y: 0, duration: 0.4 })
      .call(() => toggleHighlight(lead, true));
    pauseBeat(tl, DEMO.result);
    tl.call(() => {
      setStoryPhase('traveljioo', 'result');
      setStepLabel(panel, 'Result · Lead captured');
      setCaption('traveljioo', 'Benefit — every inquiry logged in CRM');
      toggleHighlight(lead, false);
    });
    pauseBeat(tl, DEMO.betweenFeatures);

    master.add(f2);
    f3 = gsap.timeline();
    tl = f3;

    /* Feature 3 — Follow-up automation & pipeline advance */
    tl.call(() => {
      setActiveFeature('traveljioo', 3);
      setStoryPhase('traveljioo', 'action');
      setStepLabel(panel, 'TravelJioo · Follow-up automation');
      setCaption('traveljioo', 'Feature 3 — Pipeline moves · follow-up task runs');
    });
    pipes.forEach((pipe, idx) => {
      tl.call(() => {
        setStepLabel(panel, `Processing · Stage ${idx + 1} of ${pipes.length}`);
        pipes.forEach((p, j) => {
          p.classList.toggle('is-done', j < idx);
          p.classList.toggle('is-active', j === idx);
        });
      });
      pauseBeat(tl, 0.78);
    });
    tl.to(followup, { opacity: 1, y: 0, duration: 0.35 })
      .call(() => setStepLabel(panel, 'Processing · Follow-up due → completed'));
    pauseBeat(tl, 0.75);
    tl.call(() => {
      if (due) due.hidden = true;
      if (done) done.hidden = false;
      setStoryPhase('traveljioo', 'result');
      setStepLabel(panel, 'Result · Follow-up completed');
      setCaption('traveljioo', 'Benefit — automated tasks so no lead is missed');
    });
    pauseBeat(tl, DEMO.betweenFeatures);

    master.add(f3);
    f4 = gsap.timeline();
    tl = f4;

    /* Feature 4 — Itinerary builder & booking */
    tl.call(() => {
      setActiveFeature('traveljioo', 4);
      setStoryPhase('traveljioo', 'action');
      setStepLabel(panel, 'TravelJioo · Itinerary & invoicing');
      setCaption('traveljioo', 'Feature 4 — Product compiles voucher & supplier invoice');
      if (itinLoad) itinLoad.hidden = false;
    });
    animateProcSteps(tl, panel, '[data-seq="itinerary-loading"]', 1, 0.85);
    tl.call(() => {
      if (itinLoad) itinLoad.hidden = true;
      setStoryPhase('traveljioo', 'input');
      setStepLabel(panel, 'User action · View booking');
    });
    simulateTap(tl, navBooked);
    crossfadeAppView(tl, 'traveljioo', 'booked', 0.38);
    tl.call(() => {
      setStoryPhase('traveljioo', 'result');
      setStepLabel(panel, 'Result · Booking confirmed');
      setCaption('traveljioo', 'Benefit — PDF voucher, payment & agent commission logged');
    })
      .fromTo(floatResult, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.42 })
      .to(bookedSeq, { opacity: 1, y: 0, duration: 0.36, stagger: 0.1 })
      .to(success, { opacity: 1, y: 0, duration: 0.4 })
      .call(() => toggleHighlight(success, true));
    pauseBeat(tl, DEMO.result);
    tl.call(() => toggleHighlight(success, false));

    master.add(f4);
    featureClips.traveljioo = [null, f1, f2, f3, f4];
    introClips.traveljioo = introSeg;
    return master;
  };

  timelines.aitalksy = buildAitalksyTimeline();
  timelines.community = buildCommunityTimeline();
  timelines.traveljioo = buildTravelTimeline();

  const isProductsInViewport = () => {
    const rect = root.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < vh * 0.88 && rect.bottom > vh * 0.05;
  };

  const panelNodes = [...root.querySelectorAll('.vani-prod-panel[data-vani-prod-panel]')];
  const isStackedLayout = root.classList.contains('vani-prod-stacked');

  const pickVisiblePanelKey = (visibilityMap) => {
    let bestKey = activeKey || 'aitalksy';
    let bestRatio = 0;
    Object.entries(visibilityMap).forEach(([key, ratio]) => {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestKey = key;
      }
    });
    return bestRatio >= 0.18 ? bestKey : null;
  };

  const markRevealComplete = () => {
    revealComplete = true;
    if (sectionInView || isProductsInViewport()) {
      sectionInView = true;
      if (!root.classList.contains('vani-prod-stacked')) {
        play(activeKey || 'aitalksy');
      } else {
        const panelVisibility = { aitalksy: 0, community: 0, traveljioo: 0 };
        panelNodes.forEach((panel) => {
          const key = panel.getAttribute('data-vani-prod-panel');
          if (!key) return;
          const rect = panel.getBoundingClientRect();
          const vh = window.innerHeight || document.documentElement.clientHeight;
          const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
          panelVisibility[key] = visible / Math.max(1, Math.min(rect.height, vh));
        });
        const key = pickVisiblePanelKey(panelVisibility);
        if (key) play(key);
        else play('aitalksy');
      }
    }
    if (travelPreview?.onRevealComplete) travelPreview.onRevealComplete();
  };

  const syncFeatureNavUI = (panelKey, index) => {
    const panel = root.querySelector(`[data-vani-prod-panel="${panelKey}"]`);
    if (!panel) return;
    panel.querySelectorAll('[data-vani-feature-dot]').forEach((dot) => {
      const n = parseInt(dot.getAttribute('data-vani-feature-dot') || '0', 10);
      const on = n === index;
      dot.classList.toggle('is-active', on);
      dot.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    const prev = panel.querySelector('[data-vani-feature-prev]');
    const next = panel.querySelector('[data-vani-feature-next]');
    if (prev) prev.disabled = index <= 1;
    if (next) next.disabled = index >= 4;
  };

  const goToFeature = (panelKey, index) => {
    if (index < 1 || index > 4) return;
    ensureVaniProdStackPanelsVisible(root);
    activeKey = panelKey;
    userDriving = true;
    root.classList.add('vani-prod-user-driving');
    Object.values(timelines).forEach((tl) => tl.pause());
    userFeatureIndex[panelKey] = index;
    if (userFeatureTl) userFeatureTl.kill();

    const clip = featureClips[panelKey]?.[index];
    if (!clip) return;

    if (index > 1) {
      if (panelKey === 'aitalksy') primeAitalksyForFeature(index);
      else if (panelKey === 'community') primeCommunityForFeature(index);
      else if (panelKey === 'traveljioo') primeTravelForFeature(index);
    } else if (panelKey === 'aitalksy') resetAitalksy();
    else if (panelKey === 'community') resetCommunity();
    else if (panelKey === 'traveljioo') resetTravel();

    userFeatureTl = gsap.timeline({
      onComplete: () => startFloat(panelKey),
    });
    if (index === 1 && introClips[panelKey]) userFeatureTl.add(introClips[panelKey]);
    userFeatureTl.add(clip);
    syncFeatureNavUI(panelKey, index);
    userFeatureTl.play();
    stopFloat();
  };

  const resumeAutoDemo = (panelKey) => {
    userDriving = false;
    root.classList.remove('vani-prod-user-driving');
    if (userFeatureTl) {
      userFeatureTl.kill();
      userFeatureTl = null;
    }
    userFeatureIndex[panelKey] = 0;
    play(panelKey, { forceAuto: true });
  };

  const bindFeatureExplore = () => {
    const panelKeys = ['aitalksy', 'community', 'traveljioo'];
    panelKeys.forEach((panelKey) => {
      const panel = root.querySelector(`[data-vani-prod-panel="${panelKey}"]`);
      if (!panel) return;
      if (panelKey === 'community' && communityInteractive) return;
      if (panelKey === 'traveljioo' && travelAutoDemo) return;

      panel.querySelectorAll('[data-vani-feature]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.getAttribute('data-vani-feature') || '1', 10);
          goToFeature(panelKey, index);
        });
      });

      panel.querySelectorAll('[data-vani-feature-dot]').forEach((dot) => {
        dot.addEventListener('click', () => {
          const index = parseInt(dot.getAttribute('data-vani-feature-dot') || '1', 10);
          goToFeature(panelKey, index);
        });
      });

      panel.querySelector('[data-vani-feature-prev]')?.addEventListener('click', () => {
        const cur = userFeatureIndex[panelKey] || 1;
        goToFeature(panelKey, Math.max(1, cur - 1));
      });

      panel.querySelector('[data-vani-feature-next]')?.addEventListener('click', () => {
        const cur = userFeatureIndex[panelKey] || 1;
        goToFeature(panelKey, Math.min(4, cur + 1));
      });

      panel.querySelector('[data-vani-feature-resume]')?.addEventListener('click', () => {
        resumeAutoDemo(panelKey);
      });

      const swipeZone = panel.querySelector('[data-vani-swipe-zone]');
      if (swipeZone) {
        let startX = 0;
        swipeZone.addEventListener(
          'touchstart',
          (e) => {
            startX = e.changedTouches[0]?.clientX || 0;
          },
          { passive: true }
        );
        swipeZone.addEventListener(
          'touchend',
          (e) => {
            const dx = (e.changedTouches[0]?.clientX || 0) - startX;
            if (Math.abs(dx) < 48) return;
            const cur = userFeatureIndex[panelKey] || 1;
            if (dx < 0) goToFeature(panelKey, Math.min(4, cur + 1));
            else goToFeature(panelKey, Math.max(1, cur - 1));
          },
          { passive: true }
        );
      }
    });
  };

  let aitalksyDemoPaused = false;

  const setPaused = (panelKey, paused) => {
    if (panelKey !== 'aitalksy') return;
    aitalksyDemoPaused = paused;
    const tl = timelines.aitalksy;
    if (paused) {
      tl?.pause();
      userFeatureTl?.pause();
      stopFloat();
    } else {
      startFloat('aitalksy');
      if (userDriving && userFeatureTl) userFeatureTl.play();
      else tl?.play();
    }
  };

  const play = (key, opts = {}) => {
    if (!sectionInView || !revealComplete) {
      activeKey = key;
      return;
    }
    if (userDriving && !opts.forceAuto) return;
    const tlExisting = timelines[key];
    if (!opts.forceAuto && key === activeKey && tlExisting?.isActive?.()) return;

    activeKey = key;
    userDriving = false;
    root.classList.remove('vani-prod-user-driving');
    if (userFeatureTl) {
      userFeatureTl.kill();
      userFeatureTl = null;
    }
    userFeatureIndex[key] = 0;
    Object.entries(timelines).forEach(([k, tl]) => {
      if (k !== key) tl.pause(0);
    });
    const tl = timelines[key];
    if (tl) {
      if (key === 'aitalksy') resetAitalksy();
      if (key === 'community') {
        if (communityInteractive) {
          communityPreview?.onPanelPlay?.();
          return;
        }
        resetCommunity();
      }
      if (key === 'traveljioo') {
        if (travelAutoDemo) {
          travelPreview?.onPanelPlay?.();
          return;
        }
        resetTravel();
      }
      if (key === 'community' && communityInteractive) return;
      if (key === 'traveljioo' && travelAutoDemo) return;
      tl.restart(true);
      if (key === 'aitalksy' && aitalksyDemoPaused) tl.pause();
      startFloat(key);
      syncFeatureNavUI(key, 0);
      panelKeysClearDots(key);
    }
  };

  const panelKeysClearDots = (panelKey) => {
    const panel = root.querySelector(`[data-vani-prod-panel="${panelKey}"]`);
    panel?.querySelectorAll('[data-vani-feature-dot]').forEach((dot) => {
      dot.classList.remove('is-active');
      dot.setAttribute('aria-selected', 'false');
    });
    const prev = panel?.querySelector('[data-vani-feature-prev]');
    const next = panel?.querySelector('[data-vani-feature-next]');
    if (prev) prev.disabled = true;
    if (next) next.disabled = false;
  };

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          sectionInView = entry.isIntersecting;
          if (!sectionInView) pauseAll();
          else if (revealComplete && !isStackedLayout) play(activeKey || 'aitalksy');
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -4% 0px' }
    );
    sectionObserver.observe(root);

    if (isStackedLayout && panelNodes.length) {
      const panelVisibility = { aitalksy: 0, community: 0, traveljioo: 0 };
      const panelObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const key = entry.target.getAttribute('data-vani-prod-panel');
            if (!key) return;
            panelVisibility[key] = entry.isIntersecting ? entry.intersectionRatio : 0;
          });
          if (!sectionInView || !revealComplete || userDriving) return;
          const key = pickVisiblePanelKey(panelVisibility);
          if (key) play(key);
        },
        { threshold: [0, 0.12, 0.22, 0.35, 0.5], rootMargin: '0px 0px -8% 0px' }
      );
      panelNodes.forEach((panel) => panelObserver.observe(panel));
    }
  } else {
    sectionInView = true;
    play('aitalksy');
  }

  return {
    play,
    markRevealComplete,
    bindFeatureExplore,
    setAppView,
    goToFeature,
    resumeAutoDemo,
    setPaused,
  };
}

/**
 * Cinematic Product Story Controller for MAIN PRODUCTS
 * Phase 6: AI Talksy 7-Scene Product Story
 * USER → MESSAGE → AI → PROCESSING → RESPONSE → BUSINESS CONNECTION → RESULT
 * Powered by GPU-friendly GSAP transitions, Canvas Neural Background, and Viewport Detection.
 */
function initCinematicProductStories() {
  if (!document.getElementById('story-aitalksy')) return;

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
      name: 'TravelJioo',
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

/**
 * Premium product showcase — isolated above #products (#product-showcase)
 */
function initProductShowcase() {
  const root = document.getElementById('product-showcase');
  if (!root) return;

  const tabs = root.querySelectorAll('.showcase-tab[data-showcase-tab]');
  const panels = root.querySelectorAll('.showcase-panel[data-showcase-product]');
  if (!tabs.length || !panels.length) return;

  let reducedMotion = false;
  try {
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = motionMedia.matches;
    motionMedia.addEventListener('change', (e) => {
      reducedMotion = e.matches;
      killShowcaseMotion();
      const activeKey = root.querySelector('.showcase-panel.is-active')?.getAttribute('data-showcase-product');
      if (activeKey) {
        const panel = root.querySelector(`.showcase-panel[data-showcase-product="${activeKey}"]`);
        if (panel) {
          resetShowcasePanel(panel, activeKey);
          applyShowcaseFinalState(panel, activeKey);
        }
      }
    });
  } catch (err) {}

  let showcaseTimeline = null;
  let showcaseInView = false;
  let pendingKey = null;
  let showcaseLoopTimer = null;

  const SHOWCASE_STEP_STATE = {
    aitalksy: [
      { toast: 'Inbox — visitor opened AI Talksy Assistant', status: 'Online', icon: 'fa-inbox' },
      { toast: 'Customer typing: "Hello, I need help."', status: 'Live input', icon: 'fa-keyboard' },
      { toast: 'AI understanding intent · generating response', status: 'AI thinking', icon: 'fa-brain' },
      { toast: 'Auto response delivered in < 0.4s', status: 'Responded', icon: 'fa-reply' },
      { toast: 'Lead captured · WhatsApp, Web & Slack synced', status: 'Automating', icon: 'fa-network-wired' },
      { toast: 'Customer inquiry resolved ✓', status: 'Complete', icon: 'fa-circle-check' }
    ],
    community: [
      { toast: 'Members connecting into Your Community', status: 'Connecting', icon: 'fa-users' },
      { toast: 'Trust network unified — community linked', status: 'Unified', icon: 'fa-link' },
      { toast: 'Verifying government ID — zero fake profiles', status: 'Verifying', icon: 'fa-shield-halved' },
      { toast: '7 services: Directory, Matrimony, Marketplace…', status: 'Multi-service', icon: 'fa-table-cells' },
      { toast: 'One digital platform for your community ✓', status: 'Connected', icon: 'fa-cube' },
      { toast: 'One digital platform for your community ✓', status: 'Connected', icon: 'fa-cube' }
    ],
    ratehonk: [
      { toast: 'New lead: John Smith · ₹85,000 package', status: 'Lead in', icon: 'fa-briefcase' },
      { toast: 'Lead ingested into 5-stage sales pipeline', status: 'Pipeline', icon: 'fa-chart-simple' },
      { toast: 'Follow-up due → ✓ completed · WhatsApp sent', status: 'Follow-up', icon: 'fa-clock' },
      { toast: 'Flight & hotel voucher compiled (demo)', status: 'Itinerary', icon: 'fa-file-invoice' },
      { toast: 'Booking confirmed · ₹85,000 payment received', status: 'Booked', icon: 'fa-circle-check' },
      { toast: 'Customer converted · demo deal logged ✓', status: 'Converted', icon: 'fa-trophy' }
    ]
  };

  const setShowcaseCommPane = (panel, index) => {
    panel.querySelectorAll('[data-showcase-comm-pane]').forEach((pane) => {
      const idx = parseInt(pane.getAttribute('data-showcase-comm-pane') || '0', 10);
      const active = idx === index;
      pane.classList.toggle('is-active', active);
      if (active) pane.removeAttribute('hidden');
      else pane.setAttribute('hidden', '');
    });
    panel.querySelectorAll('.showcase-service-chip').forEach((chip, i) => chip.classList.toggle('is-active', i === index));
  };

  const setShowcaseSync = (panel, syncIndex) => {
    panel.querySelectorAll('[data-showcase-sync]').forEach((floatEl) => {
      const idx = parseInt(floatEl.getAttribute('data-showcase-sync') || '-1', 10);
      floatEl.classList.toggle('is-sync-active', idx === syncIndex);
    });
  };

  const pulseShowcaseToast = (toast) => {
    if (!toast || reducedMotion) return;
    toast.classList.remove('showcase-toast-pulse');
    void toast.offsetWidth;
    toast.classList.add('showcase-toast-pulse');
  };

  const pulseShowcaseStatus = (statusEl) => {
    if (!statusEl || reducedMotion) return;
    statusEl.classList.remove('showcase-status-updating');
    void statusEl.offsetWidth;
    statusEl.classList.add('showcase-status-updating');
  };

  const setShowcasePhoneState = (panel, key, syncIndex) => {
    const steps = SHOWCASE_STEP_STATE[key];
    const state = steps ? steps[Math.min(syncIndex, steps.length - 1)] : null;
    if (!state) return;
    const toast = panel.querySelector('[data-showcase-live-toast]');
    if (toast) {
      const textSpan = toast.querySelector('span');
      const icon = toast.querySelector('i');
      if (textSpan) textSpan.textContent = state.toast;
      if (icon) icon.className = `fa-solid ${state.icon}`;
      pulseShowcaseToast(toast);
    }
    const statusEl = panel.querySelector('[data-showcase-status]');
    if (statusEl) {
      statusEl.innerHTML = `<span class="showcase-status-dot"></span> ${state.status}`;
      pulseShowcaseStatus(statusEl);
    }
    setShowcaseSync(panel, Math.min(syncIndex, 4));
  };

  const killShowcaseMotion = () => {
    if (showcaseTimeline) {
      showcaseTimeline.kill();
      showcaseTimeline = null;
    }
    if (showcaseLoopTimer) {
      clearTimeout(showcaseLoopTimer);
      showcaseLoopTimer = null;
    }
    if (typeof gsap !== 'undefined') {
      root.querySelectorAll('.showcase-panel .showcase-seq-phone, .showcase-phone-3d, .showcase-seq-float, .showcase-seq-reveal, .showcase-seq-screen-item, .showcase-connector-path, .showcase-orbit-chip').forEach((el) => {
        gsap.killTweensOf(el);
      });
    }
  };

  const resetShowcasePanel = (panel, key) => {
    panel.classList.remove('showcase-idle');
    const phone = panel.querySelector('.showcase-seq-phone');
    const phone3d = panel.querySelector('.showcase-phone-3d');
    const featureFloats = panel.querySelectorAll('.showcase-seq-float');
    const reveals = panel.querySelectorAll('.showcase-seq-reveal');
    const screenItems = panel.querySelectorAll('.showcase-seq-screen-item');
    if (typeof gsap !== 'undefined') {
      [phone, phone3d, ...featureFloats, ...reveals, ...screenItems].forEach((el) => {
        if (el) gsap.set(el, { clearProps: 'all' });
      });
    }
    featureFloats.forEach((el) => { el.style.opacity = '0'; el.style.visibility = 'visible'; });
    reveals.forEach((el) => { el.style.opacity = '0'; el.style.visibility = 'hidden'; });
    screenItems.forEach((el) => { el.style.opacity = '0'; });
    panel.querySelectorAll('.showcase-proc-step').forEach((step) => step.classList.remove('is-active'));
    panel.querySelectorAll('.showcase-connector-path').forEach((path) => {
      path.style.opacity = '0.35';
      if (path.getTotalLength) {
        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len}`;
        path.style.strokeDashoffset = `${len}`;
      }
    });
    if (key === 'aitalksy') {
      const typeEl = panel.querySelector('.showcase-anim-type');
      if (typeEl) typeEl.textContent = '';
    }
    if (key === 'community') {
      setShowcaseCommPane(panel, 0);
      const verifyToast = panel.querySelector('[data-showcase-verify-toast]');
      if (verifyToast) { verifyToast.style.opacity = '0'; verifyToast.style.visibility = 'hidden'; }
    }
    if (key === 'ratehonk') {
      const pipeline = panel.querySelector('[data-showcase-pipeline]');
      if (pipeline) pipeline.querySelectorAll('span').forEach((stage, idx) => stage.classList.toggle('is-active', idx === 0));
      const follow = panel.querySelector('[data-showcase-followup]');
      if (follow) {
        follow.classList.add('showcase-followup-due');
        follow.classList.remove('showcase-followup-done');
        const due = follow.querySelector('.showcase-followup-due-text');
        const done = follow.querySelector('.showcase-followup-done-text');
        if (due) due.hidden = false;
        if (done) done.hidden = true;
      }
      panel.querySelectorAll('[data-showcase-booking]').forEach((el) => { el.style.opacity = '0'; el.style.visibility = 'hidden'; });
      const itinerary = panel.querySelector('[data-showcase-phase="itinerary"]');
      if (itinerary) { itinerary.style.opacity = '0'; itinerary.style.visibility = 'hidden'; }
    }
    setShowcasePhoneState(panel, key, 0);
  };

  const applyShowcaseFinalState = (panel, key) => {
    panel.classList.add('showcase-idle');
    const phone = panel.querySelector('.showcase-seq-phone');
    const featureFloats = panel.querySelectorAll('.showcase-seq-float');
    const reveals = panel.querySelectorAll('.showcase-seq-reveal');
    const screenItems = panel.querySelectorAll('.showcase-seq-screen-item');
    if (phone) { phone.style.opacity = '1'; phone.style.transform = 'none'; }
    featureFloats.forEach((el) => { el.style.opacity = '1'; el.style.transform = ''; });
    reveals.forEach((el) => { el.style.opacity = '1'; el.style.visibility = 'visible'; });
    screenItems.forEach((el) => { el.style.opacity = '1'; });
    panel.querySelectorAll('.showcase-proc-step').forEach((step) => step.classList.add('is-active'));
    panel.querySelectorAll('.showcase-connector-path').forEach((path) => { path.style.strokeDashoffset = '0'; path.style.opacity = '0.55'; });
    if (key === 'aitalksy') {
      const typeEl = panel.querySelector('.showcase-anim-type');
      if (typeEl) typeEl.textContent = typeEl.getAttribute('data-showcase-type') || '';
    }
    if (key === 'community') {
      setShowcaseCommPane(panel, 3);
      const verifyToast = panel.querySelector('[data-showcase-verify-toast]');
      if (verifyToast) { verifyToast.style.opacity = '1'; verifyToast.style.visibility = 'visible'; }
    }
    if (key === 'ratehonk') {
      const pipeline = panel.querySelector('[data-showcase-pipeline]');
      if (pipeline) pipeline.querySelectorAll('span').forEach((stage, idx) => stage.classList.toggle('is-active', idx === 4));
      const follow = panel.querySelector('[data-showcase-followup]');
      if (follow) {
        follow.classList.remove('showcase-followup-due');
        follow.classList.add('showcase-followup-done');
        const due = follow.querySelector('.showcase-followup-due-text');
        const done = follow.querySelector('.showcase-followup-done-text');
        if (due) due.hidden = true;
        if (done) done.hidden = false;
      }
      const booking = panel.querySelector('[data-showcase-booking]');
      if (booking) { booking.style.opacity = '1'; booking.style.visibility = 'visible'; }
    }
    setShowcasePhoneState(panel, key, 4);
  };

  const scheduleShowcaseLoop = (panel, key) => {
    if (showcaseLoopTimer) { clearTimeout(showcaseLoopTimer); showcaseLoopTimer = null; }
    if (reducedMotion || !showcaseInView) return;
    showcaseLoopTimer = setTimeout(() => {
      if (!showcaseInView) return;
      const k = panel.getAttribute('data-showcase-product');
      if (k === key && panel.classList.contains('is-active')) runShowcaseSequence(panel, key);
    }, 2800);
  };

  const animateConnectorPaths = (panel, tl, startAt) => {
    panel.querySelectorAll('.showcase-connector-path').forEach((path, idx) => {
      if (!path.getTotalLength) return;
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
      tl.to(path, { strokeDashoffset: 0, opacity: 0.55, duration: 0.55, ease: 'power1.out' }, startAt + idx * 0.12);
    });
  };

  const revealShowcaseEl = (tl, el, at, offset = 0) => {
    if (!el) return;
    tl.set(el, { visibility: 'visible' }, at + offset);
    tl.fromTo(el, { opacity: 0, y: 6, scale: 0.98, force3D: true }, { opacity: 1, y: 0, scale: 1, duration: 0.38, ease: 'power3.out', force3D: true }, at + offset);
  };

  const runShowcaseInPhoneDemo = (panel, key, tl, at) => {
    const demoNote = panel.querySelector('.showcase-demo-note');
    if (key === 'aitalksy') {
      const typeEl = panel.querySelector('.showcase-anim-type');
      const full = typeEl?.getAttribute('data-showcase-type') || '';
      const proc = panel.querySelector('.showcase-processing');
      const procSteps = panel.querySelectorAll('.showcase-proc-step');
      tl.call(() => setShowcasePhoneState(panel, key, 0), null, at);
      if (typeEl && full) {
        const proxy = { i: 0 };
        tl.to(proxy, { i: full.length, duration: Math.max(0.45, full.length * 0.04), ease: 'none', onUpdate: () => { typeEl.textContent = full.slice(0, Math.round(proxy.i)); } }, at);
      }
      tl.call(() => setShowcasePhoneState(panel, key, 1), null, at + 0.3);
      if (proc) {
        tl.set(proc, { visibility: 'visible', opacity: 0 }, at + 0.32);
        tl.to(proc, { opacity: 1, duration: 0.28 }, at + 0.35);
        procSteps.forEach((step, idx) => {
          tl.call(() => { procSteps.forEach((s) => s.classList.remove('is-active')); step.classList.add('is-active'); }, null, at + 0.5 + idx * 0.34);
        });
        tl.to(proc, { opacity: 0, duration: 0.22 }, at + 1.75);
        tl.set(proc, { visibility: 'hidden' }, at + 1.95);
      }
      tl.call(() => setShowcasePhoneState(panel, key, 2), null, at + 1.85);
      revealShowcaseEl(tl, panel.querySelector('[data-showcase-phase="reply"]'), at, 1.9);
      tl.call(() => setShowcasePhoneState(panel, key, 3), null, at + 2.25);
      revealShowcaseEl(tl, panel.querySelector('[data-showcase-phase="automation"]'), at, 2.3);
      tl.call(() => setShowcasePhoneState(panel, key, 4), null, at + 2.65);
      revealShowcaseEl(tl, panel.querySelector('[data-showcase-phase="outcome"]'), at, 2.7);
      revealShowcaseEl(tl, demoNote, at, 2.95);
      return at + 3.2;
    }
    if (key === 'community') {
      const proc = panel.querySelector('.showcase-proc-inline');
      tl.call(() => setShowcasePhoneState(panel, key, 0), null, at);
      tl.call(() => setShowcasePhoneState(panel, key, 1), null, at + 0.35);
      revealShowcaseEl(tl, panel.querySelector('[data-showcase-phase="connected"]'), at, 0.4);
      if (proc) {
        tl.set(proc, { visibility: 'visible' }, at + 0.55);
        tl.fromTo(proc, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.28 }, at + 0.55);
        tl.to(proc, { opacity: 0, duration: 0.22 }, at + 1.05);
        tl.set(proc, { visibility: 'hidden' }, at + 1.2);
      }
      tl.call(() => setShowcasePhoneState(panel, key, 2), null, at + 1.15);
      revealShowcaseEl(tl, panel.querySelector('[data-showcase-verify-toast]'), at, 1.2);
      tl.call(() => setShowcasePhoneState(panel, key, 3), null, at + 1.55);
      [0, 1, 2, 3].forEach((paneIdx) => tl.call(() => setShowcaseCommPane(panel, paneIdx), null, at + 1.65 + paneIdx * 0.38));
      tl.call(() => setShowcasePhoneState(panel, key, 4), null, at + 3.05);
      revealShowcaseEl(tl, panel.querySelector('[data-showcase-phase="outcome"]'), at, 3.1);
      revealShowcaseEl(tl, demoNote, at, 3.35);
      return at + 3.55;
    }
    if (key === 'ratehonk') {
      const stages = panel.querySelectorAll('[data-showcase-pipeline] span');
      const follow = panel.querySelector('[data-showcase-followup]');
      const due = follow?.querySelector('.showcase-followup-due-text');
      const done = follow?.querySelector('.showcase-followup-done-text');
      tl.call(() => setShowcasePhoneState(panel, key, 0), null, at);
      tl.call(() => setShowcasePhoneState(panel, key, 1), null, at + 0.25);
      stages.forEach((stage, idx) => {
        tl.call(() => { stages.forEach((s) => s.classList.remove('is-active')); stage.classList.add('is-active'); }, null, at + 0.4 + idx * 0.28);
      });
      tl.call(() => setShowcasePhoneState(panel, key, 2), null, at + 1.35);
      if (follow) {
        tl.set(follow, { visibility: 'visible' }, at + 1.4);
        tl.fromTo(follow, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.3 }, at + 1.45);
        tl.call(() => { if (due) due.hidden = false; if (done) done.hidden = true; }, null, at + 1.55);
        tl.call(() => { follow.classList.remove('showcase-followup-due'); follow.classList.add('showcase-followup-done'); if (due) due.hidden = true; if (done) done.hidden = false; }, null, at + 1.95);
      }
      tl.call(() => setShowcasePhoneState(panel, key, 3), null, at + 2.05);
      revealShowcaseEl(tl, panel.querySelector('[data-showcase-phase="itinerary"]'), at, 2.1);
      tl.call(() => setShowcasePhoneState(panel, key, 4), null, at + 2.4);
      revealShowcaseEl(tl, panel.querySelector('[data-showcase-booking]'), at, 2.45);
      revealShowcaseEl(tl, panel.querySelector('[data-showcase-phase="outcome"]'), at, 2.75);
      revealShowcaseEl(tl, demoNote, at, 3);
      return at + 3.2;
    }
    return at;
  };

  const runShowcaseSequence = (panel, key) => {
    killShowcaseMotion();
    resetShowcasePanel(panel, key);
    if (reducedMotion || typeof gsap === 'undefined') {
      applyShowcaseFinalState(panel, key);
      return;
    }
    const phone = panel.querySelector('.showcase-seq-phone');
    const phone3d = panel.querySelector('.showcase-phone-3d');
    const featureFloats = panel.querySelectorAll('.showcase-seq-float');
    const screenItems = panel.querySelectorAll('.showcase-seq-screen-item');
    showcaseTimeline = gsap.timeline({
      defaults: { ease: 'power2.out', force3D: true },
      onComplete: () => { panel.classList.add('showcase-idle'); scheduleShowcaseLoop(panel, key); }
    });
    const tl = showcaseTimeline;
    tl.call(() => setShowcasePhoneState(panel, key, 0), null, 0);
    tl.fromTo(phone, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.78, ease: 'power3.out' }, 0);
    if (phone3d) tl.fromTo(phone3d, { opacity: 0, y: 32, rotateY: -12, rotateX: 6 }, { opacity: 1, y: 0, rotateY: -9, rotateX: 4, duration: 0.82, ease: 'power3.out' }, 0.04);
    tl.fromTo(screenItems, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.42, stagger: 0.055, ease: 'power3.out' }, 0.42);
    animateConnectorPaths(panel, tl, 0.52);
    featureFloats.forEach((card, idx) => {
      tl.fromTo(card, { opacity: 0, y: 14, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.48, ease: 'power3.out', onStart: () => setShowcaseSync(panel, idx) }, 0.72 + idx * 0.16);
    });
    runShowcaseInPhoneDemo(panel, key, tl, 1.55);
  };

  const maybeRunSequence = (key) => {
    if (!showcaseInView) { pendingKey = key; return; }
    const panel = root.querySelector(`.showcase-panel[data-showcase-product="${key}"]`);
    if (panel && panel.classList.contains('is-active')) runShowcaseSequence(panel, key);
  };

  const activateShowcase = (key) => {
    root.setAttribute('data-showcase-theme', key === 'community' ? 'emerald' : key === 'ratehonk' ? 'blue' : 'cyan');
    tabs.forEach((tab) => {
      const isActive = tab.getAttribute('data-showcase-tab') === key;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    panels.forEach((panel) => {
      const isActive = panel.getAttribute('data-showcase-product') === key;
      panel.classList.toggle('is-active', isActive);
      if (isActive) panel.removeAttribute('hidden');
      else { panel.setAttribute('hidden', ''); panel.classList.remove('showcase-idle'); }
    });
    maybeRunSequence(key);
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.getAttribute('data-showcase-tab');
      if (key) activateShowcase(key);
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        showcaseInView = entry.isIntersecting;
        if (showcaseInView) {
          const key = pendingKey || root.querySelector('.showcase-panel.is-active')?.getAttribute('data-showcase-product') || 'aitalksy';
          pendingKey = null;
          maybeRunSequence(key);
        } else killShowcaseMotion();
      });
    }, { threshold: 0.22, rootMargin: '0px 0px -8% 0px' });
    observer.observe(root);
  } else showcaseInView = true;

  root.classList.add('showcase-js-ready');
  const initial = root.querySelector('.showcase-tab.is-active');
  activateShowcase(initial ? initial.getAttribute('data-showcase-tab') : 'aitalksy');
}
