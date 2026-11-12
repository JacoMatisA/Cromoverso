export const API_BASE = import.meta.env.VITE_API_URL || "";

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

export async function obtenerCromo(id) {
  try {
    const respuesta = await fetch(`${API_BASE}/cromos/${id}`);
    if (respuesta.ok) {
      const datos = await respuesta.json();
      const c = datos?.datos ?? datos;
      if (c && (c.nombre || c.id)) return c;
    }
  } catch {
    // Si falla el endpoint individual, busca en la lista del mundo correspondiente
  }

  const idNum = parseInt(String(id).replace(/\D/g, ""), 10);
  let mundoSlug = "neon";
  if (idNum >= 41 && idNum <= 60) mundoSlug = "bosque";
  else if (idNum >= 81 && idNum <= 100) mundoSlug = "orbita";
  else if (idNum >= 21 && idNum <= 40) mundoSlug = "coral";
  else if (idNum >= 61 && idNum <= 80) mundoSlug = "forja";
  else if (idNum >= 101 && idNum <= 120) mundoSlug = "niebla";

  const cromos = await obtenerCromos(mundoSlug);
  return (
    cromos.find(
      (c) =>
        c.id === id ||
        String(c.numero) === String(idNum) ||
        String(c.posicion) === String(idNum)
    ) || null
  );
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

export async function obtenerRarezas() {
  const respuesta = await fetch(`${API_BASE}/rarezas`);
  if (!respuesta.ok) {
    throw new Error(`Error al obtener rarezas: HTTP ${respuesta.status}`);
  }
  const datos = await respuesta.json();
  return datos?.datos ?? [];
}

