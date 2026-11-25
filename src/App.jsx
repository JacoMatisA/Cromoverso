import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useTextos } from "./hooks/useTextos";
import LayoutPublico from "./components/LayoutPublico.jsx";
import VistaInicio from "./components/VistaInicio.jsx";
import VistaMundo from "./components/VistaMundo.jsx";
import VistaDetalleCromo from "./components/DetalleCromo/VistaDetalleCromo.jsx";
import Ingresar from "./components/Ingresar.jsx";
import VistaRegistro from "./components/VistaRegistro.jsx";
import VistaRecuperarClave from "./components/VistaRecuperarClave.jsx";
import { obtenerCookie, establecerCookie, eliminarCookie } from "./utils/cookies";
import "./App.css";

const CONFIG_ACCESIBILIDAD_DEFAULT = {
  tamano: "normal",
  altoContraste: false,
  reducirMovimiento: false,
  subrayarEnlaces: false,
  fuenteLecturaFacil: false,
};

function App() {
  const [idioma, setIdioma] = useState(() => {
    try {
      const consentimiento = obtenerCookie("consentimiento");
      if (consentimiento === "aceptado") {
        const idiomaGuardado = obtenerCookie("idioma");
        if (idiomaGuardado === "es" || idiomaGuardado === "en") {
          return idiomaGuardado;
        }
      }
    } catch (e) {
      console.warn("No se pudo leer la cookie de idioma:", e);
    }
    return "es";
  });

  const [configAccesibilidad, setConfigAccesibilidad] = useState(CONFIG_ACCESIBILIDAD_DEFAULT);

  const { textos, cargando, error, recargar } = useTextos(idioma);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  // Aplicación de configuraciones de accesibilidad
  useEffect(() => {
    if (configAccesibilidad.tamano === "grande") {
      document.documentElement.style.fontSize = "112%";
    } else if (configAccesibilidad.tamano === "muyGrande") {
      document.documentElement.style.fontSize = "125%";
    } else {
      document.documentElement.style.fontSize = "";
    }

    document.documentElement.classList.toggle("alto-contraste", configAccesibilidad.altoContraste);
    document.documentElement.classList.toggle("reducir-movimiento", configAccesibilidad.reducirMovimiento);
    document.documentElement.classList.toggle("subrayar-enlaces", configAccesibilidad.subrayarEnlaces);
    document.documentElement.classList.toggle("fuente-lectura-facil", configAccesibilidad.fuenteLecturaFacil);

    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [configAccesibilidad]);

  function cambiarAjusteAccesibilidad(clave, valor) {
    setConfigAccesibilidad((prev) => ({
      ...prev,
      [clave]: valor,
    }));
  }

  function restablecerAccesibilidad() {
    setConfigAccesibilidad(CONFIG_ACCESIBILIDAD_DEFAULT);
  }

  function cambiarIdioma(nuevoIdioma) {
    setIdioma(nuevoIdioma);
    try {
      const consentimiento = obtenerCookie("consentimiento");
      if (consentimiento === "aceptado") {
        establecerCookie("idioma", nuevoIdioma, 365);
      } else {
        eliminarCookie("idioma");
      }
    } catch (e) {
      console.warn("Error al gestionar cookie de idioma:", e);
    }
  }

  function gestionarConsentimiento(decision) {
    try {
      if (decision === "aceptado") {
        establecerCookie("idioma", idioma, 365);
      } else if (decision === "rechazado") {
        eliminarCookie("idioma");
      }
    } catch (e) {
      console.warn("Error al gestionar consentimiento e idioma:", e);
    }
  }

  const navigate = useNavigate();

  function gestionarCuenta(accion) {
    const destino = accion === "registro" ? "/registro" : "/ingresar";
    navigate(destino);
  }

  return (
    <div className="sitio">
      <LayoutPublico
        textos={textos}
        cargando={cargando}
        error={error}
        recargar={recargar}
        idioma={idioma}
        onCambiarIdioma={cambiarIdioma}
        configAccesibilidad={configAccesibilidad}
        onCambiarAccesibilidad={cambiarAjusteAccesibilidad}
        onRestablecerAccesibilidad={restablecerAccesibilidad}
        onCuenta={gestionarCuenta}
        onConsentimientoCambio={gestionarConsentimiento}
      >
        {/* enrutador de las vistas principales */}
        <Routes>
          {/* pagina de inicio */}
          <Route
            path="/"
            element={
              <VistaInicio
                textos={textos}
                abrirCuenta={gestionarCuenta}
              />
            }
          />
          {/* si entran a /inicio lo mandamos directo al / */}
          <Route path="/inicio" element={<Navigate to="/" replace />} />
          {/* vista dinamica para cada mundo segun el parametro :id */}
          <Route
            path="/mundos/:id"
            element={
              <VistaMundo
                textos={textos}
                cargandoTextos={cargando}
              />
            }
          />
          {/* pantalla de detalle del cromo individual */}
          <Route
            path="/cromos/:id"
            element={
              <VistaDetalleCromo
                textos={textos}
                cargandoTextos={cargando}
              />
            }
          />
          {/* vista 4: iniciar sesion */}
          <Route
            path="/ingresar"
            element={<Ingresar textos={textos} />}
          />
          {/* vistas provisionales de cuenta */}
          <Route
            path="/registro"
            element={<VistaRegistro textos={textos} />}
          />
          <Route
            path="/recuperar-clave"
            element={<VistaRecuperarClave textos={textos} />}
          />
          {/* cualquier ruta rara que no exista manda para home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LayoutPublico>
    </div>
  );
}

export default App;
