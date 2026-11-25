import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import Icono from "./Icono.jsx";
import LogoCromoverso from "./LogoCromoverso.jsx";
import SelectorIdioma from "./SelectorIdioma.jsx";
import MenuAccesibilidad from "./MenuAccesibilidad.jsx";
import MenuCuenta, { Avatar } from "./MenuCuenta.jsx";
import { useSesion } from "../hooks/useSesion.js";

const DESTINOS = {
  inicio: "/",
  mundos: "/mundos/neon",
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
  const location = useLocation();
  const { usuario, salir } = useSesion();

  const seccionActiva = location.pathname.startsWith("/mundos")
    ? "mundos"
    : location.pathname === "/" || location.pathname === "/inicio"
    ? "inicio"
    : activo;

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
    <header className={`navbar navbar-${seccionActiva}`}>
      <div className="navbar-interior">
        <div className="navbar-izquierda">
          <Link
            to="/"
            className="navbar-marca"
            aria-label={nav?.logo?.aria ?? textos?.sitio?.nombre}
            title={textos?.sitio?.lema}
            onClick={() => setAbierto(false)}
          >
            <LogoCromoverso />
          </Link>

          {/* Enlaces versión escritorio */}
          <nav className="navbar-enlaces-escritorio" aria-label={nav?.aria?.menu}>
            {Object.entries(nav?.enlaces ?? {}).map(([clave, etiqueta]) => {
              const destino = DESTINOS[clave] ?? `/${clave}`;
              const esActivo = seccionActiva === clave;
              return (
                <Link
                  key={clave}
                  className="cuerpo-p-fuerte navbar-enlace"
                  to={destino}
                  aria-current={esActivo ? "page" : undefined}
                >
                  {etiqueta}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Acciones visibles en móvil  */}
        <div className="navbar-movil-acciones">
          {!usuario && nav?.botones?.ingresar && (
            <Link
              className="navbar-accion detalle-nota-fuerte navbar-accion-ingresar"
              to="/ingresar"
              onClick={() => setAbierto(false)}
            >
              {nav.botones.ingresar}
            </Link>
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
          {usuario ? (
            <MenuCuenta textos={nav?.usuario} />
          ) : (
            <>
              {nav?.botones?.ingresar && (
                <Link
                  className="navbar-accion detalle-nota-fuerte navbar-accion-ingresar"
                  to="/ingresar"
                >
                  {nav.botones.ingresar}
                </Link>
              )}
              {nav?.botones?.crearCuenta && (
                <Link
                  className="navbar-accion detalle-nota-fuerte navbar-accion-cuenta"
                  to="/registro"
                >
                  {nav.botones.crearCuenta}
                </Link>
              )}
            </>
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
          <Link
            to="/"
            className="navbar-marca"
            onClick={() => setAbierto(false)}
          >
            <LogoCromoverso />
          </Link>
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
          <Link
            to="/"
            className={`drawer-item ${seccionActiva === "inicio" ? "is-activo" : ""}`}
            onClick={() => setAbierto(false)}
          >
            <span className="drawer-item-izq">
              <Icono nombre="inicio" />
              <span className="cuerpo-m-fuerte">{nav?.enlaces?.inicio ?? "Inicio"}</span>
            </span>
            {seccionActiva === "inicio" && (
              <span className="drawer-badge detalle-etiqueta">
                {menuMovil?.aria?.estasAqui ?? "ESTÁS AQUÍ"}
              </span>
            )}
          </Link>

          <Link
            to="/mundos/neon"
            className={`drawer-item ${seccionActiva === "mundos" ? "is-activo" : ""}`}
            onClick={() => setAbierto(false)}
          >
            <span className="drawer-item-izq">
              <Icono nombre="mundo" />
              <span className="cuerpo-m-fuerte">{nav?.enlaces?.mundos ?? "Mundos"}</span>
            </span>
            <Icono nombre="chevronder" />
          </Link>
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

          {usuario ? (
            <div className="drawer-sesion-usuario">
              <Avatar usuario={usuario} variante="propio" />
              <div className="drawer-sesion-persona">
                <p className="drawer-sesion-nombre cuerpo-m-fuerte">
                  {usuario.nombre}
                </p>
                {usuario.alias && (
                  <p className="drawer-sesion-alias detalle-nota">
                    @{usuario.alias}
                  </p>
                )}
              </div>
              <button
                type="button"
                className="boton boton--secundario boton--p drawer-boton-salir"
                onClick={() => {
                  setAbierto(false);
                  salir();
                }}
              >
                <Icono nombre="salir" />
                <span>{menuMovil?.botones?.cerrarSesion ?? nav?.usuario?.cerrarSesion}</span>
              </button>
            </div>
          ) : (
            <div className="drawer-botones-cuenta">
              {nav?.botones?.ingresar && (
                <Link
                  className="boton-home secundario drawer-boton-cuenta"
                  to="/ingresar"
                  onClick={() => setAbierto(false)}
                >
                  {nav.botones.ingresar}
                </Link>
              )}
              {nav?.botones?.crearCuenta && (
                <Link
                  className="boton-home primario drawer-boton-cuenta drawer-boton-crear"
                  to="/registro"
                  onClick={() => setAbierto(false)}
                >
                  {nav.botones.crearCuenta}
                </Link>
              )}
            </div>
          )}
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
