import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import { useTextos } from "./hooks/useTextos";
import LayoutPublico from "./components/LayoutPublico.jsx";
import HeroCromoverso from "./components/HeroCromoverso.jsx";
import SeccionMundos from "./components/SeccionMundos.jsx";
import VistaMundo from "./components/VistaMundo.jsx";
import { obtenerCookie, establecerCookie, eliminarCookie } from "./utils/cookies";
import "./App.css";

const CONFIG_ACCESIBILIDAD_DEFAULT = {
  tamano: "normal",
  altoContraste: false,
  reducirMovimiento: false,
  subrayarEnlaces: false,
  fuenteLecturaFacil: false,
};

function DetalleCromoPlaceholder({ textos }) {
  const { id } = useParams();
  const titulo =
    textos?.paginas?.detalleCromo?.seo?.titulo?.replace("{nombre}", id) ?? id;
  const textoVolver = textos?.paginas?.albumMundo?.migas?.inicio ?? "Inicio";

  return (
    <div
      className="contenedor"
      style={{
        padding: "var(--espacio-7) var(--espacio-4)",
        textAlign: "center",
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--espacio-4)",
      }}
    >
      <h2 className="titular-h2">{titulo}</h2>
      <Link to="/mundos/neon" className="boton-home primario">
        {textoVolver}
      </Link>
    </div>
  );
}

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

  function gestionarCuenta(accion) {
    const destino = accion === "registro" ? "#crear-cuenta" : "#ingresar";
    window.location.hash = destino;
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
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroCromoverso
                  textos={textos}
                  abrirCuenta={gestionarCuenta}
                  onExplorar={() => {
                    const seccion = document.getElementById("mundos");
                    seccion?.scrollIntoView({ behavior: "smooth" });
                  }}
                />
                <SeccionMundos textos={textos} />
              </>
            }
          />
          <Route path="/inicio" element={<Navigate to="/" replace />} />
          <Route
            path="/mundos/:id"
            element={
              <VistaMundo
                textos={textos}
                cargandoTextos={cargando}
              />
            }
          />
          <Route
            path="/cromos/:id"
            element={<DetalleCromoPlaceholder textos={textos} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LayoutPublico>
    </div>
  );
}

export default App;
