/* ================================================
   ASJ AFIAÇÃO SÃO JOSÉ — Interactivity & UX
   Pure Vanilla JavaScript — No dependencies
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ========== HEADER SCROLL EFFECT ==========
  const header = document.getElementById('header');
  let lastScroll = 0;

  function handleHeaderScroll() {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // ========== MOBILE NAVIGATION ==========
  const hamburger = document.getElementById('hamburger');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav__link');
  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    hamburger.classList.toggle('active', isMenuOpen);
    navbar.classList.toggle('active', isMenuOpen);
    hamburger.setAttribute('aria-expanded', isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  }

  function closeMenu() {
    if (isMenuOpen) {
      isMenuOpen = false;
      hamburger.classList.remove('active');
      navbar.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  hamburger.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      closeMenu();
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (isMenuOpen && !navbar.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  // Close menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      closeLightbox();
    }
  });

  // ========== SMOOTH SCROLL WITH OFFSET ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========== SCROLL REVEAL (IntersectionObserver) ==========
  const revealElements = document.querySelectorAll('.reveal');

  const isMobile = window.innerWidth <= 768;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, isMobile ? delay * 80 : delay * 150);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: isMobile ? 0.05 : 0.1,
    rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ========== COPY ADDRESS ==========
  const copyBtn = document.getElementById('copyAddress');
  const toast = document.getElementById('toast');

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const address = copyBtn.dataset.address;
      try {
        await navigator.clipboard.writeText(address);
        showToast('Endereço copiado!');
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = address;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Endereço copiado!');
      }
    });
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 2500);
  }

  // ========== LIGHTBOX ==========
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.querySelector('.lightbox__close');

  // Make gallery images clickable for lightbox
  const galleryImages = document.querySelectorAll('.gallery__img[data-lightbox]');
  galleryImages.forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      const fullImg = document.createElement('img');
      fullImg.src = img.src;
      fullImg.alt = img.alt;
      fullImg.style.cssText = 'max-width: 90vw; max-height: 80vh; object-fit: contain; border-radius: 12px;';
      lightboxContent.innerHTML = '';
      lightboxContent.appendChild(fullImg);

      const caption = img.closest('.gallery__item')?.querySelector('.gallery__caption');
      if (caption) {
        const captionEl = document.createElement('p');
        captionEl.style.cssText = 'text-align: center; color: #E0E0E0; margin-top: 16px; font-size: 1rem;';
        captionEl.textContent = caption.textContent;
        lightboxContent.appendChild(captionEl);
      }

      openLightbox();
    });
  });

  function openLightbox() {
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // ========== HERO PARTICLES ==========
  const particlesContainer = document.getElementById('particles');

  function createParticles() {
    if (!particlesContainer) return;
    const particleCount = window.innerWidth < 768 ? 15 : 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
      particle.style.animationDelay = `${Math.random() * 10}s`;
      particle.style.opacity = `${Math.random() * 0.3 + 0.1}`;

      particlesContainer.appendChild(particle);
    }
  }

  createParticles();

  // ========== ACTIVE NAV LINK HIGHLIGHT ==========
  const sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    const scrollPos = window.scrollY + header.offsetHeight + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('nav__link--active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('nav__link--active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ========== COUNTER ANIMATION ==========
  const statNumbers = document.querySelectorAll('.stat__number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const text = el.textContent.trim();
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const numericValue = parseInt(text.replace(/[^0-9]/g, ''), 10);

    if (isNaN(numericValue) || numericValue <= 10) return;

    const duration = 1500;
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(startValue + (numericValue - startValue) * eased);

      let display = current.toString();
      if (hasPlus) display += '+';
      if (hasPercent) display += '%';
      el.textContent = display;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ========== PRELOAD COMPLETE ==========
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    // Trigger reveal for elements already in viewport
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('revealed');
      }
    });
  });
});
