import Icono from "./Icono.jsx";
import "./MenuAccesibilidad.css";

export default function MenuAccesibilidad({
  abierto,
  onCerrar,
  accesibilidadTextos,
  config,
  onCambiarConfig,
  onRestablecer,
}) {
  if (!abierto || !accesibilidadTextos) return null;

  const t = accesibilidadTextos;

  return (
    <div
      className="modal-accesibilidad-overlay"
      onClick={onCerrar}
      role="dialog"
      aria-modal="true"
      aria-label={t.titulo}
    >
      <div
        className="menu-accesibilidad-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="accesibilidad-cabecera">
          <h2 className="titular-h3 accesibilidad-titulo">{t.titulo}</h2>
          <button
            type="button"
            className="navbar-icono boton-cerrar-accesibilidad"
            aria-label={t.botones?.cerrar ?? "Cerrar"}
            onClick={onCerrar}
          >
            <Icono nombre="cerrar" />
          </button>
        </div>

        <div className="accesibilidad-secciones">
          {/* Tamaño de texto */}
          {t.tamanoTexto && (
            <div className="accesibilidad-grupo">
              <label className="titular-h4 accesibilidad-subtitulo">
                {t.tamanoTexto.titulo}
              </label>
              <div className="segmented-tamano" role="radiogroup" aria-label={t.tamanoTexto.titulo}>
                {Object.entries(t.tamanoTexto.opciones ?? {}).map(([clave, etiqueta]) => (
                  <button
                    key={clave}
                    type="button"
                    role="radio"
                    aria-checked={config.tamano === clave}
                    className={`segmented-opcion ${config.tamano === clave ? "is-activo" : ""}`}
                    onClick={() => onCambiarConfig("tamano", clave)}
                  >
                    {etiqueta}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Alto contraste */}
          {t.altoContraste && (
            <div className="accesibilidad-fila-toggle">
              <div className="accesibilidad-info-toggle">
                <span className="titular-h4 toggle-titulo">{t.altoContraste.titulo}</span>
                <span className="cuerpo-p toggle-ayuda">{t.altoContraste.ayuda}</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={config.altoContraste}
                className={`switch-accesibilidad ${config.altoContraste ? "is-on" : ""}`}
                onClick={() => onCambiarConfig("altoContraste", !config.altoContraste)}
              >
                <span className="switch-pulgar" />
              </button>
            </div>
          )}

          {/* Reducir movimiento */}
          {t.reducirMovimiento && (
            <div className="accesibilidad-fila-toggle">
              <div className="accesibilidad-info-toggle">
                <span className="titular-h4 toggle-titulo">{t.reducirMovimiento.titulo}</span>
                <span className="cuerpo-p toggle-ayuda">{t.reducirMovimiento.ayuda}</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={config.reducirMovimiento}
                className={`switch-accesibilidad ${config.reducirMovimiento ? "is-on" : ""}`}
                onClick={() => onCambiarConfig("reducirMovimiento", !config.reducirMovimiento)}
              >
                <span className="switch-pulgar" />
              </button>
            </div>
          )}

          {/* Subrayar enlaces */}
          {t.subrayarEnlaces && (
            <div className="accesibilidad-fila-toggle">
              <div className="accesibilidad-info-toggle">
                <span className="titular-h4 toggle-titulo">{t.subrayarEnlaces.titulo}</span>
                <span className="cuerpo-p toggle-ayuda">{t.subrayarEnlaces.ayuda}</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={config.subrayarEnlaces}
                className={`switch-accesibilidad ${config.subrayarEnlaces ? "is-on" : ""}`}
                onClick={() => onCambiarConfig("subrayarEnlaces", !config.subrayarEnlaces)}
              >
                <span className="switch-pulgar" />
              </button>
            </div>
          )}

          {/* Fuente para lectura fácil */}
          {t.fuenteLecturaFacil && (
            <div className="accesibilidad-fila-toggle">
              <div className="accesibilidad-info-toggle">
                <span className="titular-h4 toggle-titulo">{t.fuenteLecturaFacil.titulo}</span>
                <span className="cuerpo-p toggle-ayuda">{t.fuenteLecturaFacil.ayuda}</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={config.fuenteLecturaFacil}
                className={`switch-accesibilidad ${config.fuenteLecturaFacil ? "is-on" : ""}`}
                onClick={() => onCambiarConfig("fuenteLecturaFacil", !config.fuenteLecturaFacil)}
              >
                <span className="switch-pulgar" />
              </button>
            </div>
          )}
        </div>

        <div className="accesibilidad-pie">
          {t.enlaces?.declaracion && (
            <a href="#accesibilidad" className="enlace-declaracion detalle-nota-fuerte">
              {t.enlaces.declaracion}
            </a>
          )}
          {t.botones?.restablecer && (
            <button
              type="button"
              className="boton-home secundario boton-restablecer"
              onClick={onRestablecer}
            >
              {t.botones.restablecer}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
