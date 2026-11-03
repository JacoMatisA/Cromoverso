import { useEffect, useId, useRef, useState } from "react";
import "./PreferenciasCookies.css";

export default function PreferenciasCookies({
  abierto,
  cookiesTextos,
  permitir,
  onGuardar,
  onCerrar,
  error,
}) {
  const dialogo = useRef(null);
  const id = useId();
  const [seleccion, setSeleccion] = useState(permitir);
  const prefs = cookiesTextos?.preferencias;

  useEffect(() => {
    if (abierto) {
      setSeleccion(permitir);
      if (dialogo.current && !dialogo.current.open) {
        dialogo.current.showModal();
      }
    } else if (dialogo.current && dialogo.current.open) {
      dialogo.current.close();
    }
  }, [abierto, permitir]);

  if (!prefs) return null;

  return (
    <dialog
      className="preferencias-dialogo"
      ref={dialogo}
      aria-labelledby={id}
      onClose={onCerrar}
    >
      <h2 id={id} className="titular-h2">{prefs.titulo}</h2>
      <p className="cuerpo-m">{prefs.texto}</p>

      {prefs.categorias?.necesarias && (
        <section className="seccion-cookie-fija">
          <div className="cabecera-opcion-fija">
            <h3 className="titular-h4">{prefs.categorias.necesarias.titulo}</h3>
            {prefs.etiquetas?.siempreActivas && (
              <span className="detalle-etiqueta badge-siempre-activa">
                {prefs.etiquetas.siempreActivas}
              </span>
            )}
          </div>
          <p className="cuerpo-p">{prefs.categorias.necesarias.descripcion}</p>
        </section>
      )}

      {prefs.categorias?.preferencias && (
        <label className="opcion-cookie">
          <input
            type="checkbox"
            checked={seleccion}
            onChange={(e) => setSeleccion(e.target.checked)}
          />
          <span>
            <strong className="cuerpo-p-fuerte">{prefs.categorias.preferencias.titulo}</strong>
            <span className="cuerpo-p">{prefs.categorias.preferencias.descripcion}</span>
          </span>
        </label>
      )}

      {error && (
        <p className="error-dialogo cuerpo-p-fuerte" role="alert">
          {prefs.botones?.cerrarSinGuardar}
        </p>
      )}

      <div className="grupo-botones grupo-botones-dialogo">
        {prefs.botones?.guardarSeleccion && (
          <button
            type="button"
            className="boton-home primario"
            onClick={() => onGuardar(seleccion)}
          >
            {prefs.botones.guardarSeleccion}
          </button>
        )}
        {prefs.botones?.cerrarSinGuardar && (
          <button
            type="button"
            className="boton-home secundario"
            onClick={onCerrar}
          >
            {prefs.botones.cerrarSinGuardar}
          </button>
        )}
      </div>
    </dialog>
  );
}
