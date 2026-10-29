// ===== HEADER / NAVEGACIÓN =====
// Fondo al hacer scroll, menú móvil y link activo según la sección visible

export function init() {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');

  // ---- Fondo del header al hacer scroll ----
  const actualizarHeader = () => header.classList.toggle('scrolled', window.scrollY > 50);
  actualizarHeader();
  window.addEventListener('scroll', actualizarHeader, { passive: true });

  // ---- Menú móvil ----
  const cerrarMenu = () => {
    navMenu.classList.remove('abierto');
    navToggle.classList.remove('abierto');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  navToggle.addEventListener('click', () => {
    const abierto = navMenu.classList.toggle('abierto');
    navToggle.classList.toggle('abierto', abierto);
    navToggle.setAttribute('aria-expanded', String(abierto));
    document.body.style.overflow = abierto ? 'hidden' : '';
  });

  navLinks.forEach(link => link.addEventListener('click', cerrarMenu));

  // ---- Link activo según la sección visible ----
  const secciones = document.querySelectorAll('main section[id]');
  const obs = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      if (!entrada.isIntersecting) return;
      const id = entrada.target.id;
      navLinks.forEach(l => l.classList.toggle('activo', l.getAttribute('href') === `#${id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secciones.forEach(s => obs.observe(s));
}
