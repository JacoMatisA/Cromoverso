import { useEffect, useState } from "react";
import Icono from "./Icono.jsx";
import ArteCromo from "./ArteCromo.jsx";
import { obtenerIlustracion } from "../assets/imagenes";
import { obtenerCromosHero } from "../services/api.js";
import "./AbanicoCromos.css";

// Cromos por defecto idénticos al diseño de Figma (en caso de que la API tarde o no responda)
const CROMOS_HERO_DEFECTO = {
  cromoIzq: {
    id: "CV-041",
    numero: 41,
    nombre: "Raíz Madre",
    mundoNombre: "Bosque Eterno",
    tipoNombre: "Héroe",
    corona: false,
  },
  cromoCentro: {
    id: "CV-001",
    numero: 1,
    nombre: "Voltia",
    mundoNombre: "Ciudad Neón",
    tipoNombre: "Héroe",
    corona: true,
  },
  cromoDer: {
    id: "CV-081",
    numero: 81,
    nombre: "Astra",
    mundoNombre: "Órbita Prisma",
    tipoNombre: "Héroe",
    corona: true,
  },
};

// Mantenemos IlustracionHeroe disponible como alias / fallback por compatibilidad
export function IlustracionHeroe(props) {
  return <ArteCromo {...props} />;
}

export function IlustracionHeroBanner({ alt }) {
  const ilustracion = obtenerIlustracion("abanico-de-cromos");
  if (!ilustracion) return null;

  return (
    <picture className="abanico-imagen-marco">
      {ilustracion.srcSet && <source srcSet={ilustracion.srcSet} />}
      <img
        src={ilustracion.src}
        alt={alt ?? ""}
        className="abanico-imagen-hero"
        loading="eager"
        decoding="async"
      />
    </picture>
  );
}

export default function AbanicoCromos({
  etiquetaGuardiana,
  formatoTipo = "{mundo} • {tipo}",
  usarIlustracionEstatica = false,
}) {
  const [cartas, setCartas] = useState(null);

  useEffect(() => {
    let activo = true;
    obtenerCromosHero()
      .then((resultado) => {
        if (activo && resultado) {
          setCartas((prev) => ({
            cromoIzq: resultado.cromoIzq || prev?.cromoIzq || CROMOS_HERO_DEFECTO.cromoIzq,
            cromoCentro: resultado.cromoCentro || prev?.cromoCentro || CROMOS_HERO_DEFECTO.cromoCentro,
            cromoDer: resultado.cromoDer || prev?.cromoDer || CROMOS_HERO_DEFECTO.cromoDer,
          }));
        }
      })
      .catch((err) => {
        console.error("Error al cargar cromos del abanico:", err);
      });
    return () => {
      activo = false;
    };
  }, []);

  const cromoIzq = cartas?.cromoIzq || CROMOS_HERO_DEFECTO.cromoIzq;
  const cromoCentro = cartas?.cromoCentro || CROMOS_HERO_DEFECTO.cromoCentro;
  const cromoDer = cartas?.cromoDer || CROMOS_HERO_DEFECTO.cromoDer;

  const etiquetaFinal = etiquetaGuardiana || "Guardiana holográfica";

  function formatearDetalle(cromo) {
    if (!cromo) return "";
    const mundo = cromo.mundoNombre || cromo.mundo?.nombre || cromo.mundo || "";
    const tipo = cromo.tipoNombre || cromo.tipo || "";
    if (mundo && tipo) {
      return `${mundo} • ${tipo}`;
    }
    return formatoTipo
      .replace("{mundo}", mundo)
      .replace("{tipo}", tipo);
  }

  function formatearNumero(cromo) {
    if (!cromo) return "";
    const n = cromo.numero ?? cromo.posicion ?? "";
    return String(n).padStart(3, "0");
  }

  const tieneCorona = (cromo) =>
    Boolean(
      cromo?.corona ||
      cromo?.rareza?.toLowerCase() === "legendaria" ||
      cromo?.id === "CV-081" ||
      cromo?.numero === 81
    );

  if (usarIlustracionEstatica) {
    return (
      <div className="abanico-cromos" role="region" aria-label={etiquetaFinal}>
        {etiquetaFinal && (
          <div className="abanico-guardiana-badge">
            <Icono nombre="destellos" />
            <span>{etiquetaFinal.toUpperCase()}</span>
          </div>
        )}
        <IlustracionHeroBanner alt={etiquetaFinal} />
      </div>
    );
  }

  return (
    <div className="abanico-cromos" role="region" aria-label={etiquetaFinal}>
      {etiquetaFinal && (
        <div className="abanico-guardiana-badge">
          <Icono nombre="destellos" />
          <span>{etiquetaFinal.toUpperCase()}</span>
        </div>
      )}

      <div className="abanico-cartas-contenedor">
        {/* Carta izquierda */}
        {cromoIzq && (
          <div className="carta-figma carta-izquierda">
            <div className="carta-ilustracion-marco">
              <span className="carta-badge-numero">
                {formatearNumero(cromoIzq)}
              </span>
              {tieneCorona(cromoIzq) && (
                <span className="carta-badge-rareza" aria-hidden="true">
                  <Icono nombre="corona" relleno />
                </span>
              )}
              <ArteCromo
                id={cromoIzq.id}
                cromo={cromoIzq}
                nombre={cromoIzq.nombre}
                colorBase={cromoIzq.colorBase}
                figura={cromoIzq.figura}
                ilustracion={cromoIzq.ilustracion}
              />
            </div>
            <div className="carta-pie">
              <strong className="cromo-nombre-m">{cromoIzq.nombre}</strong>
              <span className="detalle-nota">{formatearDetalle(cromoIzq)}</span>
            </div>
          </div>
        )}

        {/* Carta centro destacada */}
        {cromoCentro && (
          <div className="carta-figma carta-centro">
            <div className="carta-ilustracion-marco">
              <span className="carta-badge-numero">
                {formatearNumero(cromoCentro)}
              </span>
              {tieneCorona(cromoCentro) && (
                <span className="carta-badge-rareza" aria-hidden="true">
                  <Icono nombre="corona" relleno />
                </span>
              )}
              <ArteCromo
                id={cromoCentro.id}
                cromo={cromoCentro}
                nombre={cromoCentro.nombre}
                colorBase={cromoCentro.colorBase}
                figura={cromoCentro.figura}
                ilustracion={cromoCentro.ilustracion}
              />
            </div>
            <div className="carta-pie">
              <strong className="cromo-nombre-g">{cromoCentro.nombre}</strong>
              <span className="detalle-nota-fuerte">{formatearDetalle(cromoCentro)}</span>
            </div>
          </div>
        )}

        {/* Carta derecha */}
        {cromoDer && (
          <div className="carta-figma carta-derecha">
            <div className="carta-ilustracion-marco">
              <span className="carta-badge-numero">
                {formatearNumero(cromoDer)}
              </span>
              {tieneCorona(cromoDer) && (
                <span className="carta-badge-rareza" aria-hidden="true">
                  <Icono nombre="corona" relleno />
                </span>
              )}
              <ArteCromo
                id={cromoDer.id}
                cromo={cromoDer}
                nombre={cromoDer.nombre}
                colorBase={cromoDer.colorBase}
                figura={cromoDer.figura}
                ilustracion={cromoDer.ilustracion}
              />
            </div>
            <div className="carta-pie">
              <strong className="cromo-nombre-m">{cromoDer.nombre}</strong>
              <span className="detalle-nota">{formatearDetalle(cromoDer)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
