export default function RayosFondo({ className = "", color = "currentColor", opacity, style, viewBox, ...props }) {
  return (
    <svg
      width="1060"
      height="558"
      viewBox={viewBox || "0 0 1060 558"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
      style={style}
      {...props}
    >
      <path
        d="M750 -560L803.842 -218.971L944.114 -534.444L907.857 -191.1L1125 -459.519L1001.11 -137.258L1280.33 -340.33L1077.26 -61.1141L1399.52 -185L1131.1 32.1431L1474.44 -4.11426L1158.97 136.158L1500 190L1158.97 243.842L1474.44 384.114L1131.1 347.857L1399.52 565L1077.26 441.114L1280.33 720.33L1001.11 517.258L1125 839.519L907.857 571.1L944.114 914.444L803.842 598.971L750 940L696.158 598.971L555.886 914.444L592.143 571.1L375 839.519L498.886 517.258L219.67 720.33L422.742 441.114L100.481 565L368.9 347.857L25.5556 384.114L341.029 243.842L0 190L341.029 136.158L25.5556 -4.11426L368.9 32.1431L100.481 -185L422.742 -61.1141L219.67 -340.33L498.886 -137.258L375 -459.519L592.143 -191.1L555.886 -534.444L696.158 -218.971L750 -560Z"
        fill={color}
        fillOpacity={opacity !== undefined ? opacity : undefined}
      />
    </svg>
  );
}
