import { Link } from "react-router-dom";
import Icono from "./Icono.jsx";
import IlustracionHeroe from "./IlustracionHeroe.jsx";
import "./TarjetaCromo.css";

const ICONOS_RAREZA = {
  legendaria: "corona",
  epica: "estrella",
  rara: "rombo",
  comun: "circulo",
};

export default function TarjetaCromo({
  cromo,
  mundoNombre,
  colorMundo = "#7C4DFF",
  rarezasInfo = [],
  textos,
}) {
  const numeroFormateado = String(cromo.numero ?? cromo.posicion ?? 1).padStart(3, "0");
  const claveRareza = String(cromo.rareza || "comun").toLowerCase();
  
  // Buscar metadatos de rareza de la API
  const metaRareza = rarezasInfo.find((r) => r.id?.toLowerCase() === claveRareza);
  const nombreRareza =
    metaRareza?.nombre ??
    textos?.componentes?.cromo?.rarezas?.[claveRareza] ??
    claveRareza;
  const iconoRareza = metaRareza?.icono ?? ICONOS_RAREZA[claveRareza] ?? "circulo";

  // Buscar nombre de tipo traducido
  const claveTipo = String(cromo.tipo || "heroe").toLowerCase();
  const nombreTipo =
    textos?.paginas?.albumMundo?.filtros?.tipo?.opciones?.[claveTipo] ??
    textos?.componentes?.cromo?.tipos?.[claveTipo] ??
    cromo.tipo;

  // Formato tipo plantilla: "{mundo} · {tipo}"
  const plantillaTipo = textos?.paginas?.albumMundo?.tarjeta?.tipo ?? "{mundo} · {tipo}";
  const subtitulo = plantillaTipo
    .replace("{mundo}", mundoNombre || cromo.mundoNombre || "")
    .replace("{tipo}", nombreTipo || "");

  // Aria label completo y accesible
  const etiquetaAria = `${numeroFormateado} ${cromo.nombre}, ${nombreRareza}, ${nombreTipo}`;

  return (
    <Link
      to={`/cromos/${cromo.id || cromo.numero}`}
      className={`tarjeta-cromo rareza-${claveRareza}`}
      aria-label={etiquetaAria}
    >
      <div className="tarjeta-cromo-marco">
        {/* Cabecera con número e insignia de rareza */}
        <div className="tarjeta-cromo-superposicion">
          <span className="tarjeta-cromo-numero dato-numero-de-cromo">
            {numeroFormateado}
          </span>
          <span
            className={`tarjeta-cromo-badge-rareza badge-${claveRareza}`}
            title={nombreRareza}
          >
            <Icono nombre={iconoRareza} />
            <span className="cromo-rareza-sr">{nombreRareza}</span>
          </span>
        </div>

        {/* Ilustración del personaje con halo del mundo */}
        <div className="tarjeta-cromo-ilustracion">
          <IlustracionHeroe colorBase={colorMundo} />
        </div>
      </div>

      {/* Pie con nombre y subtítulo */}
      <div className="tarjeta-cromo-info">
        <h3 className="cromo-nombre-m tarjeta-cromo-nombre">{cromo.nombre}</h3>
        {subtitulo && (
          <p className="detalle-nota tarjeta-cromo-subtitulo">{subtitulo}</p>
        )}
      </div>
    </Link>
  );
}
