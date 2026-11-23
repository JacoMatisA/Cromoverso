import { Link } from "react-router-dom";
import TarjetaMundo from "./cards/TarjetaMundo.jsx";
import "./SeccionMundos.css";

const MUNDOS_LISTA = [
  { clave: "neon", nombre: "Ciudad Neón", numero: 1, icono: "rayo", clase: "tarjeta-mundo-neon", tieneTag: true },
  { clave: "coral", nombre: "Abismo Coral", numero: 2, icono: "mundo", clase: "tarjeta-mundo-coral" },
  { clave: "bosque", nombre: "Bosque Eterno", numero: 3, icono: "destellos", clase: "tarjeta-mundo-bosque" },
  { clave: "forja", nombre: "Forja Volcánica", numero: 4, icono: "llama", clase: "tarjeta-mundo-forja" },
  { clave: "orbita", nombre: "Estación Órbita", numero: 5, icono: "estrella", clase: "tarjeta-mundo-orbita" },
  { clave: "niebla", nombre: "Reino de Niebla", numero: 6, icono: "ojo", clase: "tarjeta-mundo-niebla" },
];

/**
 * SeccionMundos: Sección de la página de inicio que lista los mundos temáticos.
 * Renderiza la grilla de mundos componiendo el componente reutilizable TarjetaMundo.
 */
export default function SeccionMundos({ textos }) {
  const mundosInfo = textos?.paginas?.inicio?.mundos;
  if (!mundosInfo) return null;

  const plantillaCromos = mundosInfo?.etiquetas?.cromos ?? "{cantidad} cromos";
  const plantillaMundo = mundosInfo?.etiquetas?.mundo ?? "Mundo {numero}";
  const textoVer = mundosInfo?.enlaces?.ver
    ? mundosInfo.enlaces.ver.replace("{mundo}", "Ciudad Neón")
    : null;

  return (
    <section className="seccion-mundos" id="mundos" aria-labelledby="titulo-seccion-mundos">
      <div className="contenedor">
        <div className="cabecera-mundos">
          <div>
            <h2 id="titulo-seccion-mundos" className="titular-h2">
              {mundosInfo.titulo}
            </h2>
            <p className="cuerpo-m subtitulo-mundos">
              {mundosInfo.subtitulo}
            </p>
          </div>
          {textoVer && (
            <Link to="/mundos/neon" className="enlace-ver-mundo cuerpo-p-fuerte">
              <span>&rarr;</span> {textoVer}
            </Link>
          )}
        </div>

        <div className="grilla-mundos">
          {MUNDOS_LISTA.map((mundo) => (
            <TarjetaMundo
              key={mundo.clave}
              clave={mundo.clave}
              nombre={mundo.nombre}
              numero={mundo.numero}
              icono={mundo.icono}
              clase={mundo.clase}
              tieneTag={mundo.tieneTag}
              totalCromos={20}
              etiquetaMundo={plantillaMundo}
              etiquetaCromos={plantillaCromos}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
