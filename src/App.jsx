import { useEffect, useState } from "react";
import { useTextos } from "./hooks/useTextos";
import LayoutPublico from "./components/LayoutPublico.jsx";
import HeroCromoverso from "./components/HeroCromoverso.jsx";
import SeccionMundos from "./components/SeccionMundos.jsx";
import "./App.css";

const CONFIG_ACCESIBILIDAD_DEFAULT = {
  tamano: "normal",
  altoContraste: false,
  reducirMovimiento: false,
  subrayarEnlaces: false,
  fuenteLecturaFacil: false,
};

function leerSeccion() {
  return window.location.hash.slice(1) || "inicio";
}

function App() {
  const [idioma, setIdioma] = useState("es");
  const [activo, setActivo] = useState(leerSeccion);
  const [configAccesibilidad, setConfigAccesibilidad] = useState(CONFIG_ACCESIBILIDAD_DEFAULT);

  const { textos, cargando, error, recargar } = useTextos(idioma);

  useEffect(() => {
    function actualizar() {
      setActivo(leerSeccion());
    }
    window.addEventListener("hashchange", actualizar);
    return () => window.removeEventListener("hashchange", actualizar);
  }, []);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  // Aplicación de configuraciones de accesibilidad
  useEffect(() => {
    // Tamaño de fuente: 'normal' es el predeterminado (100%), 'grande' (112%), 'muyGrande' (125%)
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
        onCambiarIdioma={setIdioma}
        activo={activo}
        configAccesibilidad={configAccesibilidad}
        onCambiarAccesibilidad={cambiarAjusteAccesibilidad}
        onRestablecerAccesibilidad={restablecerAccesibilidad}
        onCuenta={gestionarCuenta}
      >
        <HeroCromoverso
          textos={textos}
          abrirCuenta={gestionarCuenta}
          onExplorar={() => {
            window.location.hash = "#mundos";
          }}
        />
        <SeccionMundos textos={textos} />
      </LayoutPublico>
    </div>
  );
}

export default App;
