export default function IlustracionHeroe({ colorBase = "#7C4DFF" }) {
  const gradientId = `halo-${String(colorBase).replace("#", "")}`;

  return (
    <svg
      viewBox="0 0 160 140"
      className="cromo-svg-ilustracion"
      aria-hidden="true"
      focusable="false"
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

