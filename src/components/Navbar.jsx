import { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import Icono from "./Icono.jsx";
import LogoCromoverso from "./LogoCromoverso.jsx";

const DESTINOS = {
  album: "#album", /* con /inicio se redirecciona a otra landing */
  sobres: "#sobres",
  intercambios: "#intercambios",
  mundos: "#mundos",
  ranking: "#ranking",
};

const Navbar = ({ textos, cargando, error, recargar, idioma, cambiarIdioma, activo, onBuscar, textoGrande, alternarTexto }) => { /* Navbar es hijo de Main  */
  /* Antes del return se escribe JS */
  const [abierto, setAbierto] = useState(false); // Saber si el toogle de mobile esta abierto
  const [busqueda, setBusqueda] = useState(""); //Sin valor a buscar
  const botonMenu = useRef(null);
  const campoBusqueda = useRef(null);
  const nav = textos?.navbar;
  const ingles = idioma === "en"; //toma el valor de la variable idioma solo cuando es ingles

  const abrir =
    textos?.menuMovil?.abrir ?? (ingles ? "Open menu" : "Abrir menu");
  const cerrar =
    textos?.menuMovil?.cerrar ?? (ingles ? "Close menu" : "Cerrar menu");

  const enlaces = Object.entries(nav?.enlaces ?? {}).filter(
    ([clave]) => DESTINOS[clave],
  );

  //Abrir y cerrar el menu toogle en vista mobile
  useEffect(() => {
    function cerrarConEscape(evento) {
      if (!abierto) return; //Unicamnete se registre el listener mientras el menu este abierto
      if (evento.key === "Escape" && abierto) {
        setAbierto(false); // Cierra el menu
        botonMenu.current?.focus(); // devuelve el foco al boton del menu
      }
    }
    document.addEventListener("keydown", cerrarConEscape); //Escucha las teclas en todo el documento
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [abierto]);

  // Campo para buscar cualquier palabra o frase dentro de nuestro sitio
  function abrirBusqueda(evento) {
    setAbierto(true);
    requestAnimationFrame(() => campoBusqueda.current?.focus());
  }

  function buscar(evento) {
    evento.preventDefault(); // cancelar la accion que el navegador haria por defecto antes ese evento
    const consulta = busqueda.trim();
    if (!consulta) return;
    onBuscar(consulta);
    setAbierto(false);
  }
  
  return (
    /* Dentro del return es escribe HTML */
    /* className = class de html normal */
    <header className="navbar">
      <nav
        className={`navbar-interior${abierto ? " is-abierto" : ""}`}
        aria-label={nav?.aria?.menu ?? "Navegación principal"}
      >
        <div className="navbar-izquierda">
          <a
            href="#inicio"
            className="navbar-marca"
            aria-label={nav?.logo?.aria ?? textos?.sitio?.nombre ?? "Cromoverso"}
            title={textos?.sitio?.lema}
            onClick={() => setAbierto(false)}
          >
            <span aria-hidden="true">
              <LogoCromoverso />
            </span>
          </a>
          {nav && <ul className="navbar-enlaces ">
            {enlaces.map(([clave, etiqueta]) => <li key={clave}><a className="cuerpo-p-fuerte"href={DESTINOS[clave]} aria-current={activo === clave ? "page" : undefined} onClick={() => setAbierto(false)}>{etiqueta}</a></li>)}
          </ul>}
        </div>

        {/* Acciones del navbar movil */}
        <div className="navbar-movil-acciones">
          <button
            type="button"
            className="navbar-icono"
            aria-label={nav?.botones?.ingresar ?? "Ingresar"}
          >
            {nav?.botones?.ingresar && <a className="navbar-accion detalle-nota-fuerte" href="#ingresar" onClick={() => setAbierto(false)}>{nav.botones.ingresar}</a>}

          </button>
          <button
            type="button"
            ref={botonMenu}
            className="navbar-icono navbar-menu-opciones"
            aria-label={abierto ? cerrar : abrir}
            aria-expanded={abierto}
            aria-controls="navbar-panel"
            onClick={() => setAbierto((valor) => !valor)}
          >
            <Icono nombre={abierto ? "cerrar" : "menu"} />
          </button>
        </div>

        <div id="navbar-panel" className={`navbar-panel${abierto ? " is-abierto" : ""}`} aria-busy={cargando}>
          {cargando && <p className="navbar-estado" role="status">{ingles ? "Loading navigation…" : "Cargando navegación…"}</p>}
          {error && <div className="navbar-estado" role="alert"><p>{ingles ? "Navigation could not be loaded." : "No pudimos cargar el menú."}</p><button type="button" onClick={recargar}>{ingles ? "Try again" : "Reintentar"}</button></div>}
          {nav && <>
            <form className="navbar-buscador" role="search" aria-label={nav.buscador.aria} onSubmit={buscar}>
              <button type="submit" aria-label={nav.buscador.aria}><Icono nombre="buscar" /></button>
              <input className="cuerpo-p"ref={campoBusqueda} type="search" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} placeholder={nav.buscador.placeholder} aria-label={nav.buscador.aria} required />
            </form>
          </>}
          <div className="navbar-utilidades">
            <label className="navbar-idioma cuerpo-p-fuerte"><Icono nombre="globo" /><select value={idioma} onChange={(evento) => cambiarIdioma(evento.target.value)} aria-label={nav?.aria?.idioma ?? "Cambiar idioma"}><option className="cuerpo-p-fuerte"value="es">ES</option><option className="cuerpo-p-fuerte" value="en">EN</option></select> <Icono nombre={"chevronabajo"}/></label>
            <button className="navbar-icono navbar-accesibilidad" type="button" aria-label={nav?.aria?.accesibilidad ?? (ingles ? "Enlarge text" : "Aumentar texto")} aria-pressed={textoGrande} onClick={alternarTexto}><Icono nombre="accesibilidad" /></button>
            {nav && <>
              {nav.botones?.ingresar && <a className="navbar-accion detalle-nota-fuerte" href="#ingresar" onClick={() => setAbierto(false)}>{nav.botones.ingresar}</a>}
              {nav.botones?.crearCuenta && <a className="navbar-accion" href="#crear-cuenta" onClick={() => setAbierto(false)}>{nav.botones.crearCuenta}</a>}
            </>}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
