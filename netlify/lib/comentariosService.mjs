import { getStore } from "@netlify/blobs";
import { randomUUID } from "node:crypto";

const store = getStore("portafolio-comentarios");

export async function guardarComentario(datos) {
  const id = randomUUID();

  const comentario = {
    id,
    nombre: datos.nombre.trim(),
    email: datos.email.trim().toLowerCase(),
    calificacion: Number(datos.calificacion),
    mensaje: datos.mensaje.trim(),
    creadoEn: new Date().toISOString(),
  };

  // Cada comentario tiene una clave única.
  await store.setJSON(id, comentario);

  return comentario;
}

export async function listarComentarios() {
  const { blobs } = await store.list();

  const comentarios = await Promise.all(
    blobs.map(({ key }) =>
      store.get(key, { type: "json" })
    )
  );

  return comentarios
    .filter(Boolean)
    .map((comentario) => ({
      id: comentario.id,
      nombre: comentario.nombre,
      calificacion: comentario.calificacion,
      mensaje: comentario.mensaje,
      fecha: comentario.creadoEn,
    }))
    .sort(
      (a, b) =>
        new Date(b.fecha).getTime() -
        new Date(a.fecha).getTime()
    );
}
