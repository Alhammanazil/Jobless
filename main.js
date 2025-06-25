// Simple intersection observer for animation on scroll
document.addEventListener('DOMContentLoaded', () => {
  const animatedEls = document.querySelectorAll('.animate-fade-in, .animate-slide-up, .animate-pop');
  const observer = new window.IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedEls.forEach(el => {
    // Pause animation until in view
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
});

// Hamburger menu logic
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const menuMobile = document.querySelector('.menu-mobile');
  const overlay = document.querySelector('.menu-mobile-overlay');
  const menuLinks = menuMobile.querySelectorAll('.menu-item, .sign-up');

  function openMenu() {
    menuMobile.classList.add('open');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menuMobile.classList.remove('open');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  overlay.addEventListener('click', closeMenu);
  menuLinks.forEach(link => link.addEventListener('click', closeMenu));
});
