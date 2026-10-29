// =========================================
// ROUND 8 — app.js
// Cargador de pantallas: por cada <div data-screen="nombre">
//   1. carga screens/nombre/nombre.css
//   2. inserta screens/nombre/nombre.html
//   3. ejecuta init() de screens/nombre/nombre.js
// =========================================

const RUTA = 'screens';

// ---- Carga el CSS de una pantalla y espera a que esté listo ----
const cargarCSS = nombre => new Promise(resolve => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${RUTA}/${nombre}/${nombre}.css`;
  link.onload = link.onerror = resolve;
  document.head.appendChild(link);
});

// ---- Trae el HTML de una pantalla ----
const cargarHTML = async nombre => {
  const res = await fetch(`${RUTA}/${nombre}/${nombre}.html`);
  if (!res.ok) throw new Error(`No se encontró la pantalla "${nombre}"`);
  return res.text();
};

// ---- Animación de aparición al hacer scroll (global) ----
const iniciarRevelar = () => {
  const obs = new IntersectionObserver((entradas, o) => {
    entradas.forEach(entrada => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('visible');
      o.unobserve(entrada.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.revelar').forEach(el => obs.observe(el));
};

const iniciar = async () => {
  const contenedores = [...document.querySelectorAll('[data-screen]')];
  const nombres = contenedores.map(c => c.dataset.screen);

  try {
    // 1 y 2: CSS + HTML de todas las pantallas en paralelo
    await Promise.all(contenedores.map(async cont => {
      const nombre = cont.dataset.screen;
      const [, html] = await Promise.all([cargarCSS(nombre), cargarHTML(nombre)]);
      cont.outerHTML = html;
    }));

    // 3: JS de cada pantalla, en orden, cuando todo el HTML ya existe
    for (const nombre of nombres) {
      const modulo = await import(`../${RUTA}/${nombre}/${nombre}.js`);
      if (typeof modulo.init === 'function') modulo.init();
    }

    iniciarRevelar();

    // Si la URL trae #seccion, bajar a ella (el contenido llegó después de cargar)
    if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
  } catch (error) {
    console.error(error);
    document.body.insertAdjacentHTML('afterbegin', `
      <p class="error-carga">
        No se pudieron cargar las pantallas. Abre el proyecto con un servidor
        (por ejemplo Live Server en VS Code), no con doble clic en index.html.
      </p>`);
  }
};

iniciar();
