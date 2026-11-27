import Icono from "./Icono.jsx";
import "./EtiquetaRareza.css";

const ICONOS_RAREZA = {
  legendaria: "corona",
  epica: "estrella",
  rara: "rombo",
  comun: "circulo",
};

/** Etiqueta compartida de rareza para el detalle del cromo y la leyenda del catálogo. */
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
{/* <span
      className="etiqueta-rareza"
      style={{ color: rareza.color, borderColor: rareza.color }}
    >
      <Icono nombre={rareza.icono} relleno />
      <span>{rareza.nombre}</span>
    </span> */}