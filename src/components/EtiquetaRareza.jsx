import Icono from "./Icono.jsx";
import "./EtiquetaRareza.css";

const ICONOS_RAREZA = {
  legendaria: "corona",
  epica: "estrella",
  rara: "rombo",
  comun: "circulo",
};

export default function EtiquetaRareza({ clave = "comun", nombre, icono }) {
  const id = String(clave).toLowerCase();
  const nombreIcono = icono || ICONOS_RAREZA[id] || "circulo";

  return (
    <span className={`etiqueta-rareza etiqueta-rareza--${id}`}>
      <Icono nombre={nombreIcono} relleno />
      <span>{nombre || id}</span>
    </span>
  );
}
