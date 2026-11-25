import { ErrorHttp } from "../services/api.js";

const ESPERA_POR_DEFECTO = 30;

/** Reemplaza marcadores `{clave}` en una plantilla de texto de la API. */
export function insertarVariables(plantilla, variables = {}) {
  if (typeof plantilla !== "string") return "";
  return plantilla.replace(/\{(\w+)\}/g, (coincidencia, clave) =>
    variables[clave] !== undefined ? String(variables[clave]) : coincidencia,
  );
}

/**
 * Traduce un error de `POST /sesion` al aviso correspondiente del formulario
 * de ingreso usando únicamente los textos de la API:
 * - Error de red (sin respuesta HTTP): aviso de conexión con botón Reintentar.
 * - 401 `credenciales_invalidas`: un solo mensaje, sin indicar qué campo falló.
 * - 429 `demasiadas_peticiones`: bloqueo temporal durante los segundos de `Retry-After`.
 * - 422 `validacion`: mensajes junto a cada campo devuelto por la API.
 * - Otros errores HTTP (500/503/504): mensaje desde `textos.errores[codigo]`.
 */
export function avisoDeError(error, pagina, textos) {
  const errores = pagina?.errores ?? {};

  if (!(error instanceof ErrorHttp)) {
    return { tipo: "conexion", aviso: errores.conexion };
  }

  if (error.status === 401) {
    return { tipo: "credenciales", aviso: errores.credenciales };
  }

  if (error.status === 429) {
    return {
      tipo: "bloqueo",
      aviso: errores.demasiadosIntentos,
      segundos:
        typeof error.reintentarEn === "number" && error.reintentarEn > 0
          ? error.reintentarEn
          : ESPERA_POR_DEFECTO,
    };
  }

  if (error.status === 422) {
    const campos = {};
    if (error.campos?.correo) campos.correo = error.campos.correo;
    if (error.campos?.clave) campos.clave = error.campos.clave;
    return {
      tipo: "campos",
      aviso: {
        titulo: errores.camposObligatorios?.titulo,
        texto: textos?.errores?.validacion,
      },
      campos: Object.keys(campos).length > 0 ? campos : null,
    };
  }

  return {
    tipo: "servidor",
    aviso: {
      titulo: textos?.estados?.error?.titulo,
      texto:
        (error.codigo && textos?.errores?.[error.codigo]) ||
        textos?.errores?.generico ||
        textos?.estados?.error?.texto,
    },
  };
}
