/**
 * Catálogo centralizado de imágenes y recursos gráficos de Cromoverso.
 *
 * Cada arte de cromo se referencia por su ID en la API (ejemplo: 'cromos/CV-001' o 'CV-001').
 * Las portadas e ilustraciones se proporcionan en PNG (1x y @2x).
 * Si un cromo no cuenta con arte gráfico en este registro, se debe recurrir
 * al fallback vectorial mediante ilustracion.colorBase e ilustracion.figura.
 */

export const CROMOS_REGISTRO = {
  "CV-001": {
    "1x": "/cromos/CV-001.png",
    "2x": null,
  },
  "CV-002": {
    "1x": "/cromos/CV-002.png",
    "2x": "/cromos/CV-002@2x.png",
    "3x": "/cromos/CV-002@3x.png",
  },
  "CV-003": {
    "1x": "/cromos/CV-003.png",
    "2x": "/cromos/CV-003@2x.png",
    "3x": "/cromos/CV-003@3x.png",
  },
  "CV-005": {
    "1x": "/cromos/CV-005.png",
    "2x": "/cromos/CV-005@2x.png",
  },
  "CV-006": {
    "1x": "/cromos/CV-006.png",
    "2x": "/cromos/CV-006@2x.png",
  },
  "CV-007": {
    "1x": "/cromos/CV-007.png",
    "2x": "/cromos/CV-007@2x.png",
  },
  "CV-008": {
    "1x": "/cromos/CV-008.png",
    "2x": "/cromos/CV-008@2x.png",
  },
  "CV-009": {
    "1x": "/cromos/CV-009.png",
    "2x": "/cromos/CV-009@2x.png",
  },
  "CV-010": {
    "1x": "/cromos/CV-010.png",
    "2x": "/cromos/CV-010@2x.png",
  },
  "CV-011": {
    "1x": "/cromos/CV-011.png",
    "2x": "/cromos/CV-011@2x.png",
  },
  "CV-012": {
    "1x": "/cromos/CV-012.png",
    "2x": "/cromos/CV-012@2x.png",
  },
  "CV-013": {
    "1x": "/cromos/CV-013.png",
    "2x": "/cromos/CV-013@2x.png",
  },
  "CV-014": {
    "1x": "/cromos/CV-014.png",
    "2x": "/cromos/CV-014@2x.png",
  },
  "CV-015": {
    "1x": "/cromos/CV-015.png",
    "2x": "/cromos/CV-015@2x.png",
  },
  "CV-016": {
    "1x": "/cromos/CV-016.png",
    "2x": "/cromos/CV-016@2x.png",
  },
  "CV-017": {
    "1x": "/cromos/CV-017.png",
    "2x": "/cromos/CV-017@2x.png",
  },
  "CV-018": {
    "1x": "/cromos/CV-018.png",
    "2x": "/cromos/CV-018@2x.png",
  },
  "CV-019": {
    "1x": "/cromos/CV-019.png",
    "2x": "/cromos/CV-019@2x.png",
  },
  "CV-020": {
    "1x": "/cromos/CV-020.png",
    "2x": "/cromos/CV-020@2x.png",
  },
  "CV-041": {
    "1x": "/cromos/CV-041.png",
    "2x": "/cromos/CV-041@2x.png",
  },
  "CV-081": {
    "1x": "/cromos/CV-081.png",
    "2x": "/cromos/CV-081@2x.png",
  },
  "CV-101": {
    "1x": "/cromos/CV-101.png",
    "2x": "/cromos/CV-101@2x.png",
  },
};

export const ILUSTRACIONES_REGISTRO = {
  "abanico-de-cromos": {
    "1x": "/ilustraciones/abanico-de-cromos.png",
    "2x": "/ilustraciones/abanico-de-cromos@2x.png",
  },
};

/**
 * Normaliza un identificador de cromo admitiendo variantes como:
 * 'CV-001', 'cv-001', 'cromos/CV-001', '001', 1
 */
export function normalizarIdCromo(id) {
  if (!id) return null;
  const texto = String(id).trim().replace(/^cromos\//i, "");
  if (/^CV-\d+$/i.test(texto)) {
    return texto.toUpperCase();
  }
  if (/^\d+$/.test(texto)) {
    return `CV-${texto.padStart(3, "0")}`;
  }
  return texto.toUpperCase();
}

/**
 * Comprueba si existe arte gráfico rasterizado para el ID de cromo indicado.
 */
export function tieneArteCromo(id) {
  const normalizado = normalizarIdCromo(id);
  return Boolean(normalizado && CROMOS_REGISTRO[normalizado]);
}

/**
 * Obtiene las rutas y srcSet del cromo especificado.
 * Si no existe arte, retorna null para que el componente invoque el fallback.
 */
export function obtenerArteCromo(id) {
  const normalizado = normalizarIdCromo(id);
  if (!normalizado) return null;

  const entrada = CROMOS_REGISTRO[normalizado];
  if (!entrada) return null;

  const src = entrada["1x"];
  const src2x = entrada["2x"];
  const srcSet = src2x ? `${src} 1x, ${src2x} 2x` : undefined;

  return {
    id: normalizado,
    src,
    src2x,
    srcSet,
    tiene2x: Boolean(src2x),
  };
}

/**
 * Obtiene la ilustración por su nombre de capa/archivo (ej: 'abanico-de-cromos').
 */
export function obtenerIlustracion(nombre = "abanico-de-cromos") {
  const clave = String(nombre).toLowerCase().replace(/^ilustraciones\//i, "");
  const entrada = ILUSTRACIONES_REGISTRO[clave] || ILUSTRACIONES_REGISTRO["abanico-de-cromos"];
  if (!entrada) return null;

  const src = entrada["1x"];
  const src2x = entrada["2x"];
  const srcSet = src2x ? `${src} 1x, ${src2x} 2x` : undefined;

  return {
    nombre: clave,
    src,
    src2x,
    srcSet,
  };
}

