import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TarjetaCromo from "../cards/TarjetaCromo.jsx";
import EtiquetaRareza from "../EtiquetaRareza.jsx";
import Icono from "../Icono.jsx";
import RayosFondo from "../RayosFondo.jsx";
import VistaMundo from "../VistaMundo.jsx";
import BarraAtributo from "./BarraAtributo.jsx";
import { AvisoCarga, Esqueleto, EstadoError } from "../Estados.jsx";
import {
  ErrorHttp,
  obtenerCromo,
  obtenerCromos,
  obtenerRarezas,
} from "../../services/api.js";
import "./DetalleCromo.css";

const ICONOS_RAREZA = {
  legendaria: "corona",
  epica: "estrella",
  rara: "rombo",
  comun: "circulo",
};

const ATRIBUTOS_ORDEN = ["fuerza", "velocidad", "mente", "energia"];

function normalizarSlugMundo(cromo) {
  if (!cromo) return "neon";
  const val = String(cromo.mundoId || cromo.mundo || cromo.mundoNombre || "").toLowerCase().trim();
  if (val.includes("niebla") || val.includes("bruma")) return "niebla";
  if (val.includes("orbita") || val.includes("órbita")) return "orbita";
  if (val.includes("forja")) return "forja";
  if (val.includes("bosque")) return "bosque";
  if (val.includes("coral")) return "coral";
  if (val.includes("neon") || val.includes("neón")) return "neon";

  const idNum = parseInt(String(cromo.id || cromo.numero || cromo.posicion || "").replace(/\D/g, ""), 10);
  if (idNum >= 101 && idNum <= 120) return "niebla";
  if (idNum >= 81 && idNum <= 100) return "orbita";
  if (idNum >= 61 && idNum <= 80) return "forja";
  if (idNum >= 41 && idNum <= 60) return "bosque";
  if (idNum >= 21 && idNum <= 40) return "coral";
  return "neon";
}

const COLORES_MUNDOS_HEX = {
  neon: "#7C4DFF",
  coral: "#00A3A3",
  bosque: "#2E9E4F",
  forja: "#F2541B",
  orbita: "#2563EB",
  niebla: "#C026D3",
};

