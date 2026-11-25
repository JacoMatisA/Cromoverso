import { Link } from "react-router-dom";
import Icono from "../Icono.jsx";
import ArteCromo from "../ArteCromo.jsx";
import "../TarjetaCromo.css";

const ICONOS_RAREZA = {
  legendaria: "corona",
  epica: "estrella",
  rara: "rombo",
  comun: "circulo",
};

/**
 * TarjetaCromo: Componente de tarjeta reutilizable para representar un cromo individual.
 * Sigue el patrón modular por props (estilo NoticiaCard de Bitácora Espacial),
 * permitiendo inyectar atributos atómicos directos o mediante el objeto 'cromo'.
 *
 * @param {string} [id] - Identificador único del cromo (ej. "CV-001").
 * @param {number|string} [numero] - Número de colección del cromo (ej. 1).
 * @param {string} [nombre] - Nombre del cromo o personaje.
 * @param {string} [rareza="comun"] - Rareza del cromo (legendaria, epica, rara, comun).
 * @param {string} [tipo="heroe"] - Tipo de cromo (heroe, aliado, villano).
 * @param {string} [mundo=""] - Nombre del mundo al que pertenece.
 * @param {string} [colorMundo="#7C4DFF"] - Color base del mundo para fondo o borde.
 * @param {string} [ilustracion] - Ruta o URL de la imagen del cromo.
 * @param {string} [enlace] - Ruta de navegación (por defecto: /cromos/:id).
 * @param {object} [cromo] - Objeto completo del cromo para compatibilidad con la API.
 * @param {string} [mundoNombre] - Nombre alternativo del mundo.
 * @param {Array} [rarezasInfo=[]] - Catálogo de metadatos de rarezas desde la API.
 * @param {object} [textos] - Textos de i18n para nombres localizados de rarezas y tipos.
 */
export default function TarjetaCromo({
  id,
  numero,
  nombre,
  rareza,
  tipo,
  mundo,
  colorMundo = "#7C4DFF",
  ilustracion,
  enlace,
  // Props de compatibilidad
  cromo,
  mundoNombre,
  rarezasInfo = [],
  textos,
}) {
  // Resolver id y número
  const idFinal = id ?? cromo?.id ?? String(numero ?? cromo?.numero ?? "1");
  const numRaw = numero ?? cromo?.numero ?? cromo?.posicion ?? 1;
  const numeroFormateado = String(numRaw).padStart(3, "0");

  // Resolver nombre
  const nombreFinal = nombre ?? cromo?.nombre ?? "Cromo";

  // Resolver rareza
  const claveRareza = String(rareza ?? cromo?.rareza ?? "comun").toLowerCase();
  const metaRareza = rarezasInfo.find((r) => r.id?.toLowerCase() === claveRareza);
  const nombreRareza =
    textos?.componentes?.cromo?.rarezas?.[claveRareza] ??
    metaRareza?.nombre ??
    claveRareza;
  const iconoRareza = metaRareza?.icono ?? ICONOS_RAREZA[claveRareza] ?? "circulo";

  // Resolver tipo
  const claveTipo = String(tipo ?? cromo?.tipo ?? "heroe").toLowerCase();
  const nombreTipo =
    textos?.paginas?.albumMundo?.filtros?.tipo?.opciones?.[claveTipo] ??
    textos?.componentes?.cromo?.tipos?.[claveTipo] ??
    claveTipo;

  // Resolver mundo y subtítulo
  const nombreMundoFinal = mundo ?? mundoNombre ?? cromo?.mundoNombre ?? "";
  const plantillaTipo = textos?.paginas?.albumMundo?.tarjeta?.tipo ?? "{mundo} · {tipo}";
  const subtitulo = plantillaTipo
    .replace("{mundo}", nombreMundoFinal)
    .replace("{tipo}", nombreTipo);

  // Destino y accesibilidad
  const rutaDestino = enlace ?? `/cromos/${idFinal}`;
  const etiquetaAria = `${numeroFormateado} ${nombreFinal}, ${nombreRareza}, ${nombreTipo}`;

  return (
    <Link
      to={rutaDestino}
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
            <Icono nombre={iconoRareza} relleno />
            <span className="cromo-rareza-sr">{nombreRareza}</span>
          </span>
        </div>

        {/* Arte oficial del cromo con fallback automático */}
        <div className="tarjeta-cromo-ilustracion">
          <ArteCromo
            id={idFinal}
            cromo={cromo}
            nombre={nombreFinal}
            colorBase={colorMundo}
            ilustracion={ilustracion ?? cromo?.ilustracion}
          />
        </div>
      </div>

      {/* Pie con nombre y subtítulo */}
      <div className="tarjeta-cromo-info">
        <h3 className="cromo-nombre-m tarjeta-cromo-nombre">{nombreFinal}</h3>
        {subtitulo && (
          <p className="detalle-nota tarjeta-cromo-subtitulo">{subtitulo}</p>
        )}
      </div>
    </Link>
  );
}
