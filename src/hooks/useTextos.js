import { useEffect, useState } from "react";

const API = "https://yanethm-cromoverso-api.fly.dev/api/v1/textos";
const CLAVES_MENU = ["album", "sobres", "intercambios", "mundos", "ranking"];

function validarTextos(datos){
    const textos = datos?.textos;
    const nav = textos?.navbar;
    const etiquetas=[
        textos?.sitio?.nombre,
        textos?.sitio?.lema,
        nav?.logo?.aria,
        ...CLAVES_MENU.map((clave) => nav?.enlaces?.[clave]),
        nav?.buscador?.placeholder,
        nav?.buscador?.aria,
        nav?.botones?.ingresar,
        nav?.botones?.crearCuenta,
        nav?.aria?.idioma,
        nav?.aria?.accesibilidad,
        textos?.menuMovil?.abrir,
        textos?.menuMovil?.cerrar,
    ];

    if (!etiquetas.every((valor) => typeof valor === "string" && valor.trim())){
        /* trim elimina los espacios antes y despues de la palabra */
        throw new Error("La respuesta no contiene los textos del navbar.");
    }
    return textos;
}

export function useTextos(idioma){
    const [textos, setTextos] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);
    const [intento, setIntento] = useState(0);

    useEffect (() => { /* useEffect se ejecuta cuando las variables asignadas al final se modifican */
        const controlador = new AbortController();
        const limite = setTimeout(() => controlador.abort(), 12000);
        let vigente = true; 
        setCargando(true);
        setError(false);
        setTextos(null);

        async function cargarTextosNavbar() {
            try{
                const respuesta = await fetch(`${API}?idioma=${encodeURIComponent(idioma)}`,{
                    signal: controlador.signal,
                });
                if(!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
                //Si sí respondió los datos correctamente:
                const datos = await respuesta.json();
                const nuevosTextos = validarTextos(datos);
                if (vigente) setTextos(nuevosTextos);
                
            } catch(error){
                if (vigente) { /* vigente determina si se sigue dentro de la ventana de los 12 segundos */
                    console.error("Error al cargar los textos:", error);
                    setError(true);
                }
            }finally{
                clearTimeout(limite);
                if (vigente) setCargando(false);
            }
        }

        cargarTextosNavbar();
        return () => {
            vigente = false;
            clearTimeout(limite);
            controlador.abort();
        };
    }, [idioma, intento])/* idioma, intento son las variables que se vigilan
                            para ejeutar algo cuando estas cambien */

    return {
        textos,
        cargando,
        error,
        recargar: () => setIntento((valor)=> valor +  1)
    };
}