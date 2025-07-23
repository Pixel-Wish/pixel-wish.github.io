document.addEventListener('DOMContentLoaded', function() {
  // Detectar touch devices
  const isTouchDevice = 'ontouchstart' in window || 
                        navigator.maxTouchPoints > 0 || 
                        navigator.msMaxTouchPoints > 0;
  
  if (isTouchDevice) {
    document.body.classList.add('touch-device');
    
    // Mejorar feedback táctil
    document.querySelectorAll('.btn, a, button').forEach(el => {
      el.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      });
      
      el.addEventListener('touchend', function() {
        this.classList.remove('touch-active');
      });
    });
  }

  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
  
  // Smooth scrolling for all links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Cerrar menú móvil si está abierto
        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          hamburger.classList.remove('active');
          document.body.style.overflow = '';
        }
        
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Scroll optimizado con debounce
  let isScrolling;
  window.addEventListener('scroll', function() {
    window.clearTimeout(isScrolling);
    
    isScrolling = setTimeout(function() {
      if (window.innerWidth <= 768 && navLinks) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
      
      // Sticky header con optimización
      const header = document.querySelector('header');
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      
      if (scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, 66);
  }, false);
  
  // How it works steps data
  const stepsData = [
    {
      icon: "fas fa-comment-alt",
      title: "Cuéntame tu idea",
      description: "Explícame qué necesitas, para qué ocasión y qué estilo te gusta. ¡No hay límites para tu creatividad!"
    },
    {
      icon: "fas fa-palette",
      title: "Diseño la tarjeta",
      description: "Crearé un diseño único basado en tus preferencias y te lo enviaré para revisión en 24-48 horas."
    },
    {
      icon: "fas fa-magic",
      title: "Ajustes finales",
      description: "Haremos todos los cambios necesarios hasta que quedes 100% satisfecho/a con el resultado."
    },
    {
      icon: "fas fa-paper-plane",
      title: "Recibe y comparte",
      description: "Te enviaré la tarjeta final en formato digital (HTML) para que la compartas con quien quieras."
    }
  ];
  
  // Generate how it works steps
  const stepsContainer = document.querySelector('.steps');
  if (stepsContainer) {
    stepsData.forEach((step, index) => {
      const stepElement = document.createElement('div');
      stepElement.className = 'step';
      stepElement.style.transitionDelay = `${index * 0.1}s`;
      stepElement.innerHTML = `
        <div class="step-icon">
          <i class="${step.icon}"></i>
        </div>
        <h3>${step.title}</h3>
        <p>${step.description}</p>
      `;
      stepsContainer.appendChild(stepElement);
    });
  }
  
  // Intersection Observer para animaciones
  const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observar elementos animables
  document.querySelectorAll('.step, .style-card').forEach(element => {
    if (element) observer.observe(element);
  });
  
  // Precarga optimizada de imágenes
  function preloadImages() {
    const images = [
      'recursos/img/romantico.webp',
      'recursos/img/fiesta.webp',
      'recursos/img/elegante.webp',
      'recursos/img/tarjeta.webp',
      'recursos/img/romantico-small.webp',
      'recursos/img/romantico-medium.webp',
      'recursos/img/fiesta-small.webp',
      'recursos/img/fiesta-medium.webp',
      'recursos/img/elegante-small.webp',
      'recursos/img/elegante-medium.webp'
    ];
    
    const imagePromises = images.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    });
    
    return Promise.all(imagePromises);
  }
  
  // Cargar imágenes críticas primero
  const heroImg = new Image();
  heroImg.src = 'recursos/img/tarjeta.webp';
  
  // Precargar el resto de imágenes después del load
  window.addEventListener('load', function() {
    preloadImages().catch(err => {
      console.error('Error precargando imágenes:', err);
    });
  });
  
  // Prevenir zoom en inputs en móvil
  if (isTouchDevice) {
    let viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.content = viewport.content + ', maximum-scale=1.0';
    }
  }
});