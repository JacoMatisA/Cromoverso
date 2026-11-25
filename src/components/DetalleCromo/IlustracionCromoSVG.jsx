/**
 * IlustracionCromoSVG
 * Dibuja la ilustración vectorial del cromo exclusivamente mediante SVG y CSS,
 * a partir de las propiedades 'colorBase' y 'figura' proporcionadas por la API.
 * Réplica exacta de la ilustración del héroe de Figma.
 */
export default function IlustracionCromoSVG({
  colorBase = "#7C4DFF",
  figura = "circulo",
}) {
  const gradientId = `halo-cromo-${String(colorBase).replace("#", "")}`;

  return (
    <svg
      viewBox="0 0 160 140"
      className="cromo-svg-canvas"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="55%" stopColor={colorBase} stopOpacity="0.6" />
          <stop offset="100%" stopColor={colorBase} stopOpacity="0.95" />
        </radialGradient>

        {/* Patrón de rayos sutiles en la ilustración */}
        <clipPath id="cromo-canvas-clip">
          <rect width="160" height="140" />
        </clipPath>
      </defs>

      <g clipPath="url(#cromo-canvas-clip)">
        {/* Fondo radial temático */}
        <rect width="160" height="140" fill={`url(#${gradientId})`} />

        {/* Facetas de rayos sutiles */}
        <g opacity="0.12" fill="#ffffff">
          <polygon points="80,52 0,0 20,0" />
          <polygon points="80,52 60,0 80,0" />
          <polygon points="80,52 120,0 140,0" />
          <polygon points="80,52 160,20 160,40" />
          <polygon points="80,52 160,80 160,100" />
          <polygon points="80,52 140,140 120,140" />
          <polygon points="80,52 80,140 60,140" />
          <polygon points="80,52 20,140 0,140" />
          <polygon points="80,52 0,100 0,80" />
          <polygon points="80,52 0,40 0,20" />
        </g>

        {/* Halo de luz según la figura de la API */}
        {figura === "estrella" && (
          <path
            d="M 80 14 L 88 40 L 115 43 L 94 62 L 100 88 L 80 74 L 60 88 L 66 62 L 45 43 L 72 40 Z"
            fill="#ffffff"
            opacity="0.4"
          />
        )}

        {figura === "rombo" && (
          <polygon
            points="80,14 118,52 80,90 42,52"
            fill="#ffffff"
            opacity="0.4"
          />
        )}

        {(figura === "circulo" || !["estrella", "rombo"].includes(figura)) && (
          <circle cx="80" cy="52" r="42" fill="#ffffff" opacity="0.38" />
        )}

        {/* Silueta del torso y hombros */}
        <path
          d="M 24 140 C 28 92, 50 78, 80 78 C 110 78, 132 92, 136 140 Z"
          fill="#1A1033"
        />

        {/* Silueta de la cabeza */}
        <circle cx="80" cy="52" r="23" fill="#1A1033" />

        {/* Visor dorado redondeado característico */}
        <rect
          x="58"
          y="46"
          width="44"
          height="13"
          rx="6.5"
          fill="#FFD23F"
        />

        {/* Estrella dorada en el pecho */}
        <path
          d="M 80 94 L 82.5 100.5 L 89 101 L 84 105.5 L 85.5 112 L 80 108.5 L 74.5 112 L 76 105.5 L 71 101 L 77.5 100.5 Z"
          fill="#FFD23F"
        />
      </g>
    </svg>
  );
}
