export const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const MUNDOS_MAP = {
  1: "neon",
  2: "coral",
  3: "bosque",
  4: "forja",
  5: "orbita",
  6: "niebla",
};

export function normalizarIdMundo(id) {
  if (!id) return "neon";
  const idStr = String(id).toLowerCase().trim();
  if (MUNDOS_MAP[idStr]) {
    return MUNDOS_MAP[idStr];
  }
  return idStr;
}

/**
 * Error estructurado de la API con código HTTP, código interno (`error.codigo`),
 * errores por campo (`error.campos`) y tiempo de espera (`Retry-After`).
 */
export class ErrorHttp extends Error {
  constructor(
    status,
    codigo = null,
    { campos = null, reintentarEn = null } = {},
  ) {
    super(`Error HTTP ${status}`);
    this.name = "ErrorHttp";
    this.status = status;
    this.codigo = codigo;
    this.campos = campos;
    this.reintentarEn = reintentarEn;
  }
}

/** Interpreta la cabecera Retry-After en segundos (entero o fecha HTTP). */
export function segundosDeEspera(valor, ahora = Date.now()) {
  if (!valor) return null;
  if (/^\d+$/.test(valor.trim())) return Number(valor);
  const fecha = Date.parse(valor);
  return Number.isNaN(fecha)
    ? null
    : Math.max(0, Math.ceil((fecha - ahora) / 1000));
}

/**
 * Cabeceras de simulación de la API (`X-Simular-Latencia`, `X-Simular-Error`)
 * activadas mediante parámetros en la URL: ?simularLatencia=2000 o ?simularError=503.
 */
export function cabecerasDeSimulacion(busqueda = globalThis.location?.search) {
  const parametros = new URLSearchParams(busqueda ?? "");
  const cabeceras = {};
  const latencia = parametros.get("simularLatencia");
  const error = parametros.get("simularError");
  if (/^\d+$/.test(latencia ?? "")) {
    cabeceras["X-Simular-Latencia"] = latencia;
  }
  if (/^(500|503|504)$/.test(error ?? "")) {
    cabeceras["X-Simular-Error"] = error;
  }
  return cabeceras;
}

/**
 * Cliente HTTP base que adjunta cabeceras de simulación y convierte respuestas
 * de error en instancias de ErrorHttp.
 */
export async function pedirJson(
  ruta,
  { signal, metodo = "GET", cuerpo, conSesion = false } = {},
) {
  const url = `${API_BASE}/${ruta.replace(/^\/+/, "")}`;
  const respuesta = await fetch(url, {
    method: metodo,
    signal,
    credentials: conSesion ? "include" : "same-origin",
    headers: {
      ...cabecerasDeSimulacion(),
      ...(cuerpo ? { "Content-Type": "application/json" } : {}),
    },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });

  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => null);
    throw new ErrorHttp(respuesta.status, datos?.error?.codigo ?? null, {
      campos: datos?.error?.campos ?? null,
      reintentarEn: segundosDeEspera(respuesta.headers?.get?.("Retry-After")),
    });
  }

  return respuesta.status === 204 ? null : respuesta.json();
}

export async function obtenerMundos(opciones) {
  const datos = await pedirJson("mundos", opciones);
  return datos?.datos ?? [];
}

export async function obtenerMundo(id, opciones) {
  const slug = normalizarIdMundo(id);
  try {
    return await pedirJson(`mundos/${encodeURIComponent(slug)}`, opciones);
  } catch (err) {
    if (err instanceof ErrorHttp && err.status === 404) {
      const mundos = await obtenerMundos(opciones);
      const encontrado = mundos.find(
        (m) => m.id === slug || m.nombre.toLowerCase().includes(slug),
      );
      if (encontrado) return encontrado;
    }
    throw err;
  }
}

export async function obtenerCromos(mundoId, opciones) {
  const slug = normalizarIdMundo(mundoId);
  const datos = await pedirJson(
    `cromos?mundo=${encodeURIComponent(slug)}&limite=100`,
    opciones,
  );
  return datos?.datos ?? [];
}

export async function obtenerCromo(id, opciones) {
  const datos = await pedirJson(`cromos/${encodeURIComponent(id)}`, opciones);
  return datos?.datos ?? datos;
}

export async function obtenerCromosHero() {
  try {
    const [cromoIzq, cromoCentro, cromoDer] = await Promise.all([
      obtenerCromo("CV-041"),
      obtenerCromo("CV-001"),
      obtenerCromo("CV-081"),
    ]);
    return { cromoIzq, cromoCentro, cromoDer };
  } catch (err) {
    console.error("Error al obtener cromos del hero:", err);
    return { cromoIzq: null, cromoCentro: null, cromoDer: null };
  }
}

export async function obtenerRarezas(opciones) {
  const datos = await pedirJson("rarezas", opciones);
  return datos?.datos ?? [];
}
