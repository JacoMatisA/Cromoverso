import { obtenerArteCromo, normalizarIdCromo } from "../assets/imagenes";
import "./ArteCromo.css";

/**
 * Componente que renderiza el arte oficial de un cromo exclusivamente
 * desde las imágenes agregadas en assets/cromos.
 */
export default function ArteCromo({
  id,
  cromo,
  nombre,
  className = "",
  alt,
}) {
  const idFinal = normalizarIdCromo(id || cromo?.id || cromo?.numero);
  const nombreFinal = nombre || cromo?.nombre || (idFinal ? `Cromo ${idFinal}` : "Cromo");
  const altFinal = alt || `Ilustración oficial de ${nombreFinal}`;

  const arte = obtenerArteCromo(idFinal);

  return (
    <img
      src={arte.src}
      srcSet={arte.srcSet}
      alt={altFinal}
      className={`cromo-arte-imagen ${className}`.trim()}
      loading="lazy"
      decoding="async"
    />
  );
}
