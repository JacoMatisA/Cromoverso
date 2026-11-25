import TarjetaCromo from "../cards/TarjetaCromo.jsx";

/**
 * GrillaCromos: Componente contenedor para la colección de cromos en el catálogo.
 * Gestiona el mapeo de la colección mediante TarjetaCromo y el estado vacío cuando no hay resultados.
 *
 * @param {Array} [cromos=[]] - Lista de cromos a mostrar.
 * @param {string} [mundoNombre=""] - Nombre del mundo actual para contexto de la tarjeta.
 * @param {string} [colorMundo="var(--marca-primario)"] - Color temático del mundo.
 * @param {Array} [rarezasInfo=[]] - Metadatos de rarezas desde la API.
 * @param {object} [textos] - Textos de i18n para estados vacíos y etiquetas.
 * @param {Function} [onLimpiarFiltros] - Callback ejecutado al pulsar el botón de quitar filtros.
 */
export default function GrillaCromos({
  cromos = [],
  mundoNombre = "",
  colorMundo = "var(--marca-primario)",
  rarezasInfo = [],
  textos,
  onLimpiarFiltros,
}) {
  const tVacio = textos?.paginas?.albumMundo?.vacio;
  const tituloVacio = tVacio?.titulo ?? textos?.estados?.vacio?.titulo;
  const textoVacio = tVacio?.texto;
  const textoBotonLimpiar =
    tVacio?.botones?.limpiar ?? textos?.general?.acciones?.quitarFiltros;

  if (cromos.length === 0) {
    return (
      <div className="catalogo-vacio" role="status">
        {tituloVacio && <h3 className="titular-h3">{tituloVacio}</h3>}
        {textoVacio && <p className="cuerpo-m">{textoVacio}</p>}
        {onLimpiarFiltros && textoBotonLimpiar && (
          <button
            type="button"
            onClick={onLimpiarFiltros}
            className="boton-home primario catalogo-boton-limpiar"
          >
            {textoBotonLimpiar}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="catalogo-grilla-cromos">
      {cromos.map((cromo) => (
        <TarjetaCromo
          key={cromo.id || cromo.numero}
          cromo={cromo}
          mundoNombre={mundoNombre}
          colorMundo={colorMundo}
          rarezasInfo={rarezasInfo}
          textos={textos}
        />
      ))}
    </div>
  );
}
