// ===== GALERÍA =====
// Filtros por categoría y lightbox (visor de imágenes)

export function init() {
  const items = [...document.querySelectorAll('.galeria__item')];
  const filtros = document.querySelectorAll('.filtro');

  const lightbox = document.getElementById('lightbox');
  const lbImagen = document.getElementById('lbImagen');
  const lbTexto = document.getElementById('lbTexto');
  const lbCerrar = document.getElementById('lbCerrar');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  let visibles = [...items];
  let indiceActual = 0;

  // ---- Imagen que no carga: muestra solo el texto ----
  items.forEach(item => {
    const img = item.querySelector('img');
    const marcarSinImagen = () => {
      item.classList.add('sin-imagen');
      img.style.display = 'none';
    };
    img.addEventListener('error', marcarSinImagen);
    // Por si la imagen ya falló antes de que este script se ejecutara
    if (img.complete && img.naturalWidth === 0) marcarSinImagen();
  });

  // ---- Filtros ----
  filtros.forEach(btn => {
    btn.addEventListener('click', () => {
      filtros.forEach(f => f.classList.remove('activo'));
      btn.classList.add('activo');

      const filtro = btn.dataset.filtro;
      items.forEach(item => {
        const mostrar = filtro === 'todos' || item.dataset.categoria === filtro;
        item.classList.toggle('oculto', !mostrar);
      });
      visibles = items.filter(i => !i.classList.contains('oculto'));
    });
  });

  // ---- Lightbox ----
  const mostrar = indice => {
    indiceActual = (indice + visibles.length) % visibles.length;
    const item = visibles[indiceActual];
    const img = item.querySelector('img');
    lbImagen.src = img.src;
    lbImagen.alt = img.alt;
    lbTexto.textContent = item.querySelector('figcaption').textContent;
  };

  const abrir = item => {
    mostrar(visibles.indexOf(item));
    lightbox.classList.add('abierto');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbCerrar.focus();
  };

  const cerrar = () => {
    lightbox.classList.remove('abierto');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  items.forEach(item => item.addEventListener('click', () => abrir(item)));
  lbCerrar.addEventListener('click', cerrar);
  lbPrev.addEventListener('click', () => mostrar(indiceActual - 1));
  lbNext.addEventListener('click', () => mostrar(indiceActual + 1));

  // Cerrar al hacer clic en el fondo
  lightbox.addEventListener('click', e => { if (e.target === lightbox) cerrar(); });

  // Teclado
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('abierto')) return;
    if (e.key === 'Escape') cerrar();
    if (e.key === 'ArrowLeft') mostrar(indiceActual - 1);
    if (e.key === 'ArrowRight') mostrar(indiceActual + 1);
  });
}
