import { Link } from "react-router-dom";
import Icono from "./Icono.jsx";
import "./SeccionMundos.css";

const MUNDOS_LISTA = [
  { clave: "neon", nombre: "Ciudad Neón", numero: 1, icono: "rayo", clase: "tarjeta-mundo-neon", tieneTag: true },
  { clave: "coral", nombre: "Abismo Coral", numero: 2, icono: "mundo", clase: "tarjeta-mundo-coral" },
  { clave: "bosque", nombre: "Bosque Eterno", numero: 3, icono: "estrella", clase: "tarjeta-mundo-bosque" },
  { clave: "forja", nombre: "Forja Volcánica", numero: 4, icono: "llama", clase: "tarjeta-mundo-forja" },
  { clave: "orbita", nombre: "Estación Órbita", numero: 5, icono: "mundo", clase: "tarjeta-mundo-orbita" },
  { clave: "niebla", nombre: "Reino de Niebla", numero: 6, icono: "ojo", clase: "tarjeta-mundo-niebla" },
];

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
            <Link
              key={mundo.clave}
              to={`/mundos/${mundo.clave}`}
              className={`tarjeta-mundo ${mundo.clase}`}
              style={{ textDecoration: "none" }}
            >
              <div className="tarjeta-mundo-cabecera">
                <div className="icono-circulo-mundo" aria-hidden="true">
                  <Icono nombre={mundo.icono} />
                </div>
                {mundo.tieneTag && (
                  <span className="mundo-tag detalle-etiqueta">
                    {plantillaMundo.replace("{numero}", mundo.numero)}
                  </span>
                )}
              </div>
              <div className="tarjeta-mundo-info">
                <h3 className="cromo-nombre-g">{mundo.nombre}</h3>
                <p className="cuerpo-p tarjeta-mundo-conteo">
                  {plantillaCromos.replace("{cantidad}", "20")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
