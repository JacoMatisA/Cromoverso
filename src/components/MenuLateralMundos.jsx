import { Link } from "react-router-dom";
import Icono from "./Icono.jsx";
import "./MenuLateralMundos.css";

const ICONOS_RAREZA = {
  legendaria: "corona",
  epica: "estrella",
  rara: "rombo",
  comun: "circulo",
};

const COLORES_MUNDOS = {
  neon: "var(--mundo-neon)",
  coral: "var(--mundo-coral)",
  bosque: "var(--mundo-bosque)",
  forja: "var(--mundo-forja)",
  orbita: "var(--mundo-orbita)",
  niebla: "var(--mundo-niebla)",
};

export default function MenuLateralMundos({
  mundos = [],
  mundoActualId,
  rarezaActual,
  tipoActual,
  onCambiarFiltro,
  conteoPorRareza = {},
  conteoPorTipo = {},
  rarezasInfo = [],
  textos,
}) {
  const tMundo = textos?.paginas?.albumMundo;
  const tMundos = tMundo?.mundos;
  const tFiltros = tMundo?.filtros;

  function formatearCantidad(cantidad) {
    if (cantidad === 1) {
      return (tFiltros?.cantidad?.uno ?? "{cantidad} cromo").replace("{cantidad}", 1);
    }
    return (tFiltros?.cantidad?.otro ?? "{cantidad} cromos").replace(
      "{cantidad}",
      cantidad ?? 0
    );
  }

  // Orden específico de Figma para rarezas
  const ordenRarezas = ["legendaria", "epica", "rara", "comun"];
  const ordenTipos = ["heroe", "aliado", "villano"];

  return (
    <aside className="menu-lateral-mundos" aria-label={tMundos?.titulo ?? "Mundos"}>
      {/* 1. Bloque de Mundos */}
      <nav className="lateral-card lateral-card-mundos">
        <h2 className="titular-h4 lateral-card-titulo">
          {tMundos?.titulo ?? "Mundos"}
        </h2>
        <ul className="lateral-lista-mundos">
          {mundos.map((mundo) => {
            const esActivo = mundo.id === mundoActualId;
            const colorDot = COLORES_MUNDOS[mundo.id] ?? mundo.color ?? "var(--marca-primario)";
            const totalCromosTexto = formatearCantidad(mundo.totalCromos ?? 20);

            return (
              <li key={mundo.id} className="lateral-item-mundo-wrapper">
                <Link
                  to={`/mundos/${mundo.id}`}
                  className={`lateral-item-mundo ${esActivo ? "is-activo" : ""}`}
                  aria-current={esActivo ? "page" : undefined}
                >
                  <div className="lateral-item-mundo-izq">
                    <span
                      className="lateral-mundo-punto"
                      style={{ backgroundColor: colorDot }}
                      aria-hidden="true"
                    />
                    <div className="lateral-mundo-textos">
                      <span className="cuerpo-m-fuerte lateral-mundo-nombre">
                        {mundo.nombre}
                      </span>
                      {esActivo && (
                        <span className="detalle-nota lateral-mundo-badge-activo">
                          {tMundos?.aria?.paginaActual ?? "Página actual"}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="lateral-mundo-conteo detalle-etiqueta">
                    {totalCromosTexto}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 2. Bloque: Filtrar por rareza */}
      <section className="lateral-card lateral-card-filtros">
        <h2 className="titular-h4 lateral-card-titulo">
          {tFiltros?.rareza?.titulo ?? "Filtrar por rareza"}
        </h2>
        <ul className="lateral-lista-filtros">
          {ordenRarezas.map((clave) => {
            const esSeleccionado = rarezaActual?.toLowerCase() === clave;
            const meta = rarezasInfo.find((r) => r.id?.toLowerCase() === clave);
            const nombre =
              meta?.nombre ??
              textos?.componentes?.cromo?.rarezas?.[clave] ??
              clave;
            const icono = meta?.icono ?? ICONOS_RAREZA[clave] ?? "circulo";
            const conteo = conteoPorRareza[clave] ?? 0;

            return (
              <li key={clave}>
                <button
                  type="button"
                  className={`lateral-boton-filtro ${esSeleccionado ? "is-activo" : ""}`}
                  aria-pressed={esSeleccionado}
                  onClick={() =>
                    onCambiarFiltro("rareza", esSeleccionado ? "" : clave)
                  }
                >
                  <span className={`lateral-badge-rareza rareza-badge-${clave}`}>
                    <Icono nombre={icono} relleno />
                    <span className="lateral-badge-nombre">
                      {nombre.toUpperCase()}
                    </span>
                  </span>
                  <span className="lateral-filtro-conteo cuerpo-p">
                    {formatearCantidad(conteo)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 3. Bloque: Filtrar por tipo */}
      <section className="lateral-card lateral-card-filtros">
        <h2 className="titular-h4 lateral-card-titulo">
          {tFiltros?.tipo?.titulo ?? "Filtrar por tipo"}
        </h2>
        <ul className="lateral-lista-filtros">
          {ordenTipos.map((clave) => {
            const esSeleccionado = tipoActual?.toLowerCase() === clave;
            const nombre =
              tFiltros?.tipo?.opciones?.[clave] ??
              textos?.componentes?.cromo?.tipos?.[clave] ??
              clave;
            const conteo = conteoPorTipo[clave] ?? 0;

            return (
              <li key={clave}>
                <button
                  type="button"
                  className={`lateral-boton-filtro ${esSeleccionado ? "is-activo" : ""}`}
                  aria-pressed={esSeleccionado}
                  onClick={() =>
                    onCambiarFiltro("tipo", esSeleccionado ? "" : clave)
                  }
                >
                  <span className="cuerpo-m lateral-filtro-nombre">
                    {nombre}
                  </span>
                  <span className="lateral-filtro-conteo cuerpo-p">
                    {formatearCantidad(conteo)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}

