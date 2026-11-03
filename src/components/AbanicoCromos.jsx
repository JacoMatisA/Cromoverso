import Icono from "./Icono.jsx";
import "./AbanicoCromos.css";

function IlustracionHeroe({ colorBase = "#7C4DFF" }) {
  const gradientId = `halo-${colorBase.replace("#", "")}`;

  return (
    <svg
      viewBox="0 0 160 140"
      className="cromo-svg-ilustracion"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="55%" stopColor={colorBase} stopOpacity="0.5" />
          <stop offset="100%" stopColor={colorBase} stopOpacity="0.9" />
        </radialGradient>
      </defs>
      {/* Fondo con halo radial temático */}
      <rect width="160" height="140" fill={`url(#${gradientId})`} />
      {/* Halo de luz circular detrás de la cabeza */}
      <circle cx="80" cy="54" r="38" fill="#ffffff" opacity="0.4" />
      {/* Silueta de hombros y torso */}
      <path
        d="M 28 140 C 32 96, 52 82, 80 82 C 108 82, 128 96, 132 140 Z"
        fill="#2B1F52"
      />
      {/* Silueta de la cabeza */}
      <ellipse cx="80" cy="52" rx="26" ry="29" fill="#2B1F52" />
      {/* Visor dorado característico de Figma */}
      <path
        d="M 58 50 C 64 45, 96 45, 102 50 C 100 57, 60 57, 58 50 Z"
        fill="#FFD23F"
      />
      {/* Estrella dorada en el pecho */}
      <path
        d="M 80 96 L 82.5 102.5 L 89 103 L 84 107.5 L 85.5 114 L 80 110.5 L 74.5 114 L 76 107.5 L 71 103 L 77.5 102.5 Z"
        fill="#FFD23F"
      />
    </svg>
  );
}

const CROMOS_HERO = [
  {
    posicion: "izquierda",
    numero: "041",
    nombre: "Raíz Madre",
    mundo: "Bosque Eterno",
    tipo: "Héroe",
    colorBase: "#2E9E4F",
    corona: false,
  },
  {
    posicion: "centro",
    numero: "001",
    nombre: "Voltia",
    mundo: "Ciudad Neón",
    tipo: "Héroe",
    colorBase: "#7C4DFF",
    corona: true,
  },
  {
    posicion: "derecha",
    numero: "081",
    nombre: "Astra",
    mundo: "Estación Órbita",
    tipo: "Héroe",
    colorBase: "#2563EB",
    corona: true,
  },
];

export default function AbanicoCromos({ etiquetaGuardiana, formatoTipo = "{mundo} · {tipo}" }) {
  const cromoIzq = CROMOS_HERO[0];
  const cromoCentro = CROMOS_HERO[1];
  const cromoDer = CROMOS_HERO[2];

  function formatearDetalle(cromo) {
    return formatoTipo
      .replace("{mundo}", cromo.mundo)
      .replace("{tipo}", cromo.tipo);
  }

  return (
    <div className="abanico-cromos" role="region" aria-label={etiquetaGuardiana ?? "Cromos destacados"}>
      {etiquetaGuardiana && (
        <div className="abanico-guardiana-badge">
          <Icono nombre="destellos" />
          <span>{etiquetaGuardiana.toUpperCase()}</span>
        </div>
      )}

      <div className="abanico-cartas-contenedor">
        {/* Carta izquierda (041 - Raíz Madre) */}
        <div className="carta-figma carta-izquierda">
          <div className="carta-cabecera">
            <span className="carta-numero dato-numero-de-cromo">
              {cromoIzq.numero}
            </span>
          </div>
          <div className="carta-ilustracion-marco">
            <IlustracionHeroe colorBase={cromoIzq.colorBase} />
          </div>
          <div className="carta-pie">
            <strong className="cromo-nombre-m">{cromoIzq.nombre}</strong>
            <span className="detalle-nota">{formatearDetalle(cromoIzq)}</span>
          </div>
        </div>

        {/* Carta centro destacada (001 - Voltia) */}
        <div className="carta-figma carta-centro">
          <div className="carta-cabecera">
            <span className="carta-numero dato-numero-de-cromo">
              {cromoCentro.numero}
            </span>
            <span className="carta-icono-corona" aria-hidden="true">
              <Icono nombre="corona" />
            </span>
          </div>
          <div className="carta-ilustracion-marco">
            <IlustracionHeroe colorBase={cromoCentro.colorBase} />
          </div>
          <div className="carta-pie">
            <strong className="cromo-nombre-g">{cromoCentro.nombre}</strong>
            <span className="detalle-nota-fuerte">{formatearDetalle(cromoCentro)}</span>
          </div>
        </div>

        {/* Carta derecha (081 - Astra) */}
        <div className="carta-figma carta-derecha">
          <div className="carta-cabecera">
            <span className="carta-numero dato-numero-de-cromo">
              {cromoDer.numero}
            </span>
            <span className="carta-icono-corona" aria-hidden="true">
              <Icono nombre="corona" />
            </span>
          </div>
          <div className="carta-ilustracion-marco">
            <IlustracionHeroe colorBase={cromoDer.colorBase} />
          </div>
          <div className="carta-pie">
            <strong className="cromo-nombre-m">{cromoDer.nombre}</strong>
            <span className="detalle-nota">{formatearDetalle(cromoDer)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
