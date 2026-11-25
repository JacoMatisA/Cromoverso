import Icono from "../Icono.jsx";
import ArteCromo from "../ArteCromo.jsx";

/**
 * TarjetaHero: Tarjeta individual utilizada en la composición del abanico del Hero.
 * Configurable mediante props individuales o pasando el objeto cromo.
 *
 * @param {object} [cromo] - Objeto cromo con datos básicos.
 * @param {string} [id] - Identificador del cromo (ej. "CV-001").
 * @param {number|string} [numero] - Número de colección.
 * @param {string} [nombre] - Nombre del cromo o personaje.
 * @param {string} [mundoNombre] - Nombre del mundo al que pertenece.
 * @param {string} [tipoNombre] - Nombre del tipo de personaje (Héroe, Aliado, Villano).
 * @param {boolean} [corona=false] - Indica si porta corona dorada de legendario/destacado.
 * @param {string} [posicion="centro"] - Posición en el abanico ("izquierda" | "centro" | "derecha").
 * @param {boolean} [destacada=false] - Si es la tarjeta central destacada con tipografía mayor.
 * @param {string} [formatoTipo="{mundo} • {tipo}"] - Plantilla de formato para el subtítulo.
 * @param {string} [colorBase] - Color base para el arte del cromo.
 * @param {string} [figura] - Identificador de figura geométrica.
 * @param {string} [ilustracion] - Ruta o url de la ilustración.
 */
export default function TarjetaHero({
  cromo,
  id,
  numero,
  nombre,
  mundoNombre,
  tipoNombre,
  corona,
  posicion = "centro",
  destacada = false,
  formatoTipo = "{mundo} • {tipo}",
  colorBase,
  figura,
  ilustracion,
  textos,
}) {
  // Resolver props desde argumentos directos o desde objeto cromo
  const idCromo = id ?? cromo?.id ?? "";
  const numRaw = numero ?? cromo?.numero ?? cromo?.posicion ?? 1;
  const numeroFormateado = String(numRaw).padStart(3, "0");
  const nombreCromo = nombre ?? cromo?.nombre ?? "";
  const mundo = mundoNombre ?? cromo?.mundoNombre ?? cromo?.mundo?.nombre ?? cromo?.mundo ?? "";

  // Resolver tipo con soporte de i18n
  const claveTipo = String(cromo?.tipo ?? tipoNombre ?? cromo?.tipoNombre ?? "heroe")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const tipoTraducido =
    textos?.componentes?.cromo?.tipos?.[claveTipo] ??
    textos?.paginas?.albumMundo?.filtros?.tipo?.opciones?.[claveTipo] ??
    tipoNombre ??
    cromo?.tipoNombre ??
    cromo?.tipo ??
    "";
  const tipo = tipoTraducido;
  const color = colorBase ?? cromo?.colorBase;
  const figuraCromo = figura ?? cromo?.figura;
  const ilustracionCromo = ilustracion ?? cromo?.ilustracion;

  const tieneCorona =
    corona ??
    Boolean(
      cromo?.corona ||
      cromo?.rareza?.toLowerCase() === "legendaria" ||
      cromo?.id === "CV-081" ||
      cromo?.numero === 81
    );

  const esDestacada = destacada || posicion === "centro";

  // Formato del subtítulo
  const plantillaSubtitulo = formatoTipo || "{mundo} · {tipo}";
  let subtitulo = "";
  if (mundo && tipo) {
    subtitulo = plantillaSubtitulo.replace("{mundo}", mundo).replace("{tipo}", tipo);
  } else if (mundo || tipo) {
    subtitulo = plantillaSubtitulo.replace("{mundo}", mundo).replace("{tipo}", tipo);
  }

  return (
    <div className={`carta-figma carta-${posicion}`}>
      <div className="carta-ilustracion-marco">
        <span className="carta-badge-numero">
          {numeroFormateado}
        </span>
        {tieneCorona && (
          <span className="carta-badge-rareza" aria-hidden="true">
            <Icono nombre="corona" relleno />
          </span>
        )}
        <ArteCromo
          id={idCromo}
          cromo={cromo}
          nombre={nombreCromo}
          colorBase={color}
          figura={figuraCromo}
          ilustracion={ilustracionCromo}
        />
      </div>

      <div className="carta-pie">
        <strong className={esDestacada ? "cromo-nombre-g" : "cromo-nombre-m"}>
          {nombreCromo}
        </strong>
        <span className={esDestacada ? "detalle-nota-fuerte" : "detalle-nota"}>
          {subtitulo}
        </span>
      </div>
    </div>
  );
}
