import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import SaltarContenido from "./SaltarContenido.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import GestorCookies from "./GestorCookies.jsx";
import "./LayoutPublico.css";

export default function LayoutPublico({
  textos,
  cargando,
  error,
  recargar,
  idioma = "es",
  onCambiarIdioma,
  activo = "inicio",
  onBuscar,
  configAccesibilidad,
  onCambiarAccesibilidad,
  onRestablecerAccesibilidad,
  onCuenta,
  onConsentimientoCambio,
  children,
}) {
  const [cookiesAbiertas, setCookiesAbiertas] = useState(false);
  const disparador = useRef(null);
  const location = useLocation();

  const esVistaMundo = location.pathname.startsWith("/mundos");

  function abrirCookies() {
    disparador.current = document.activeElement;
    setCookiesAbiertas(true);
  }

  function cerrarCookies() {
    setCookiesAbiertas(false);
    disparador.current?.focus();
  }

  const saltarTexto = textos?.general?.aria?.saltarAlContenido;

  return (
    <div className={`layout-publico landing cromoverso ${esVistaMundo ? "layout-vista-mundo" : ""}`}>
      <SaltarContenido texto={saltarTexto} destino="#contenido" />
      <Navbar
        textos={textos}
        cargando={cargando}
        error={error}
        recargar={recargar}
        idioma={idioma}
        cambiarIdioma={onCambiarIdioma}
        activo={activo}
        onBuscar={onBuscar}
        configAccesibilidad={configAccesibilidad}
        onCambiarAccesibilidad={onCambiarAccesibilidad}
        onRestablecerAccesibilidad={onRestablecerAccesibilidad}
      />
      <main id="contenido" tabIndex={-1} className="contenido-principal">
        {children}
      </main>
      <Footer
        textos={textos}
        onCuenta={onCuenta}
        onAbrirCookies={abrirCookies}
      />
      <GestorCookies
        textos={textos}
        abierto={cookiesAbiertas}
        onAbrir={abrirCookies}
        onCerrar={cerrarCookies}
        onConsentimientoCambio={onConsentimientoCambio}
      />
    </div>
  );
}
