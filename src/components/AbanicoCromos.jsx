import { useEffect, useState } from "react";
import Icono from "./Icono.jsx";
import TarjetaHero from "./cards/TarjetaHero.jsx";
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

/**
 * AbanicoCromos: Presentación visual en abanico de tres cromos representativos para el Hero.
 * Compuesto limpiamente con el componente reutilizable TarjetaHero.
 */
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
        {cromoIzq && (
          <TarjetaHero
            cromo={cromoIzq}
            posicion="izquierda"
            formatoTipo={formatoTipo}
          />
        )}

        {cromoCentro && (
          <TarjetaHero
            cromo={cromoCentro}
            posicion="centro"
            formatoTipo={formatoTipo}
            destacada
          />
        )}

        {cromoDer && (
          <TarjetaHero
            cromo={cromoDer}
            posicion="derecha"
            formatoTipo={formatoTipo}
          />
        )}
      </div>
    </div>
  );
}
