import { useEffect, useState } from "react";
import HeroCromoverso from "./HeroCromoverso.jsx";
import SeccionMundos from "./SeccionMundos.jsx";
import { obtenerRivales } from "../services/api.js";
import "./VistaMundo.css";
import TarjetaCromo from "./TarjetaCromo.jsx";

// vista principal de inicio, junta el hero y los mundos para que no quede regado en el router
export default function VistaInicio({ textos, abrirCuenta }) {
  const [rivales, setRivales] = useState([]);
  useEffect(() => {
    obtenerRivales(TarjetaCromo.id).then(setRivales);
  }, []);
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

      <section className="seccion-mundos" id="mundos" aria-labelledby="titulo-seccion-mundos">
      <div className="contenedor">
        <div className="cabecera-mundos">
          <div>
            <h2 id="titulo-seccion-mundos" className="titular-h2">
              villanos
            </h2>
            <p className="cuerpo-m subtitulo-mundos">
              villanos
            </p>
          </div>
        </div>
        <div className="catalogo-grilla-cromos">
                          {rivales.map((cromo) => (
                            <TarjetaCromo
                              key={cromo.id}
                              cromo={cromo}
                              textos={textos}
                            />
                          ))}
                        </div>
      </div>
      </section>
    </>
  );
}
