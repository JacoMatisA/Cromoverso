import { useState } from "react";
import { obtenerArteCromo, normalizarIdCromo } from "../assets/imagenes";
import "./ArteCromo.css";

const FIGURAS_PATH = {
  destellos: (
    <path
      d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
      fill="#FFD23F"
    />
  ),
  estrella: (
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill="#FFD23F"
    />
  ),
  rayo: (
    <path
      d="M13 2L4 13H11L10 22L19 11H12L13 2Z"
      fill="#FFD23F"
    />
  ),
  llama: (
    <path
      d="M12 2C8 6 6 9 6 13C6 16.3 8.7 19 12 19C15.3 19 18 16.3 18 13C18 11 17 8 15 6C15 8 14 9 13 9C12 9 11 8 12 2Z"
      fill="#FFD23F"
    />
  ),
  ojo: (
    <g fill="#FFD23F">
      <path d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z" />
      <circle cx="12" cy="12" r="3.5" fill="#2B1F52" />
      <circle cx="12" cy="12" r="1.5" fill="#FFD23F" />
    </g>
  ),
  mundo: (
    <g fill="none" stroke="#FFD23F" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M3.6 9H20.4M3.6 15H20.4" />
      <ellipse cx="12" cy="12" rx="4.5" ry="9" />
    </g>
  ),
  corona: (
    <path
      d="M2 6L6 18H18L22 6L16 11L12 5L8 11L2 6Z"
      fill="#FFD23F"
    />
  ),
};

function IlustracionVectorialFallback({ colorBase = "#6C3BFF", figura = "destellos" }) {
  const colorLimpio = String(colorBase).replace(/[^a-zA-Z0-9]/g, "");
  const gradientId = `halo-cromo-${colorLimpio || "default"}`;
  const figuraKey = String(figura).toLowerCase();
  const figuraRender = FIGURAS_PATH[figuraKey] || FIGURAS_PATH.destellos;

  return (
    <svg
      viewBox="0 0 160 140"
      className="cromo-svg-ilustracion"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="55%" stopColor={colorBase} stopOpacity="0.5" />
          <stop offset="100%" stopColor={colorBase} stopOpacity="0.9" />
        </radialGradient>
      </defs>
      {/* Fondo temático con gradiente radial */}
      <rect width="160" height="140" fill={`url(#${gradientId})`} />
      {/* Halo de luz circular superior */}
      <circle cx="80" cy="54" r="38" fill="#ffffff" opacity="0.4" />
      {/* Silueta de hombros y torso */}
      <path
        d="M 28 140 C 32 96, 52 82, 80 82 C 108 82, 128 96, 132 140 Z"
        fill="#2B1F52"
      />
      {/* Silueta de la cabeza */}
      <ellipse cx="80" cy="52" rx="26" ry="29" fill="#2B1F52" />
      {/* Visor dorado emblemático */}
      <path
        d="M 58 50 C 64 45, 96 45, 102 50 C 100 57, 60 57, 58 50 Z"
        fill="#FFD23F"
      />
      {/* Figura / emblema central temático */}
      <g transform="translate(68, 92) scale(1)">
        <svg viewBox="0 0 24 24" width="24" height="24">
          {figuraRender}
        </svg>
      </g>
    </svg>
  );
}

/**
 * Componente que renderiza el arte de un cromo.
 *
 * Si el cromo tiene arte en los archivos locales (PNG 1x / @2x), se muestra la imagen.
 * Si no cuenta con arte gráfico (como especifica la API), se recurre al fallback
 * dinámico utilizando `ilustracion.colorBase` e `ilustracion.figura`.
 */
export default function ArteCromo({
  id,
  cromo,
  ilustracion,
  colorBase,
  figura,
  nombre,
  className = "",
  alt,
}) {
  const [errorCarga, setErrorCarga] = useState(false);

  const idFinal = normalizarIdCromo(id || cromo?.id || cromo?.numero);
  const colorFinal = colorBase || ilustracion?.colorBase || cromo?.ilustracion?.colorBase || cromo?.colorBase || "#6C3BFF";
  const figuraFinal = figura || ilustracion?.figura || cromo?.ilustracion?.figura || cromo?.figura || "destellos";
  const nombreFinal = nombre || cromo?.nombre || (idFinal ? `Cromo ${idFinal}` : "Cromo");
  const altFinal = alt || `Ilustración de ${nombreFinal}`;

  const arte = !errorCarga ? obtenerArteCromo(idFinal) : null;

  if (arte?.src) {
    return (
      <img
        src={arte.src}
        srcSet={arte.srcSet}
        alt={altFinal}
        className={`cromo-arte-imagen ${className}`.trim()}
        loading="lazy"
        decoding="async"
        onError={() => setErrorCarga(true)}
      />
    );
  }

  return (
    <div className={`cromo-arte-fallback ${className}`.trim()} title={nombreFinal}>
      <IlustracionVectorialFallback colorBase={colorFinal} figura={figuraFinal} />
    </div>
  );
}

