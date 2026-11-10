import HeroCromoverso from "./HeroCromoverso.jsx";
import SeccionMundos from "./SeccionMundos.jsx";

// vista principal de inicio, junta el hero y los mundos para que no quede regado en el router
export default function VistaInicio({ textos, abrirCuenta }) {
  // funcion para el boton de explorar que baja suavemente hasta la seccion mundos
  function bajarAMundos() {
    const seccion = document.getElementById("mundos");
    seccion?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      {/* banner principal con el CTA(call to action) */}
      <HeroCromoverso
        textos={textos}
        abrirCuenta={abrirCuenta}
        onExplorar={bajarAMundos}
      />

      {/* catalogo con las tarjetas de los mundos */}
      <SeccionMundos textos={textos} />
    </>
  );
}
