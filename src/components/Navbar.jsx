import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import Icono from "./Icono.jsx";
import LogoCromoverso from "./LogoCromoverso.jsx";
import SelectorIdioma from "./SelectorIdioma.jsx";
import MenuAccesibilidad from "./MenuAccesibilidad.jsx";

const DESTINOS = {
  inicio: "#inicio",
  mundos: "#mundos",
};

export default function Navbar({
  textos,
  idioma,
  cambiarIdioma,
  activo = "inicio",
  configAccesibilidad,
  onCambiarAccesibilidad,
  onRestablecerAccesibilidad,
}) {
  const [abierto, setAbierto] = useState(false);
  const [accesibilidadAbierta, setAccesibilidadAbierta] = useState(false);
  const botonMenu = useRef(null);
  const nav = textos?.navbar;
  const menuMovil = textos?.menuMovil;

  const abrir = menuMovil?.abrir ?? "Abrir menú";
  const cerrar = menuMovil?.cerrar ?? "Cerrar menú";

  useEffect(() => {
    function cerrarConEscape(evento) {
      if (evento.key === "Escape") {
        if (accesibilidadAbierta) {
          setAccesibilidadAbierta(false);
        } else if (abierto) {
          setAbierto(false);
          botonMenu.current?.focus();
        }
      }
    }
    document.addEventListener("keydown", cerrarConEscape);
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [abierto, accesibilidadAbierta]);

  // Bloquea el scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  function abrirModalAccesibilidad() {
    setAbierto(false);
    setAccesibilidadAbierta(true);
  }

  return (
    <header className="navbar">
      <div className="navbar-interior">
        <div className="navbar-izquierda">
          <a
            href="#inicio"
            className="navbar-marca"
            aria-label={nav?.logo?.aria ?? textos?.sitio?.nombre}
            title={textos?.sitio?.lema}
            onClick={() => setAbierto(false)}
          >
            <LogoCromoverso />
          </a>

          {/* Enlaces versión escritorio */}
          <nav className="navbar-enlaces-escritorio" aria-label={nav?.aria?.menu}>
            {Object.entries(nav?.enlaces ?? {}).map(([clave, etiqueta]) => (
              <a
                key={clave}
                className="cuerpo-p-fuerte navbar-enlace"
                href={DESTINOS[clave] ?? `#${clave}`}
                aria-current={activo === clave ? "page" : undefined}
              >
                {etiqueta}
              </a>
            ))}
          </nav>
        </div>

        {/* Acciones visibles en móvil  */}
        <div className="navbar-movil-acciones">
          {nav?.botones?.ingresar && (
            <a
              className="navbar-accion detalle-nota-fuerte navbar-accion-ingresar"
              href="#ingresar"
              onClick={() => setAbierto(false)}
            >
              {nav.botones.ingresar}
            </a>
          )}
          <button
            type="button"
            ref={botonMenu}
            className="navbar-icono boton-hamburguesa"
            aria-label={abrir}
            aria-expanded={abierto}
            aria-controls="navbar-menu-movil"
            onClick={() => setAbierto(true)}
          >
            <Icono nombre="menu" />
          </button>
        </div>

        {/* Utilidades escritorio  */}
        <div className="navbar-utilidades-escritorio">
          <button
            className="navbar-icono navbar-accesibilidad"
            type="button"
            aria-label={nav?.aria?.accesibilidad}
            aria-expanded={accesibilidadAbierta}
            onClick={() => setAccesibilidadAbierta(true)}
          >
            <Icono nombre="accesibilidad" />
          </button>
          <SelectorIdioma
            idioma={idioma}
            onCambiar={cambiarIdioma}
            etiqueta={nav?.aria?.idioma}
            codigos={textos?.idioma?.codigos}
          />
          {nav?.botones?.ingresar && (
            <a
              className="navbar-accion detalle-nota-fuerte navbar-accion-ingresar"
              href="#ingresar"
            >
              {nav.botones.ingresar}
            </a>
          )}
          {nav?.botones?.crearCuenta && (
            <a
              className="navbar-accion detalle-nota-fuerte navbar-accion-cuenta"
              href="#crear-cuenta"
            >
              {nav.botones.crearCuenta}
            </a>
          )}
        </div>
      </div>

      {/* Menú desplegable móvil  */}
      <div
        id="navbar-menu-movil"
        className={`navbar-drawer-movil${abierto ? " is-abierto" : ""}`}
        aria-hidden={!abierto}
      >
        <div className="drawer-cabecera">
          <a
            href="#inicio"
            className="navbar-marca"
            onClick={() => setAbierto(false)}
          >
            <LogoCromoverso />
          </a>
          <button
            type="button"
            className="navbar-icono"
            aria-label={cerrar}
            onClick={() => setAbierto(false)}
          >
            <Icono nombre="cerrar" />
          </button>
        </div>

        <nav className="drawer-enlaces" aria-label={nav?.aria?.menu}>
          <a
            href="#inicio"
            className={`drawer-item ${activo === "inicio" ? "is-activo" : ""}`}
            onClick={() => setAbierto(false)}
          >
            <span className="drawer-item-izq">
              <Icono nombre="inicio" />
              <span className="cuerpo-m-fuerte">{nav?.enlaces?.inicio ?? "Inicio"}</span>
            </span>
            {activo === "inicio" && (
              <span className="drawer-badge detalle-etiqueta">
                {menuMovil?.aria?.estasAqui ?? "ESTÁS AQUÍ"}
              </span>
            )}
          </a>

          <a
            href="#mundos"
            className={`drawer-item ${activo === "mundos" ? "is-activo" : ""}`}
            onClick={() => setAbierto(false)}
          >
            <span className="drawer-item-izq">
              <Icono nombre="mundo" />
              <span className="cuerpo-m-fuerte">{nav?.enlaces?.mundos ?? "Mundos"}</span>
            </span>
            <Icono nombre="chevronder" />
          </a>
        </nav>

        <div className="drawer-inferior">
          <div className="drawer-ajuste-fila">
            <span className="cuerpo-m-fuerte">{menuMovil?.secciones?.idioma ?? "Idioma"}</span>
            <SelectorIdioma
              idioma={idioma}
              onCambiar={cambiarIdioma}
              etiqueta={nav?.aria?.idioma}
              codigos={textos?.idioma?.codigos}
            />
          </div>

          <div className="drawer-ajuste-fila">
            <span className="cuerpo-m-fuerte">{menuMovil?.secciones?.accesibilidad ?? "Accesibilidad"}</span>
            <button
              className="navbar-icono navbar-accesibilidad"
              type="button"
              aria-label={nav?.aria?.accesibilidad}
              onClick={abrirModalAccesibilidad}
            >
              <Icono nombre="accesibilidad" />
            </button>
          </div>

          <div className="drawer-botones-cuenta">
            {nav?.botones?.ingresar && (
              <a
                className="boton-home secundario drawer-boton-cuenta"
                href="#ingresar"
                onClick={() => setAbierto(false)}
              >
                {nav.botones.ingresar}
              </a>
            )}
            {nav?.botones?.crearCuenta && (
              <a
                className="boton-home primario drawer-boton-cuenta drawer-boton-crear"
                href="#crear-cuenta"
                onClick={() => setAbierto(false)}
              >
                {nav.botones.crearCuenta}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Menú de accesibilidad desplegable */}
      <MenuAccesibilidad
        abierto={accesibilidadAbierta}
        onCerrar={() => setAccesibilidadAbierta(false)}
        accesibilidadTextos={textos?.accesibilidad}
        config={configAccesibilidad}
        onCambiarConfig={onCambiarAccesibilidad}
        onRestablecer={onRestablecerAccesibilidad}
      />
    </header>
  );
}
