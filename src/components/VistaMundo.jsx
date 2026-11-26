import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Icono from "./Icono.jsx";
import GrillaCromos from "./catalogo/GrillaCromos.jsx";
import MenuLateralMundos from "./MenuLateralMundos.jsx";
import RayosFondo from "./RayosFondo.jsx";
import { AvisoCarga, Esqueleto, EstadoError } from "./Estados.jsx";
import {
  ErrorHttp,
  normalizarIdMundo,
  obtenerCromos,
  obtenerMundo,
  obtenerMundos,
  obtenerRarezas,
} from "../services/api.js";
import "./VistaMundo.css";

const CROMOS_ESQUELETO = 20;

const MUNDOS_ORDEN = ["neon", "coral", "bosque", "forja", "orbita", "niebla"];

const DESCRIPCIONES_MUNDOS = {
  neon: "Metrópoli tecnológica que nunca duerme",
  coral: "Arrecifes submarinos y civilizaciones acuáticas",
  bosque: "Naturaleza ancestral y magia silvestre",
  forja: "Tierras volcánicas de fuego y metalurgia",
  orbita: "Estaciones espaciales en el cosmos infinito",
  niebla: "Reino misterioso entre sombras y espejismos",
};

export default function VistaMundo({ textos, cargandoTextos, idMundo }) {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const idNormalizado = normalizarIdMundo(idMundo || id);

  const [mundo, setMundo] = useState(null);
  const [mundos, setMundos] = useState([]);
  const [cromosMundo, setCromosMundo] = useState([]);
  const [cromos, setCromos] = useState([]);
  const [rarezas, setRarezas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoCromos, setCargandoCromos] = useState(true);
  const [error, setError] = useState(null);
  const [intento, setIntento] = useState(0);

  const rarezaActual = searchParams.get("rareza") || "";
  const tipoActual = searchParams.get("tipo") || "";
  const busquedaActual = searchParams.get("buscar") || "";

  const [busqueda, setBusqueda] = useState(busquedaActual);
  const [busquedaAbierta, setBusquedaAbierta] = useState(Boolean(busquedaActual));

  useEffect(() => {
    setBusqueda(busquedaActual);
    if (busquedaActual) {
      setBusquedaAbierta(true);
    }
  }, [busquedaActual]);

  useEffect(() => {
    const controlador = new AbortController();
    let activo = true;
    setCargando(true);
    setError(null);

    async function cargarMundo() {
      try {
        const opciones = { signal: controlador.signal };
        const [datosMundo, listaMundos, listaBase, listaRarezas] =
          await Promise.all([
            obtenerMundo(idNormalizado, opciones),
            obtenerMundos(opciones),
            obtenerCromos(idNormalizado, opciones),
            obtenerRarezas(opciones),
          ]);

        if (activo) {
          setMundo(datosMundo);
          setMundos(listaMundos);
          setCromosMundo(listaBase);
          setRarezas(listaRarezas);
        }
      } catch (err) {
        if (err?.name === "AbortError") return;
        console.error("Error al cargar datos del mundo:", err);
        if (activo) setError(err);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarMundo();

    return () => {
      activo = false;
      controlador.abort();
    };
  }, [idNormalizado, intento]);

  useEffect(() => {
    const controlador = new AbortController();
    let activo = true;
    setCargandoCromos(true);

    async function cargarCromosFiltrados() {
      try {
        const listaCromos = await obtenerCromos(idNormalizado, {
          signal: controlador.signal,
          rareza: rarezaActual,
          tipo: tipoActual,
        });

        if (activo) {
          setCromos(listaCromos);
        }
      } catch (err) {
        if (err?.name === "AbortError") return;
        console.error("Error al cargar cromos:", err);
        if (activo) setError(err);
      } finally {
        if (activo) setCargandoCromos(false);
      }
    }

    cargarCromosFiltrados();

    return () => {
      activo = false;
      controlador.abort();
    };
  }, [idNormalizado, rarezaActual, tipoActual, intento]);

  function reintentar() {
    setIntento((n) => n + 1);
  }

  function cambiarFiltro(clave, valor) {
    const nuevosParams = new URLSearchParams(searchParams);
    if (!valor || valor === "todas" || valor === "todos") {
      nuevosParams.delete(clave);
    } else {
      nuevosParams.set(clave, valor);
    }
    setSearchParams(nuevosParams);
  }

  function limpiarFiltros() {
    setBusqueda("");
    setSearchParams(new URLSearchParams());
  }

  const cromosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return cromos;
    const consulta = busqueda.trim().toLowerCase();
    return cromos.filter((cromo) =>
      cromo.nombre?.toLowerCase().includes(consulta)
    );
  }, [cromos, busqueda]);

  const conteoPorRareza = useMemo(() => {
    const acumulador = { legendaria: 0, epica: 0, rara: 0, comun: 0 };
    cromosMundo.forEach((c) => {
      const r = c.rareza?.toLowerCase();
      if (acumulador[r] !== undefined) acumulador[r] += 1;
    });
    return acumulador;
  }, [cromosMundo]);

  const conteoPorTipo = useMemo(() => {
    const acumulador = { heroe: 0, aliado: 0, villano: 0 };
    cromosMundo.forEach((c) => {
      const t = c.tipo?.toLowerCase();
      if (acumulador[t] !== undefined) acumulador[t] += 1;
    });
    return acumulador;
  }, [cromosMundo]);

  const tMundo = textos?.paginas?.albumMundo;
  const tFiltros = tMundo?.filtros;
  const tOrden = tMundo?.orden;
  const tVacio = tMundo?.vacio;

  const indiceMundo = MUNDOS_ORDEN.indexOf(idNormalizado) + 1 || 1;
  const desde = String(mundo?.numeros?.desde ?? (indiceMundo - 1) * 20 + 1).padStart(3, "0");
  const hasta = String(mundo?.numeros?.hasta ?? indiceMundo * 20).padStart(3, "0");

  const subtituloRango = (tMundo?.encabezado?.rango ?? "Mundo {numero} de 6 · cromos {desde} a {hasta}.")
    .replace("{numero}", indiceMundo)
    .replace("{desde}", desde)
    .replace("{hasta}", hasta);

  const etiquetaOrden = (tOrden?.etiqueta ?? "Orden: {orden}").replace(
    "{orden}",
    tOrden?.opciones?.numero ?? "número"
  );

  if (cargando || cargandoTextos) {
    return (
      <section
        className="vista-mundo vista-mundo-esqueleto"
        aria-busy="true"
      >
        <AvisoCarga textos={textos} />
        <div className="vista-mundo-esqueleto-banner" aria-hidden="true">
          <div className="contenedor vista-mundo-esqueleto-banner-interior">
            <Esqueleto className="vista-mundo-esqueleto-migas" />
            <Esqueleto className="vista-mundo-esqueleto-titulo" />
            <Esqueleto className="vista-mundo-esqueleto-subtitulo" />
          </div>
        </div>
        <div className="vista-mundo-cuerpo">
          <div className="contenedor vista-mundo-layout">
            <div className="vista-mundo-esqueleto-sidebar" aria-hidden="true">
              <Esqueleto className="vista-mundo-esqueleto-panel" />
              <Esqueleto className="vista-mundo-esqueleto-panel" />
            </div>
            <div className="catalogo-principal" aria-hidden="true">
              <div className="catalogo-marco-grilla">
                <div className="catalogo-grilla-cromos">
                  {Array.from({ length: CROMOS_ESQUELETO }, (_, indice) => (
                    <Esqueleto
                      key={indice}
                      className="vista-mundo-esqueleto-carta"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const esNoEncontrado =
    (error instanceof ErrorHttp && error.status === 404) || (!error && !mundo);

  if (esNoEncontrado) {
    const tNoEncontrado = textos?.estados?.noEncontrado;
    return (
      <div className="vista-mundo-error" role="alert">
        {tNoEncontrado?.titulo && (
          <h1 className="titular-h2">{tNoEncontrado.titulo}</h1>
        )}
        {tNoEncontrado?.texto && (
          <p className="cuerpo-m">{tNoEncontrado.texto}</p>
        )}
        {tNoEncontrado?.botones?.irAlInicio && (
          <Link to="/" className="boton-home primario">
            {tNoEncontrado.botones.irAlInicio}
          </Link>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <EstadoError
        className="vista-mundo-error"
        textos={textos}
        error={error}
        onReintentar={reintentar}
        etiquetaTitulo="h1"
      />
    );
  }

  const descripcionMundo =
    mundo.descripcion ||
    mundo.tema ||
    DESCRIPCIONES_MUNDOS[idNormalizado] ||
    "Metrópoli tecnológica que nunca duerme";

  return (
    <div className={`vista-mundo vista-mundo-${idNormalizado}`}>
      <header className={`vista-mundo-banner mundo-${idNormalizado}`}>
        <RayosFondo className="banner-rayos" />
        <div className="vista-mundo-banner-interior">
          <div className="banner-escritorio">
            <nav className="banner-migas" aria-label="Breadcrumb">
              <Link to="/" className="banner-miga-link detalle-nota">
                {tMundo?.migas?.inicio ?? "Inicio"}
              </Link>
              <span className="banner-miga-separador" aria-hidden="true">&gt;</span>
              <span className="banner-miga-actual detalle-nota" aria-current="page">
                {mundo.nombre}
              </span>
            </nav>
            <h1 className="titular-display banner-titulo">{mundo.nombre}</h1>
            <p className="cuerpo-p banner-subtitulo">{subtituloRango}</p>
          </div>

          <div className="banner-movil">
            <Link
              to="/"
              className="banner-movil-boton-atras"
              aria-label={tMundo?.migas?.inicio ?? "Volver a inicio"}
            >
              <Icono nombre="flechaizq" />
            </Link>
            <div className="banner-movil-titulos">
              <h1 className="banner-movil-nombre">{mundo.nombre}</h1>
              <p className="banner-movil-tema">
                {descripcionMundo}
              </p>
            </div>
            <button
              type="button"
              className={`banner-movil-boton-buscar ${busquedaAbierta ? "is-activo" : ""}`}
              aria-label={textos?.navbar?.buscador?.aria ?? "Buscar"}
              aria-expanded={busquedaAbierta}
              onClick={() => setBusquedaAbierta((prev) => !prev)}
            >
              <Icono nombre={busquedaAbierta ? "cerrar" : "buscar"} />
            </button>
          </div>

          {busquedaAbierta && (
            <div className="banner-movil-buscador-contenedor">
              <div className="banner-movil-buscador-input-wrap">
                <span className="banner-movil-buscador-icono" aria-hidden="true">
                  <Icono nombre="buscar" />
                </span>
                <input
                  type="search"
                  className="banner-movil-input-buscar"
                  placeholder={textos?.navbar?.buscador?.placeholder ?? "Buscar cromo..."}
                  aria-label={textos?.navbar?.buscador?.aria ?? "Buscar cromo por nombre"}
                  value={busqueda}
                  autoFocus
                  onChange={(e) => {
                    const valor = e.target.value;
                    setBusqueda(valor);
                    cambiarFiltro("buscar", valor);
                  }}
                />
                {busqueda && (
                  <button
                    type="button"
                    className="banner-movil-boton-limpiar"
                    aria-label={textos?.menuMovil?.cerrar ?? "Limpiar"}
                    onClick={() => {
                      setBusqueda("");
                      cambiarFiltro("buscar", "");
                    }}
                  >
                    <Icono nombre="cerrar" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="vista-mundo-cuerpo">
        <div className="contenedor vista-mundo-layout">
          <div className="filtros-movil-barra">
            <div className="filtro-movil-pildora">
              <select
                aria-label={tFiltros?.rareza?.titulo ?? "Filtrar por rareza"}
                value={rarezaActual}
                onChange={(e) => cambiarFiltro("rareza", e.target.value)}
                className="filtro-movil-select"
              >
                <option value="">
                  {tFiltros?.rareza?.todas ?? "Rareza: todas"}
                </option>
                {rarezas.length > 0 ? (
                  rarezas.map((r) => {
                    const claveR = r.id?.toLowerCase();
                    const nombreRareza =
                      textos?.componentes?.cromo?.rarezas?.[claveR] ??
                      r.nombre;
                    return (
                      <option key={r.id} value={r.id}>
                        {(tFiltros?.rareza?.valor ?? "Rareza: {rareza}").replace(
                          "{rareza}",
                          nombreRareza
                        )}
                      </option>
                    );
                  })
                ) : (
                  ["legendaria", "epica", "rara", "comun"].map((clave) => {
                    const nombreRareza =
                      textos?.componentes?.cromo?.rarezas?.[clave] ?? clave;
                    return (
                      <option key={clave} value={clave}>
                        {(tFiltros?.rareza?.valor ?? "Rareza: {rareza}").replace(
                          "{rareza}",
                          nombreRareza
                        )}
                      </option>
                    );
                  })
                )}
              </select>
              <span className="filtro-movil-icono" aria-hidden="true">
                <Icono nombre="chevronabajo" />
              </span>
            </div>

            <div className="filtro-movil-pildora">
              <select
                aria-label={tFiltros?.tipo?.titulo ?? "Filtrar por tipo"}
                value={tipoActual}
                onChange={(e) => cambiarFiltro("tipo", e.target.value)}
                className="filtro-movil-select"
              >
                <option value="">
                  {tFiltros?.tipo?.todos ?? "Tipo: todos"}
                </option>
                {Object.entries(
                  tFiltros?.tipo?.opciones ??
                  textos?.componentes?.cromo?.tipos ?? {
                    heroe: "Héroe",
                    aliado: "Aliado",
                    villano: "Villano",
                  }
                ).map(([clave, nombre]) => (
                  <option key={clave} value={clave}>
                    {(tFiltros?.tipo?.valor ?? "Tipo: {tipo}").replace(
                      "{tipo}",
                      nombre
                    )}
                  </option>
                ))}
              </select>
              <span className="filtro-movil-icono" aria-hidden="true">
                <Icono nombre="chevronabajo" />
              </span>
            </div>
          </div>

          <MenuLateralMundos
            mundos={mundos}
            mundoActualId={idNormalizado}
            rarezaActual={rarezaActual}
            tipoActual={tipoActual}
            onCambiarFiltro={cambiarFiltro}
            conteoPorRareza={conteoPorRareza}
            conteoPorTipo={conteoPorTipo}
            rarezasInfo={rarezas}
            textos={textos}
          />

          <main className="catalogo-principal">
            <div className="catalogo-acciones-superiores">
              <div className="catalogo-orden-pildora">
                <span className="detalle-nota-fuerte">{etiquetaOrden}</span>
                <Icono nombre="chevronabajo" />
              </div>
            </div>

            <div className="catalogo-marco-grilla" aria-busy={cargandoCromos}>
              {cargandoCromos ? (
                <>
                  <AvisoCarga textos={textos} />
                  <div className="catalogo-grilla-cromos" aria-hidden="true">
                    {Array.from({ length: CROMOS_ESQUELETO }, (_, indice) => (
                      <Esqueleto
                        key={indice}
                        className="vista-mundo-esqueleto-carta"
                      />
                    ))}
                  </div>
                </>
              ) : (
                <GrillaCromos
                  cromos={cromosFiltrados}
                  mundoNombre={mundo.nombre}
                  colorMundo={mundo.color ?? "var(--marca-primario)"}
                  rarezasInfo={rarezas}
                  textos={textos}
                  onLimpiarFiltros={limpiarFiltros}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
