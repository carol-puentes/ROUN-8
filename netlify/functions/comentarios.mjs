import {
  guardarComentario,
  listarComentarios,
} from "../lib/comentariosService.mjs";

function responder(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export default async function handler(request) {
  try {
    // GET: consultar comentarios
    if (request.method === "GET") {
      const comentarios = await listarComentarios();

      return responder(200, {
        success: true,
        total: comentarios.length,
        comentarios,
      });
    }

    // POST: guardar un comentario
    if (request.method === "POST") {
      let datos;

      try {
        datos = await request.json();
      } catch {
        return responder(400, {
          error: "El cuerpo de la solicitud no es JSON válido.",
        });
      }

      const nombre =
        typeof datos.nombre === "string"
          ? datos.nombre.trim()
          : "";

      const email =
        typeof datos.email === "string"
          ? datos.email.trim()
          : "";

      const mensaje =
        typeof datos.mensaje === "string"
          ? datos.mensaje.trim()
          : "";

      if (
        !nombre ||
        !mensaje ||
        datos.calificacion === undefined ||
        datos.calificacion === null ||
        datos.calificacion === ""
      ) {
        return responder(400, {
          error: "Los campos nombre, calificacion y mensaje son obligatorios.",
        });
      }

      if (
        nombre.length > 100 ||
        email.length > 254 ||
        mensaje.length > 3000
      ) {
        return responder(400, {
          error: "Uno de los campos supera la longitud permitida.",
        });
      }

      // Validar el email únicamente si fue proporcionado.
      if (
        email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        return responder(400, {
          error: "El correo electrónico no es válido.",
        });
      }

      const calificacion = Number(datos.calificacion);

      if (
        !Number.isInteger(calificacion) ||
        calificacion < 1 ||
        calificacion > 5
      ) {
        return responder(400, {
          error: "La calificación debe estar entre 1 y 5.",
        });
      }

      const comentario = await guardarComentario({
        nombre,
        email,
        calificacion,
        mensaje,
      });

      return responder(201, {
        success: true,
        message: "Comentario guardado correctamente.",
        id: comentario.id,
      });
    }

    return responder(405, {
      error: "Método no permitido.",
    });
  } catch (error) {
    console.error("Error en la función de comentarios:", error);

    return responder(500, {
      error: "Ocurrió un error al procesar la solicitud.",
    });
  }
}
