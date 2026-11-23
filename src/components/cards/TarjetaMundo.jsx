import { Link } from "react-router-dom";
import Icono from "../Icono.jsx";

/**
 * TarjetaMundo: Componente de tarjeta reutilizable para representar un mundo temático.
 * Configurable completamente a través de props directas o mediante un objeto 'mundo'.
 *
 * @param {string} clave - Identificador slug del mundo (ej. "neon", "coral").
 * @param {string} nombre - Nombre visible del mundo (ej. "Ciudad Neón").
 * @param {number|string} numero - Posición o número de orden del mundo (ej. 1).
 * @param {string} [icono="mundo"] - Nombre del icono a mostrar.
 * @param {string} [clase=""] - Clase CSS temática adicional (ej. "tarjeta-mundo-neon").
 * @param {number|string} [totalCromos=20] - Total de cromos pertenecientes a este mundo.
 * @param {boolean} [tieneTag=false] - Indica si muestra la etiqueta de número de mundo.
 * @param {string} [etiquetaMundo="Mundo {numero}"] - Plantilla de texto para la etiqueta.
 * @param {string} [etiquetaCromos="{cantidad} cromos"] - Plantilla para el conteo de cromos.
 * @param {string} [enlace] - Ruta personalizada de destino (por defecto: /mundos/:clave).
 * @param {object} [mundo] - Objeto mundo opcional para conveniencia.
 */
export default function TarjetaMundo({
  clave,
  nombre,
  numero,
  icono = "mundo",
  clase = "",
  totalCromos = 20,
  tieneTag = false,
  etiquetaMundo = "Mundo {numero}",
  etiquetaCromos = "{cantidad} cromos",
  enlace,
  mundo,
}) {
  // Soporte de props directas o desde objeto 'mundo'
  const claveMundo = clave ?? mundo?.clave ?? mundo?.id ?? "";
  const nombreMundo = nombre ?? mundo?.nombre ?? "";
  const numeroMundo = numero ?? mundo?.numero ?? 1;
  const iconoMundo = icono ?? mundo?.icono ?? "mundo";
  const claseTematica = clase || mundo?.clase || `tarjeta-mundo-${claveMundo}`;
  const mostrarTag = tieneTag ?? mundo?.tieneTag ?? false;
  const cantidadTotal = totalCromos ?? mundo?.totalCromos ?? 20;
  const rutaDestino = enlace ?? `/mundos/${claveMundo}`;

  const textoTag = etiquetaMundo.replace("{numero}", numeroMundo);
  const textoConteo = etiquetaCromos.replace("{cantidad}", cantidadTotal);

  return (
    <Link
      to={rutaDestino}
      className={`tarjeta-mundo ${claseTematica}`}
      style={{ textDecoration: "none" }}
    >
      <div className="tarjeta-mundo-cabecera">
        <div className="icono-circulo-mundo" aria-hidden="true">
          <Icono nombre={iconoMundo} />
        </div>
        {mostrarTag && (
          <span className="mundo-tag detalle-etiqueta">
            {textoTag}
          </span>
        )}
      </div>

      <div className="tarjeta-mundo-info">
        <h3 className="cromo-nombre-g">{nombreMundo}</h3>
        <p className="cuerpo-p tarjeta-mundo-conteo">{textoConteo}</p>
      </div>
    </Link>
  );
}
