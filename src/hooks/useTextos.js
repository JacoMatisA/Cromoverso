import { useEffect, useState } from "react";

const API = "https://yanethm-cromoverso-api.fly.dev/api/v1/textos";

function validarTextos(datos) {
  const textos = datos?.textos;
  const nav = textos?.navbar;
  const enlaces = Object.values(nav?.enlaces ?? {});

  const etiquetas = [
    textos?.sitio?.nombre,
    textos?.sitio?.lema,
    nav?.logo?.aria,
    ...enlaces,
    nav?.buscador?.placeholder,
    nav?.buscador?.aria,
    nav?.botones?.ingresar,
    nav?.botones?.crearCuenta,
    nav?.aria?.idioma,
    nav?.aria?.accesibilidad,
    textos?.menuMovil?.abrir,
    textos?.menuMovil?.cerrar,
  ];

  if (enlaces.length === 0 || !etiquetas.every((valor) => typeof valor === "string" && valor.trim())) {
    throw new Error("La respuesta no contiene los textos del navbar.");
  }
  return textos;
}

export function useTextos(idioma) {
  const [textos, setTextos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    const limite = setTimeout(() => controlador.abort(), 12000);
    let vigente = true;
    setCargando(true);
    setError(false);
    setTextos(null);

    async function cargarTextosNavbar() {
      try {
        const respuesta = await fetch(`${API}?idioma=${encodeURIComponent(idioma)}`, {
          signal: controlador.signal,
        });
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const datos = await respuesta.json();
        const nuevosTextos = validarTextos(datos);
        if (vigente) setTextos(nuevosTextos);
      } catch (err) {
        if (vigente) {
          console.error("Error al cargar los textos:", err);
          setError(true);
        }
      } finally {
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
  }, [idioma, intento]);

  return {
    textos,
    cargando,
    error,
    recargar: () => setIntento((valor) => valor + 1),
  };
}
