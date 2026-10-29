# ROUND 8 🥊

Página web sobre boxeo, desarrollada como proyecto académico de desarrollo web. Incluye una introducción al deporte, una galería de imágenes y una sección de comentarios conectada a un backend en Node.js.

**Sitio publicado:** [enlace de Netlify]

## Funcionalidades

- **Inicio:** carrusel automático de imágenes de fondo con indicadores.
- **El Boxeo:** historia, estadísticas animadas, golpes básicos y valores del deporte.
- **Galería:** filtros por categoría y visor de imágenes a pantalla completa (navegable con teclado).
- **Comentarios:** formulario con validación y calificación de 1 a 5 estrellas. Los comentarios se guardan en el servidor y se muestran en la misma página.
- Diseño adaptable a celular, tablet y escritorio.

## Tecnologías

| Capa | Tecnología |
| --- | --- |
| Frontend | HTML, CSS y JavaScript (módulos ES) |
| Backend | Node.js con Netlify Functions |
| Almacenamiento | Netlify Blobs |
| Publicación | GitHub y Netlify |

## Estructura del proyecto

```
round8/
├── index.html                  # Estructura base; cada data-screen carga una pantalla
├── css/base.css                # Variables, reset y estilos compartidos
├── js/app.js                   # Cargador de pantallas
├── screens/                    # Una carpeta por sección (HTML + CSS + JS)
│   ├── header/
│   ├── hero/
│   ├── boxeo/
│   ├── galeria/
│   ├── comentarios/
│   └── footer/
├── img/
│   ├── hero/                   # Imágenes del carrusel
│   └── gallery/                # Imágenes de la galería
├── netlify/
│   ├── functions/
│   │   └── comentarios.mjs     # Endpoint GET y POST de comentarios
│   └── lib/
│       └── comentariosService.mjs  # Guardado y lectura en Netlify Blobs
├── netlify.toml                # Configuración de Netlify
└── package.json
```

## API de comentarios

Ruta: `/.netlify/functions/comentarios`

| Método | Qué hace | Respuesta |
| --- | --- | --- |
| `GET` | Lista los comentarios, del más reciente al más antiguo (sin el email) | `200` `{ success, total, comentarios: [{ id, nombre, calificacion, mensaje, fecha }] }` |
| `POST` | Guarda un comentario | `201` `{ success, message, id }` |

Cuerpo del `POST`:

```json
{
  "nombre": "Carol",
  "email": "opcional@correo.com",
  "calificacion": 5,
  "mensaje": "Excelente página"
}
```

Validaciones en el servidor: `nombre`, `calificacion` y `mensaje` son obligatorios; la calificación debe ser un entero de 1 a 5; el email es opcional, pero si viene debe tener un formato válido. Si algo falla, responde `400` con `{ "error": "mensaje" }`. Cualquier otro método responde `405`.

## Ejecutar en local

Requisitos: Node.js 20 o superior.

```bash
npm install
npm install -g netlify-cli
netlify dev
```

Abrir **http://localhost:8888**.

> El proyecto debe abrirse con `netlify dev`. Live Server o abrir `index.html` con doble clic no funcionan: las pantallas se cargan con `fetch` y los comentarios necesitan el backend.

## Publicar en Netlify

1. Subir el repositorio a GitHub.
2. En Netlify: **Add new site → Import an existing project** y elegir el repositorio.
3. Dejar el **Build command** vacío y poner `.` como **Publish directory**.
4. Desplegar. Netlify detecta la función en `netlify/functions` y Netlify Blobs no necesita configuración adicional.

## Uso de inteligencia artificial

El backend se desarrolló con apoyo de ChatGPT. La conversación completa y los ajustes hechos al código sugerido están en el anexo del informe.

## Autora

Carol Puentes — Proyecto académico de Desarrollo Web, Asturias Corporación Universitaria.
