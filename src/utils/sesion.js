/**
 * Utilidades de apoyo para la sesión y presentación de cuenta.
 * El token de sesión nunca se almacena en localStorage ni sessionStorage:
 * vive exclusivamente en la cookie httpOnly `sesion` gestionada por la API.
 */

const MARCA_CERRAR = "cromoverso.cerrarSesionAlSalir";
const MARCA_ABIERTA = "cromoverso.navegadorAbierto";

function guardarMarca(almacen, clave, activa) {
  try {
    if (activa) almacen?.setItem(clave, "1");
    else almacen?.removeItem(clave);
  } catch {
    // Almacenamiento no disponible: se ignora sin afectar la sesión.
  }
}

function leerMarca(almacen, clave) {
  try {
    return almacen?.getItem(clave) === "1";
  } catch {
    return false;
  }
}

/**
 * Si la persona desmarcó «Mantener la sesión iniciada», se guarda únicamente
 * una marca booleana (nunca el token) para cerrar la sesión al reabrir el navegador.
 */
export function recordarPreferenciaDeSesion(
  mantener,
  local = globalThis.localStorage,
  pestana = globalThis.sessionStorage,
) {
  guardarMarca(local, MARCA_CERRAR, !mantener);
  guardarMarca(pestana, MARCA_ABIERTA, true);
}

/** Devuelve true si la sesión era temporal y se abrió una nueva sesión de navegador. */
export function debeCerrarSesionAlIniciar(
  local = globalThis.localStorage,
  pestana = globalThis.sessionStorage,
) {
  const cerrar = leerMarca(local, MARCA_CERRAR) && !leerMarca(pestana, MARCA_ABIERTA);
  guardarMarca(pestana, MARCA_ABIERTA, true);
  if (cerrar) guardarMarca(local, MARCA_CERRAR, false);
  return cerrar;
}

/** Iniciales del nombre para el avatar: «Laura Cardona» → «LC». */
export function iniciales(nombre = "") {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toLocaleUpperCase() ?? "")
    .join("");
}
