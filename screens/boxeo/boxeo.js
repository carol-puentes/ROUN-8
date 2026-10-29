// ===== EL BOXEO (INTRODUCCIÓN) =====
// Contadores animados de las estadísticas

const DURACION = 1500; // ms

const animarContador = el => {
  const objetivo = Number(el.dataset.objetivo);
  const inicio = performance.now();

  const paso = ahora => {
    const progreso = Math.min((ahora - inicio) / DURACION, 1);
    const suavizado = 1 - Math.pow(1 - progreso, 3); // ease-out
    el.textContent = Math.round(objetivo * suavizado);
    if (progreso < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
};

export function init() {
  const obs = new IntersectionObserver((entradas, o) => {
    entradas.forEach(entrada => {
      if (!entrada.isIntersecting) return;
      animarContador(entrada.target);
      o.unobserve(entrada.target);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.stat__numero').forEach(el => obs.observe(el));
}