export default function VistaDetalleCromo({ textos, cargandoTextos }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dialogoRef = useRef(null);

  const [cromo, setCromo] = useState(null);
  const [rarezas, setRarezas] = useState([]);
  const [cromoAnterior, setCromoAnterior] = useState(null);
  const [cromoSiguiente, setCromoSiguiente] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error404, setError404] = useState(false);
  const [errorApi, setErrorApi] = useState(null);
  const [intento, setIntento] = useState(0);

  // Cargar datos del cromo actual, catálogo de rarezas y vecinos
  useEffect(() => {
    const controlador = new AbortController();
    let activo = true;
    setCargando(true);
    setError404(false);
    setErrorApi(null);
    setCromoAnterior(null);
    setCromoSiguiente(null);

    async function cargarDetalle() {
      try {
        const opciones = { signal: controlador.signal };
        const [datos, listaRarezas] = await Promise.all([
          obtenerCromo(id, opciones),
          obtenerRarezas(opciones).catch(() => []),
        ]);
        if (!datos || (!datos.nombre && !datos.id)) {
          if (activo) setError404(true);
          return;
        }

        if (!activo) return;
        setCromo(datos);
        setRarezas(listaRarezas);

        if (datos.mundo) {
          try {
            const coleccion = await obtenerCromos(datos.mundo, opciones);
            if (activo && Array.isArray(coleccion)) {
              const idx = coleccion.findIndex(
                (c) =>
                  String(c.id).toLowerCase() === String(datos.id).toLowerCase() ||
                  String(c.posicion || c.numero) === String(datos.posicion || datos.numero)
              );

              if (idx > 0) {
                setCromoAnterior(coleccion[idx - 1]);
              }
              if (idx >= 0 && idx < coleccion.length - 1) {
                setCromoSiguiente(coleccion[idx + 1]);
              }
            }
          } catch (errMundo) {
            if (errMundo?.name !== "AbortError") {
              console.warn("No se pudo cargar la lista del mundo para navegación:", errMundo);
            }
          }
        }
      } catch (err) {
        if (err?.name === "AbortError") return;
        console.error("Error al obtener cromo:", err);
        if (activo) {
          if (err instanceof ErrorHttp && err.status === 404) {
            setError404(true);
          } else {
            setErrorApi(err);
          }
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarDetalle();

    return () => {
      activo = false;
      controlador.abort();
    };
  }, [id, intento]);

  function reintentar() {
    setIntento((n) => n + 1);
  }

  // Actualizar metadatos de la página
  useEffect(() => {
    if (cromo && textos) {
      const plantillaTitulo =
        textos.paginas?.detalleCromo?.seo?.titulo ?? "{nombre} · Cromoverso";
      document.title = plantillaTitulo.replace("{nombre}", cromo.nombre);

      const plantillaDesc =
        textos.paginas?.detalleCromo?.seo?.descripcion ?? "{poder}";
      const descFinal = plantillaDesc.replace("{poder}", cromo.poder || "");

      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", descFinal);
    }

    return () => {
      document.title = "Cromoverso";
    };
  }, [cromo, textos]);

  // Bloqueo de scroll en el body y cierre con Escape
  useEffect(() => {
    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function manejarKeyDown(e) {
      if (e.key === "Escape") {
        cerrarModal();
      }
    }

    window.addEventListener("keydown", manejarKeyDown);

    return () => {
      document.body.style.overflow = overflowOriginal;
      window.removeEventListener("keydown", manejarKeyDown);
    };
  }, [cromo]);

  // Salida directa hacia el catálogo del mundo
  function cerrarModal() {
    const destinoMundo = cromo?.mundo ? `/mundos/${cromo.mundo}` : "/mundos/neon";
    navigate(destinoMundo, { replace: true });
  }

  // Traducción y resolución de textos desde la API
  const tDetalle = textos?.paginas?.detalleCromo;
  const tCromo = textos?.componentes?.cromo;
  const tNoEncontrado = tDetalle?.noEncontrado;

  // Metadatos de rareza (resueltos desde GET /rarezas)
  const claveRareza = String(cromo?.rareza || "comun").toLowerCase();
  const rarezaActual = rarezas.find((r) => r.id?.toLowerCase() === claveRareza);
  const nombreRareza =
    tCromo?.rarezas?.[claveRareza] || rarezaActual?.nombre || cromo?.rareza || "Común";
  const iconoRareza = rarezaActual?.icono || ICONOS_RAREZA[claveRareza] || "circulo";

  const claveTipo = String(cromo?.tipo || "heroe").toLowerCase();
  const nombreTipo =
    tDetalle?.encabezado?.tipos?.[claveTipo] ||
    tCromo?.tipos?.[claveTipo] ||
    cromo?.tipo ||
    "Héroe";

  const plantillaUbicacion =
    tDetalle?.encabezado?.ubicacion || "{id} · {mundo}, posición {posicion}";
  const textoUbicacion = cromo
    ? plantillaUbicacion
        .replace("{id}", cromo.id)
        .replace("{mundo}", cromo.mundoNombre || cromo.mundo || "")
        .replace("{posicion}", String(cromo.posicion || cromo.numero || 1))
    : "";

  const subtituloCromo = `${cromo?.mundoNombre || cromo?.mundo || ""} · ${nombreTipo}`;

  // Resumen de atributos del cromo
  const sumaAtributos = useMemo(() => {
    if (!cromo?.atributos) return 0;
    return Object.values(cromo.atributos).reduce(
      (acc, val) => acc + (Number(val) || 0),
      0
    );
  }, [cromo]);

  const textoTotalAtributos = (
    tDetalle?.atributos?.total || "Total {total}"
  ).replace("{total}", sumaAtributos);

  const mundoSlug = normalizarSlugMundo(cromo);
  const colorHexMundo = COLORES_MUNDOS_HEX[mundoSlug] || "#7C4DFF";
  const colorMundo = `var(--mundo-${mundoSlug}, ${colorHexMundo})`;
  const colorMundoSuave = `var(--mundo-${mundoSlug}-suave, #EEE8FF)`;
  const colorRareza = `var(--rareza-${claveRareza}, #8B3DFF)`;

  return (
    <>
      {/* Fondo con el catálogo del mundo correspondiente visible detrás del velo */}
      <div
        className="detalle__fondo-catalogo"
        aria-hidden="true"
        style={{ pointerEvents: "none" }}
      >
        <VistaMundo
          textos={textos}
          cargandoTextos={cargandoTextos}
          idMundo={mundoSlug}
        />
      </div>

      {/* Contenedor Overlay del Detalle */}
      <div
        className="detalle"
        style={{
          "--mundo-color": colorMundo,
          "--mundo-suave": colorMundoSuave,
          "--rareza-color": colorRareza,
        }}
      >
        {/* Velo exterior para cerrar inmediatamente al hacer clic fuera del modal */}
        <div
          className="detalle__velo"
          aria-hidden="true"
          onClick={cerrarModal}
        />

        {/* Contenedor del Diálogo / Modal */}
        <div
          ref={dialogoRef}
          className="detalle__dialogo"
          role="dialog"
          aria-modal="true"
          aria-labelledby="detalle-titulo"
        >
          {/* Tirador táctil superior para mobile */}
          <div className="detalle__asa-contenedor" aria-hidden="true">
            <div className="detalle__asa" />
          </div>

          {/* Encabezado Mobile con el botón cerrar (oculto en desktop) */}
          <div className="detalle__encabezado-mobile">
            <button
              type="button"
              className="detalle__cerrar"
              onClick={cerrarModal}
              aria-label={tDetalle?.botones?.cerrar || "Cerrar"}
            >
              <Icono nombre="cerrar" />
            </button>
          </div>

          {/* Estado de Carga (Esqueleto) */}
          {(cargando || cargandoTextos) && (
            <div className="detalle__esqueleto" aria-busy="true">
              <AvisoCarga textos={textos} />
              <Esqueleto className="detalle__esqueleto-carta" />
              <div className="detalle__esqueleto-info" aria-hidden="true">
                <Esqueleto className="detalle__esqueleto-etiquetas" />
                <Esqueleto className="detalle__esqueleto-titulo" />
                <Esqueleto className="detalle__esqueleto-poder" />
                <Esqueleto className="detalle__esqueleto-atributos" />
              </div>
            </div>
          )}

          {/* Estado de Error de API con botón Reintentar */}
          {!cargando && !cargandoTextos && errorApi && (
            <div className="detalle-cromo-estado-vacio">
              <button
                type="button"
                className="detalle__cerrar detalle__cerrar--estado"
                onClick={cerrarModal}
                aria-label={tDetalle?.botones?.cerrar ?? textos?.general?.acciones?.cerrar}
              >
                <Icono nombre="cerrar" />
              </button>
              <EstadoError
                textos={textos}
                error={errorApi}
                onReintentar={reintentar}
              />
            </div>
          )}

          {/* Estado 404 No Encontrado */}
          {!cargando && !cargandoTextos && !errorApi && error404 && (
            <div className="detalle-cromo-estado-vacio" role="alert">
              {(tNoEncontrado?.titulo ?? textos?.estados?.noEncontrado?.titulo) && (
                <h2 className="titular-h2">
                  {tNoEncontrado?.titulo ?? textos?.estados?.noEncontrado?.titulo}
                </h2>
              )}
              {(tNoEncontrado?.texto ?? textos?.estados?.noEncontrado?.texto) && (
                <p className="cuerpo-m">
                  {tNoEncontrado?.texto ?? textos?.estados?.noEncontrado?.texto}
                </p>
              )}
              {(tNoEncontrado?.botones?.volver ?? textos?.estados?.noEncontrado?.botones?.irAlInicio) && (
                <button
                  type="button"
                  className="boton-home primario"
                  onClick={cerrarModal}
                >
                  {tNoEncontrado?.botones?.volver ?? textos?.estados?.noEncontrado?.botones?.irAlInicio}
                </button>
              )}
            </div>
          )}

          {/* Contenido principal del Cromo */}
          {!cargando && !cargandoTextos && !errorApi && !error404 && cromo && (
            <>
              {/* --------------------------------------------------------------
                  Zona Izquierda (Desktop): Contenedor morado de 316x420 con rayos centrados
                  -------------------------------------------------------------- */}
              <div className="detalle__carta" aria-hidden="true">
                <RayosFondo
                  className="detalle__rayos"
                  viewBox="0 -560 1500 1500"
                  aria-hidden="true"
                  focusable="false"
                />

                {/* Carta principal del cromo (Desktop) */}
                <TarjetaCromo
                  cromo={cromo}
                  mundoNombre={cromo.mundoNombre || cromo.mundo}
                  colorMundo={colorHexMundo}
                  rarezasInfo={rarezas}
                  textos={textos}
                  enlace={null}
                />
              </div>

              {/* --------------------------------------------------------------
                  Fila de Identidad Mobile: Cromo a la izquierda + Datos a la derecha
                  -------------------------------------------------------------- */}
              <div className="detalle__identidad">
                <div className="detalle__carta-movil">
                  <TarjetaCromo
                    cromo={cromo}
                    mundoNombre={cromo.mundoNombre || cromo.mundo}
                    colorMundo={colorHexMundo}
                    rarezasInfo={rarezas}
                    textos={textos}
                    enlace={null}
                  />
                </div>

                <div className="detalle__datos">
                  <p className="detalle__id">{cromo.id}</p>
                  <h2 className="detalle__nombre-mobile">{cromo.nombre}</h2>
                  <p className="detalle__sub">{subtituloCromo}</p>
                  <EtiquetaRareza
                    clave={claveRareza}
                    nombre={nombreRareza}
                    icono={iconoRareza}
                  />
                </div>
              </div>

              {/* --------------------------------------------------------------
                  Zona Derecha (.detalle__info): Información y navegación
                  -------------------------------------------------------------- */}
              <div className="detalle__info">
                {/* 1. Etiquetas superiores + ÚNICA X de cierre en Desktop */}
                <div className="detalle__etiquetas">
                  <EtiquetaRareza
                    clave={claveRareza}
                    nombre={nombreRareza}
                    icono={iconoRareza}
                  />
                  <span className="detalle-etiqueta-mundo">
                    {cromo.mundoNombre || cromo.mundo}
                  </span>
                  <span className="detalle-etiqueta-tipo">
                    {nombreTipo}
                  </span>

                  <span className="detalle__espacio" />

                  <button
                    type="button"
                    className="detalle__cerrar"
                    onClick={cerrarModal}
                    aria-label={tDetalle?.botones?.cerrar || "Cerrar"}
                  >
                    <Icono nombre="cerrar" />
                  </button>
                </div>

                {/* 2. Título e ID / Ubicación (Desktop) */}
                <div className="detalle__titulo">
                  <p className="detalle__ubicacion">{textoUbicacion}</p>
                  <h2 id="detalle-titulo" className="detalle__nombre">
                    {cromo.nombre}
                  </h2>
                </div>

                {/* 3. Bloque de Poder (Compartido) */}
                <section
                  className="detalle__poder"
                  aria-labelledby="detalle-poder"
                >
                  <div className="detalle__poder-meta">
                    <span className="detalle__poder-icono" aria-hidden="true">
                      <Icono nombre="rayo" relleno />
                    </span>
                    <h3 id="detalle-poder" className="detalle__poder-titulo">
                      {tDetalle?.poder?.titulo || "PODER"}
                    </h3>
                  </div>
                  <p className="detalle__poder-valor">{cromo.poder}</p>
                </section>

                {/* 4. Descripción del Cromo (Desktop) */}
                {cromo.descripcion && (
                  <p className="detalle__descripcion">{cromo.descripcion}</p>
                )}

                {/* 5. Bloque de Atributos */}
                <section
                  className="detalle__atributos"
                  aria-labelledby="detalle-atributos"
                >
                  <div className="detalle__atributos-cabecera">
                    <h3
                      id="detalle-atributos"
                      className="detalle__atributos-titulo"
                    >
                      {tDetalle?.atributos?.titulo || "Atributos"}
                    </h3>
                    <p className="detalle__total">{textoTotalAtributos}</p>
                  </div>

                  <div className="detalle__atributos-lista">
                    {ATRIBUTOS_ORDEN.map((clave) => {
                      const valor = Number(cromo.atributos?.[clave] || 10);
                      const porcentaje = Math.min(
                        100,
                        Math.max(0, ((valor - 10) / (99 - 10)) * 100)
                      );
                      const etiqueta =
                        tDetalle?.atributos?.nombres?.[clave] || clave;

                      return (
                        <BarraAtributo
                          key={clave}
                          etiqueta={etiqueta}
                          valor={valor}
                          porcentaje={porcentaje}
                          color={colorHexMundo}
                        />
                      );
                    })}
                  </div>

                  <p className="detalle__escala">
                    {tDetalle?.atributos?.escala || "Escala de 10 a 99."}
                  </p>
                </section>

                {/* 6. Navegación Anterior / Siguiente (Desktop) */}
                <nav
                  className="detalle__vecinos"
                  aria-label="Navegación entre cromos"
                >
                  {cromoAnterior ? (
                    <Link
                      to={`/cromos/${cromoAnterior.id}`}
                      replace
                      className="detalle__caja-nav"
                      aria-label={`${tDetalle?.navegacion?.anterior || "Cromo anterior"}: ${cromoAnterior.nombre}`}
                    >
                      <span className="detalle__nav-flecha">‹</span>
                      <span>
                        {String(
                          cromoAnterior.posicion || cromoAnterior.numero
                        ).padStart(3, "0")}{" "}
                        {cromoAnterior.nombre}
                      </span>
                    </Link>
                  ) : (
                    <div />
                  )}

                  {cromoSiguiente ? (
                    <Link
                      to={`/cromos/${cromoSiguiente.id}`}
                      replace
                      className="detalle__caja-nav"
                      aria-label={`${tDetalle?.navegacion?.siguiente || "Cromo siguiente"}: ${cromoSiguiente.nombre}`}
                    >
                      <span className="detalle__nav-flecha">›</span>
                      <span>
                        {String(
                          cromoSiguiente.posicion || cromoSiguiente.numero
                        ).padStart(3, "0")}{" "}
                        {cromoSiguiente.nombre}
                      </span>
                    </Link>
                  ) : (
                    <div />
                  )}
                </nav>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
