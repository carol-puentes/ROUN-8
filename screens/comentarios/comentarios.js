// ===== COMENTARIOS =====
// Validación del formulario, envío y listado de comentarios

// Endpoint de la Netlify Function (backend): GET lista, POST guarda
const API_URL = '/.netlify/functions/comentarios';

export function init() {
  const form = document.getElementById('formComentario');
  const inputNombre = document.getElementById('nombre');
  const inputEmail = document.getElementById('email');
  const inputCalif = document.getElementById('calificacion');
  const inputMensaje = document.getElementById('mensaje');
  const contador = document.getElementById('contador');
  const btnEnviar = document.getElementById('btnEnviar');
  const estadoForm = document.getElementById('estadoForm');
  const lista = document.getElementById('listaComentarios');
  const total = document.getElementById('totalComentarios');
  const estrellas = document.querySelectorAll('#estrellas button');

  // ---------- Estrellas ----------
  const pintarEstrellas = valor => {
    estrellas.forEach(e => e.classList.toggle('activa', Number(e.dataset.valor) <= valor));
  };

  estrellas.forEach(estrella => {
    estrella.addEventListener('click', () => {
      inputCalif.value = estrella.dataset.valor;
      pintarEstrellas(Number(estrella.dataset.valor));
      limpiarError('errorCalificacion', inputCalif);
    });
    estrella.addEventListener('mouseenter', () => pintarEstrellas(Number(estrella.dataset.valor)));
  });
  document.getElementById('estrellas')
    .addEventListener('mouseleave', () => pintarEstrellas(Number(inputCalif.value)));

  // ---------- Contador de caracteres ----------
  inputMensaje.addEventListener('input', () => {
    contador.textContent = `${inputMensaje.value.length} / 500`;
  });

  // ---------- Validación ----------
  const mostrarError = (idError, input, texto) => {
    document.getElementById(idError).textContent = texto;
    input.closest('.campo').classList.add('invalido');
  };

  const limpiarError = (idError, input) => {
    document.getElementById(idError).textContent = '';
    input.closest('.campo').classList.remove('invalido');
  };

  const validar = () => {
    let valido = true;
    const nombre = inputNombre.value.trim();
    const email = inputEmail.value.trim();
    const mensaje = inputMensaje.value.trim();

    if (nombre.length < 2) {
      mostrarError('errorNombre', inputNombre, 'Escribe un nombre de al menos 2 caracteres.');
      valido = false;
    } else limpiarError('errorNombre', inputNombre);

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      mostrarError('errorEmail', inputEmail, 'El correo no es válido.');
      valido = false;
    } else limpiarError('errorEmail', inputEmail);

    if (Number(inputCalif.value) < 1) {
      mostrarError('errorCalificacion', inputCalif, 'Selecciona una calificación.');
      valido = false;
    } else limpiarError('errorCalificacion', inputCalif);

    if (mensaje.length < 10) {
      mostrarError('errorMensaje', inputMensaje, 'El comentario debe tener al menos 10 caracteres.');
      valido = false;
    } else limpiarError('errorMensaje', inputMensaje);

    return valido;
  };

  [inputNombre, inputEmail, inputMensaje].forEach(input => {
    input.addEventListener('blur', () => { if (input.value) validar(); });
  });

  // ---------- Utilidades ----------
  // Evita que alguien inyecte HTML en los comentarios
  const escaparHTML = texto => {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  };

  const formatearFecha = iso => new Date(iso).toLocaleDateString('es-CO', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const estado = (texto, tipo = '') => {
    estadoForm.textContent = texto;
    estadoForm.className = `formulario__estado ${tipo}`;
  };

  // ---------- API (backend) ----------
  // GET: el backend responde { success, total, comentarios: [...] }
  const obtenerComentarios = async () => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('No se pudieron cargar los comentarios.');
    const data = await res.json();
    return data.comentarios;
  };

  // POST: envía el comentario; si el backend lo rechaza, muestra su mensaje de error
  const enviarComentario = async datos => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    const respuesta = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(respuesta.error || 'No se pudo publicar el comentario.');
    return respuesta;
  };

  // ---------- Renderizado ----------
  const crearComentarioHTML = c => `
    <article class="comentario">
      <div class="comentario__cabecera">
        <div class="comentario__avatar">${escaparHTML(c.nombre.charAt(0).toUpperCase())}</div>
        <div>
          <p class="comentario__nombre">${escaparHTML(c.nombre)}</p>
          <p class="comentario__fecha">${formatearFecha(c.fecha)}</p>
        </div>
        <span class="comentario__estrellas" aria-label="${c.calificacion} de 5">
          ${'★'.repeat(c.calificacion)}${'☆'.repeat(5 - c.calificacion)}
        </span>
      </div>
      <p class="comentario__texto">${escaparHTML(c.mensaje)}</p>
    </article>`;

  const renderizar = comentarios => {
    total.textContent = comentarios.length;
    lista.innerHTML = comentarios.length
      ? comentarios.map(crearComentarioHTML).join('')
      : '<p class="mensaje-vacio">Aún no hay comentarios. ¡Sé el primero en subir al ring!</p>';
  };

  const cargarComentarios = async () => {
    try {
      const comentarios = await obtenerComentarios();
      comentarios.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      renderizar(comentarios);
    } catch {
      lista.innerHTML = '<p class="mensaje-vacio">No se pudieron cargar los comentarios.</p>';
    }
  };

  // ---------- Envío ----------
  form.addEventListener('submit', async e => {
    e.preventDefault();
    estado('');
    if (!validar()) return;

    const datos = {
      nombre: inputNombre.value.trim(),
      email: inputEmail.value.trim(),
      calificacion: Number(inputCalif.value),
      mensaje: inputMensaje.value.trim()
    };

    btnEnviar.disabled = true;
    btnEnviar.classList.add('cargando');

    try {
      await enviarComentario(datos);
      form.reset();
      inputCalif.value = '0';
      pintarEstrellas(0);
      contador.textContent = '0 / 500';
      estado('¡Comentario publicado! 🥊', 'exito');
      await cargarComentarios();
    } catch (error) {
      estado(error.message, 'error');
    } finally {
      btnEnviar.disabled = false;
      btnEnviar.classList.remove('cargando');
    }
  });

  cargarComentarios();
}
