/**
 * Utilidades para la lectura, escritura y eliminación de cookies en el navegador.
 */

export function obtenerCookie(nombre) {
  if (typeof document === "undefined") return null;
  const nombreCodificado = encodeURIComponent(nombre);
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  for (const c of cookies) {
    const [clave, ...resto] = c.split("=");
    if (clave === nombreCodificado) {
      return decodeURIComponent(resto.join("="));
    }
  }
  return null;
}

export function establecerCookie(nombre, valor, dias = 365) {
  if (typeof document === "undefined") return;
  const fecha = new Date();
  fecha.setTime(fecha.getTime() + dias * 24 * 60 * 60 * 1000);
  const opciones = `expires=${fecha.toUTCString()}; path=/; SameSite=Lax`;
  document.cookie = `${encodeURIComponent(nombre)}=${encodeURIComponent(valor)}; ${opciones}`;
}

export function eliminarCookie(nombre) {
  if (typeof document === "undefined") return;
  document.cookie = `${encodeURIComponent(nombre)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

