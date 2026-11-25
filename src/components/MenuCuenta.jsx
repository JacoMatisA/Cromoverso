import { useEffect, useId, useRef, useState } from "react";
import { useSesion } from "../hooks/useSesion.js";
import { iniciales } from "../utils/sesion.js";
import Icono from "./Icono.jsx";
import "./MenuCuenta.css";

/** Avatar circular con iniciales y color de perfil del usuario. */
export function Avatar({ usuario, variante = "acento" }) {
  return (
    <span
      className={`avatar avatar--${variante} detalle-nota-fuerte`}
      style={{ "--color-avatar": usuario?.colorAvatar }}
      aria-hidden="true"
    >
      {iniciales(usuario?.nombre)}
    </span>
  );
}

/**
 * Menú desplegable de cuenta en la navegación de escritorio (US-CRO-S2-05).
 * En la barra muestra únicamente el avatar circular (iniciales con color de fondo)
 * y al hacer clic despliega nombre, correo y botón «Cerrar sesión».
 */
export default function MenuCuenta({ textos }) {
  const { usuario, salir } = useSesion();
  const [abierto, setAbierto] = useState(false);
  const [saliendo, setSaliendo] = useState(false);
  const panelId = useId();
  const contenedor = useRef(null);
  const boton = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;

    function alTeclado(evento) {
      if (evento.key === "Escape") {
        setAbierto(false);
        boton.current?.focus();
      }
    }

    function alPulsarFuera(evento) {
      if (!contenedor.current?.contains(evento.target)) {
        setAbierto(false);
      }
    }

    document.addEventListener("keydown", alTeclado);
    document.addEventListener("mousedown", alPulsarFuera);
    return () => {
      document.removeEventListener("keydown", alTeclado);
      document.removeEventListener("mousedown", alPulsarFuera);
    };
  }, [abierto]);

  if (!usuario) return null;

  async function manejarSalir() {
    if (saliendo) return;
    setSaliendo(true);
    setAbierto(false);
    await salir();
  }

  const etiquetaAccesible = textos?.menu
    ? `${textos.menu}: ${usuario.nombre}`
    : usuario.nombre;

  return (
    <div className="menu-cuenta" ref={contenedor}>
      <button
        ref={boton}
        type="button"
        className="menu-cuenta-boton"
        aria-expanded={abierto}
        aria-haspopup="menu"
        aria-controls={panelId}
        aria-label={etiquetaAccesible}
        onClick={() => setAbierto((actual) => !actual)}
      >
        <Avatar usuario={usuario} variante="acento" />
        <span className="solo-lectores">{etiquetaAccesible}</span>
      </button>

      {abierto && (
        <div id={panelId} className="menu-cuenta-panel" role="menu">
          <div className="menu-cuenta-persona">
            <Avatar usuario={usuario} variante="propio" />
            <div className="menu-cuenta-datos">
              <p className="menu-cuenta-nombre cuerpo-p-fuerte">
                {usuario.nombre}
              </p>
              {usuario.correo && (
                <p className="menu-cuenta-correo detalle-nota">
                  {usuario.correo}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            className="menu-cuenta-opcion cuerpo-p-fuerte"
            role="menuitem"
            disabled={saliendo}
            onClick={manejarSalir}
          >
            <Icono nombre="salir" />
            <span>{textos?.cerrarSesion}</span>
          </button>
        </div>
      )}
    </div>
  );
}
