import Icono from "./Icono.jsx";
import "./Estados.css";

/**
 * Estado de error con botón para reintentar.
 * El título y botón salen de `textos.estados.error` y el detalle de `textos.errores[codigo]`.
 */
export function EstadoError({
  textos,
  error,
  onReintentar,
  etiquetaTitulo: EtiquetaTitulo = "h2",
  className = "",
}) {
  const estados = textos?.estados?.error;
  const mensaje =
    (error?.codigo && textos?.errores?.[error.codigo]) || estados?.texto;

  return (
    <div className={`estado estado--error ${className}`.trim()} role="alert">
      <span className="estado-icono" aria-hidden="true">
        <Icono nombre="alerta" />
      </span>
      {estados?.titulo && (
        <EtiquetaTitulo className="estado-titulo titular-h2">
          {estados.titulo}
        </EtiquetaTitulo>
      )}
      {mensaje && <p className="estado-texto cuerpo-m">{mensaje}</p>}
      {onReintentar && estados?.botones?.reintentar && (
        <button
          type="button"
          className="boton-home primario"
          onClick={onReintentar}
        >
          {estados.botones.reintentar}
        </button>
      )}
    </div>
  );
}

/** Bloque animado que ocupa el lugar de un contenido mientras carga. */
export function Esqueleto({ className = "" }) {
  return <span className={`esqueleto ${className}`.trim()} aria-hidden="true" />;
}

/** Anuncia el estado de carga a lectores de pantalla usando textos.estados.cargando. */
export function AvisoCarga({ textos }) {
  if (!textos?.estados?.cargando) return null;
  return (
    <p className="solo-lectores" role="status">
      {textos.estados.cargando}
    </p>
  );
}
