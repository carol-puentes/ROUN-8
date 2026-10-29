// ===== HERO =====
// Carrusel de imágenes de fondo con indicadores

const INTERVALO = 5000; // ms entre imágenes

export function init() {
  const slides = document.querySelectorAll('.hero__slide');
  const contIndicadores = document.getElementById('heroIndicadores');
  if (slides.length === 0) return;

  let actual = 0;
  let temporizador;

  const irA = i => {
    slides[actual].classList.remove('activo');
    indicadores[actual].classList.remove('activo');
    actual = (i + slides.length) % slides.length;
    slides[actual].classList.add('activo');
    indicadores[actual].classList.add('activo');
  };

  const reiniciar = () => {
    clearInterval(temporizador);
    temporizador = setInterval(() => irA(actual + 1), INTERVALO);
  };

  // Un indicador por cada imagen
  const indicadores = [...slides].map((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'hero__indicador' + (i === 0 ? ' activo' : '');
    btn.setAttribute('aria-label', `Imagen ${i + 1}`);
    btn.addEventListener('click', () => { irA(i); reiniciar(); });
    contIndicadores.appendChild(btn);
    return btn;
  });

  // Pausa cuando la pestaña no está visible
  document.addEventListener('visibilitychange', () => {
    document.hidden ? clearInterval(temporizador) : reiniciar();
  });

  if (slides.length > 1) reiniciar();
}
