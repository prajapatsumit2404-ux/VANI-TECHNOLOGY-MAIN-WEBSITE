/**
 * Vani Technologies - Main JavaScript File
 * Phase 2: Sticky Navbar, Mobile Menu, Scroll Interactions & Stat Counters
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Sticky Navbar on Scroll
  initStickyNavbar();

  // 2. Initialize Mobile Hamburger Menu
  initMobileMenu();

  // 3. Initialize Animated Statistics Counter
  initStatsCounter();

  // 4. Smooth Anchor Link Navigation
  initSmoothScroll();

  // 5. Backend Connectivity Health Check
  checkBackendHealth();
});

/**
 * Changes navbar styling on scroll
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
  // Initial check on page load
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

  // Close mobile menu when clicking any mobile link
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (isOpen) toggle();
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

/**
 * Helper to smoothly animate number from start to end
 */
function animateValue(element, start, end, duration, decimals, suffix) {
  let startTime = null;

  function step(currentTime) {
    if (!startTime) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    // Easing out cubic
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
 * Smooth scrolling for in-page anchors
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navbarHeight = 70;
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
 * Backend Connectivity Checker
 */
function checkBackendHealth() {
  fetch('/api/health')
    .then((res) => res.json())
    .then((data) => {
      const statusBadge = document.getElementById('api-status-badge');
      if (statusBadge) {
        statusBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1.5 animate-pulse"></span>API Active';
        statusBadge.className = 'px-3 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center';
      }
    })
    .catch(() => {
      const statusBadge = document.getElementById('api-status-badge');
      if (statusBadge) {
        statusBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400 inline-block mr-1.5"></span>Offline';
        statusBadge.className = 'px-3 py-1 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center';
      }
    });
}
