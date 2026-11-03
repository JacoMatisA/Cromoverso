/**
 * Catálogo centralizado de imágenes y recursos gráficos oficiales de Cromoverso.
 *
 * Todas las imágenes se resuelven exclusivamente desde src/assets/cromos/.
 * No se permite ninguna imagen que no sea de las oficiales agregadas en assets/cromos.
 */

// Importación estática directa para empaquetado optimizado con Vite
const IMAGENES_CROMOS_ASSETS = import.meta.glob("./cromos/*.png", {
  eager: true,
  import: "default",
});

const ILUSTRACIONES_ASSETS = import.meta.glob("./ilustraciones/*.png", {
  eager: true,
  import: "default",
});

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
  "CV-004": {
    "1x": "/cromos/CV-004.png",
    "2x": "/cromos/CV-004@2x.png",
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
 * Comprueba si existe arte gráfico rasterizado oficial para el ID de cromo indicado.
 */
export function tieneArteCromo(id) {
  const normalizado = normalizarIdCromo(id);
  const ruta = `./cromos/${normalizado}.png`;
  return Boolean(
    normalizado &&
      (IMAGENES_CROMOS_ASSETS[ruta] || CROMOS_REGISTRO[normalizado])
  );
}

/**
 * Obtiene las rutas y srcSet del cromo especificado exclusivamente desde assets/cromos/.
 * Si un cromo específico no cuenta con archivo individual, usa la imagen base oficial
 * de cromos de assets/cromos/CV-002.png para asegurar que siempre sea una imagen oficial.
 */
export function obtenerArteCromo(id) {
  const normalizado = normalizarIdCromo(id);
  if (!normalizado) return null;

  const ruta1x = `./cromos/${normalizado}.png`;
  const ruta2x = `./cromos/${normalizado}@2x.png`;

  // Imagen base oficial como fallback si algún ID no tuviera PNG propio
  const fallbackOficial =
    IMAGENES_CROMOS_ASSETS["./cromos/CV-002.png"] ||
    CROMOS_REGISTRO["CV-002"]?.["1x"] ||
    "/cromos/CV-002.png";

  const src1x =
    IMAGENES_CROMOS_ASSETS[ruta1x] ||
    CROMOS_REGISTRO[normalizado]?.["1x"] ||
    fallbackOficial;

  const src2x =
    IMAGENES_CROMOS_ASSETS[ruta2x] ||
    CROMOS_REGISTRO[normalizado]?.["2x"];

  const srcSet = src2x ? `${src1x} 1x, ${src2x} 2x` : undefined;

  return {
    id: normalizado,
    src: src1x,
    src2x,
    srcSet,
    tiene2x: Boolean(src2x),
  };
}

/**
 * Obtiene la ilustración oficial por su nombre (ej: 'abanico-de-cromos').
 */
export function obtenerIlustracion(nombre = "abanico-de-cromos") {
  const clave = String(nombre).toLowerCase().replace(/^ilustraciones\//i, "");
  const ruta1x = `./ilustraciones/${clave}.png`;
  const ruta2x = `./ilustraciones/${clave}@2x.png`;

  const src =
    ILUSTRACIONES_ASSETS[ruta1x] ||
    ILUSTRACIONES_REGISTRO[clave]?.["1x"] ||
    "/ilustraciones/abanico-de-cromos.png";

  const src2x =
    ILUSTRACIONES_ASSETS[ruta2x] ||
    ILUSTRACIONES_REGISTRO[clave]?.["2x"];

  const srcSet = src2x ? `${src} 1x, ${src2x} 2x` : undefined;

  return {
    nombre: clave,
    src,
    src2x,
    srcSet,
  };
}
