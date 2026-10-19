import { useTextos } from "./hooks/useTextos";
import "./App.css";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";

function leerSeccion(){
    return window.location.hash.slice(1) || "inicio"; /* hash es #, se parte la url hasta encontrar un # para determinar en que pagina se encuentra
                                                        Para el proyecto se cambia hash por slash ya que si hay landing diferentes */
                                                        /* Slice(1) quita 1 caracter de izq a der */
}

function App() {
    /* idioma por defecto español */
    const [idioma,setIdioma] = useState("es");
    const [activo,setActivo] = useState(leerSeccion); /* toma valores dependiendo de la landing actual eliminando la url */
    const [consulta,setConsulta] = useState("");
    const [textoGrande,setTextoGrande] = useState(false); /* se inicia con el modo de accesibilidad desactivado */
    const datos = useTextos(idioma);
        //Va a sincronizar el estado del componente con el hash de la URL
        //Estructura useEffect(() => {}, [])
    useEffect(() => {
            function actualizar() {
                setActivo(leerSeccion());
                setConsulta("");
            }
            window.addEventListener("hashchange", actualizar);
            return () => window.removeEventListener("hashchange", actualizar);
    }, [])/* con las llaves vacias es porque se esta montando el componente */

    useEffect(() => {
        document.documentElement.lang = idioma;
    }, [idioma]);

    useEffect(() => {
        document.documentElement.style.fontSize = textoGrande ? "112%" : "";
        return () =>
            {document.documentElement.style.fontSize = ""
        };
    }, [textoGrande]);

    function buscar (valor){
        setConsulta(valor);
        setActivo("heroes");
        //window.history es el que da acceso al historial de la pesta;na
        window.history.replaceState(null, "#heroes");
    }

    return (
        <>
            <Navbar 
            {...datos} 
            idioma={idioma} 
            cambiarIdioma={setIdioma} 
            activo={activo}
            onBuscar={buscar}
            textoGrande={textoGrande}
            alternarTexto={() => setTextoGrande((valor) => !valor)}/>
            {/* <main className="contenedor contenido" id="inicio"></main> */}
        </>
    );

    
}
export default App;