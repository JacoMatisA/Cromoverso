const API_BASE = "https://yanethm-cromoverso-api.fly.dev/api/v1";

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

export async function obtenerMundos() {
  const respuesta = await fetch(`${API_BASE}/mundos`);
  if (!respuesta.ok) {
    throw new Error(`Error al obtener mundos: HTTP ${respuesta.status}`);
  }
  const datos = await respuesta.json();
  return datos?.datos ?? [];
}

export async function obtenerMundo(id) {
  const slug = normalizarIdMundo(id);
  const respuesta = await fetch(`${API_BASE}/mundos/${slug}`);
  if (!respuesta.ok) {
    // Si la API no lo encuentra directamente por slug, intentamos buscar en la lista completa
    const mundos = await obtenerMundos();
    const encontrado = mundos.find(
      (m) => m.id === slug || m.nombre.toLowerCase().includes(slug)
    );
    if (encontrado) return encontrado;
    throw new Error(`Error al obtener mundo ${id}: HTTP ${respuesta.status}`);
  }
  return await respuesta.json();
}

export async function obtenerCromos(mundoId) {
  const slug = normalizarIdMundo(mundoId);
  const respuesta = await fetch(`${API_BASE}/cromos?mundo=${slug}&limite=100`);
  if (!respuesta.ok) {
    throw new Error(`Error al obtener cromos: HTTP ${respuesta.status}`);
  }
  const datos = await respuesta.json();
  return datos?.datos ?? [];
}

export async function obtenerRarezas() {
  const respuesta = await fetch(`${API_BASE}/rarezas`);
  if (!respuesta.ok) {
    throw new Error(`Error al obtener rarezas: HTTP ${respuesta.status}`);
  }
  const datos = await respuesta.json();
  return datos?.datos ?? [];
}

