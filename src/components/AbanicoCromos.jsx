import Icono from "./Icono.jsx";
import ArteCromo from "./ArteCromo.jsx";
import { obtenerIlustracion } from "../assets/imagenes";
import "./AbanicoCromos.css";

// Mantenemos IlustracionHeroe disponible como alias / fallback por compatibilidad
export function IlustracionHeroe(props) {
  return <ArteCromo {...props} />;
}

export function IlustracionHeroBanner({ alt = "Abanico de cromos del Cromoverso" }) {
  const ilustracion = obtenerIlustracion("abanico-de-cromos");
  if (!ilustracion) return null;

  return (
    <picture className="abanico-imagen-marco">
      {ilustracion.srcSet && <source srcSet={ilustracion.srcSet} />}
      <img
        src={ilustracion.src}
        alt={alt}
        className="abanico-imagen-hero"
        loading="eager"
        decoding="async"
      />
    </picture>
  );
}

const CROMOS_HERO = [
  {
    posicion: "izquierda",
    id: "CV-041",
    numero: "041",
    nombre: "Raíz Madre",
    mundo: "Bosque Eterno",
    tipo: "Héroe",
    colorBase: "#2E9E4F",
    figura: "destellos",
    corona: false,
  },
  {
    posicion: "centro",
    id: "CV-001",
    numero: "001",
    nombre: "Voltia",
    mundo: "Ciudad Neón",
    tipo: "Héroe",
    colorBase: "#7C4DFF",
    figura: "rayo",
    corona: true,
  },
  {
    posicion: "derecha",
    id: "CV-081",
    numero: "081",
    nombre: "Astra",
    mundo: "Estación Órbita",
    tipo: "Héroe",
    colorBase: "#2563EB",
    figura: "estrella",
    corona: true,
  },
];

export default function AbanicoCromos({
  etiquetaGuardiana,
  formatoTipo = "{mundo} · {tipo}",
  usarIlustracionEstatica = false,
}) {
  const cromoIzq = CROMOS_HERO[0];
  const cromoCentro = CROMOS_HERO[1];
  const cromoDer = CROMOS_HERO[2];

  function formatearDetalle(cromo) {
    return formatoTipo
      .replace("{mundo}", cromo.mundo)
      .replace("{tipo}", cromo.tipo);
  }

  if (usarIlustracionEstatica) {
    return (
      <div className="abanico-cromos" role="region" aria-label={etiquetaGuardiana ?? "Cromos destacados"}>
        {etiquetaGuardiana && (
          <div className="abanico-guardiana-badge">
            <Icono nombre="destellos" />
            <span>{etiquetaGuardiana.toUpperCase()}</span>
          </div>
        )}
        <IlustracionHeroBanner alt={etiquetaGuardiana ?? "Abanico de cromos del Cromoverso"} />
      </div>
    );
  }

  return (
    <div className="abanico-cromos" role="region" aria-label={etiquetaGuardiana ?? "Cromos destacados"}>
      {etiquetaGuardiana && (
        <div className="abanico-guardiana-badge">
          <Icono nombre="destellos" />
          <span>{etiquetaGuardiana.toUpperCase()}</span>
        </div>
      )}

      <div className="abanico-cartas-contenedor">
        {/* Carta izquierda (041 - Raíz Madre) */}
        <div className="carta-figma carta-izquierda">
          <div className="carta-cabecera">
            <span className="carta-numero dato-numero-de-cromo">
              {cromoIzq.numero}
            </span>
          </div>
          <div className="carta-ilustracion-marco">
            <ArteCromo
              id={cromoIzq.id}
              nombre={cromoIzq.nombre}
              colorBase={cromoIzq.colorBase}
              figura={cromoIzq.figura}
            />
          </div>
          <div className="carta-pie">
            <strong className="cromo-nombre-m">{cromoIzq.nombre}</strong>
            <span className="detalle-nota">{formatearDetalle(cromoIzq)}</span>
          </div>
        </div>

        {/* Carta centro destacada (001 - Voltia) */}
        <div className="carta-figma carta-centro">
          <div className="carta-cabecera">
            <span className="carta-numero dato-numero-de-cromo">
              {cromoCentro.numero}
            </span>
            <span className="carta-icono-corona" aria-hidden="true">
              <Icono nombre="corona" />
            </span>
          </div>
          <div className="carta-ilustracion-marco">
            <ArteCromo
              id={cromoCentro.id}
              nombre={cromoCentro.nombre}
              colorBase={cromoCentro.colorBase}
              figura={cromoCentro.figura}
            />
          </div>
          <div className="carta-pie">
            <strong className="cromo-nombre-g">{cromoCentro.nombre}</strong>
            <span className="detalle-nota-fuerte">{formatearDetalle(cromoCentro)}</span>
          </div>
        </div>

        {/* Carta derecha (081 - Astra) */}
        <div className="carta-figma carta-derecha">
          <div className="carta-cabecera">
            <span className="carta-numero dato-numero-de-cromo">
              {cromoDer.numero}
            </span>
            <span className="carta-icono-corona" aria-hidden="true">
              <Icono nombre="corona" />
            </span>
          </div>
          <div className="carta-ilustracion-marco">
            <ArteCromo
              id={cromoDer.id}
              nombre={cromoDer.nombre}
              colorBase={cromoDer.colorBase}
              figura={cromoDer.figura}
            />
          </div>
          <div className="carta-pie">
            <strong className="cromo-nombre-m">{cromoDer.nombre}</strong>
            <span className="detalle-nota">{formatearDetalle(cromoDer)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
