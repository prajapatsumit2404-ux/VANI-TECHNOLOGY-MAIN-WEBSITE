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

  // 8. Backend Connectivity Health Check
  checkBackendHealth();
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
