import Icono from "./Icono.jsx";
import IlustracionHeroe from "./IlustracionHeroe.jsx";
import "./AbanicoCromos.css";

const CROMOS_HERO = [
  {
    posicion: "izquierda",
    numero: "041",
    nombre: "Raíz Madre",
    mundo: "Bosque Eterno",
    tipo: "Héroe",
    colorBase: "#2E9E4F",
    corona: false,
  },
  {
    posicion: "centro",
    numero: "001",
    nombre: "Voltia",
    mundo: "Ciudad Neón",
    tipo: "Héroe",
    colorBase: "#7C4DFF",
    corona: true,
  },
  {
    posicion: "derecha",
    numero: "081",
    nombre: "Astra",
    mundo: "Estación Órbita",
    tipo: "Héroe",
    colorBase: "#2563EB",
    corona: true,
  },
];

export default function AbanicoCromos({ etiquetaGuardiana, formatoTipo = "{mundo} · {tipo}" }) {
  const cromoIzq = CROMOS_HERO[0];
  const cromoCentro = CROMOS_HERO[1];
  const cromoDer = CROMOS_HERO[2];

  function formatearDetalle(cromo) {
    return formatoTipo
      .replace("{mundo}", cromo.mundo)
      .replace("{tipo}", cromo.tipo);
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
            <IlustracionHeroe colorBase={cromoIzq.colorBase} />
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
            <IlustracionHeroe colorBase={cromoCentro.colorBase} />
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
            <IlustracionHeroe colorBase={cromoDer.colorBase} />
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
