import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Icono from "./Icono.jsx";
import TarjetaCromo from "./TarjetaCromo.jsx";
import MenuLateralMundos from "./MenuLateralMundos.jsx";
import {
  normalizarIdMundo,
  obtenerCromos,
  obtenerMundo,
  obtenerMundos,
  obtenerRarezas,
} from "../services/api.js";
import "./VistaMundo.css";

const MUNDOS_ORDEN = ["neon", "coral", "bosque", "forja", "orbita", "niebla"];

export default function VistaMundo({ textos, cargandoTextos }) {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const idNormalizado = normalizarIdMundo(id);

  const [mundo, setMundo] = useState(null);
  const [mundos, setMundos] = useState([]);
  const [cromos, setCromos] = useState([]);
  const [rarezas, setRarezas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  // Filtros desde URL Query Parameters
  const rarezaActual = searchParams.get("rareza") || "";
  const tipoActual = searchParams.get("tipo") || "";
  const busquedaActual = searchParams.get("buscar") || "";

  // Estado del buscador móvil
  const [busqueda, setBusqueda] = useState(busquedaActual);
  const [busquedaAbierta, setBusquedaAbierta] = useState(Boolean(busquedaActual));

  useEffect(() => {
    setBusqueda(busquedaActual);
    if (busquedaActual) {
      setBusquedaAbierta(true);
    }
  }, [busquedaActual]);

  // Carga de datos de la API
  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(false);

    async function cargarDatos() {
      try {
        const [datosMundo, listaMundos, listaCromos, listaRarezas] =
          await Promise.all([
            obtenerMundo(idNormalizado),
            obtenerMundos(),
            obtenerCromos(idNormalizado),
            obtenerRarezas(),
          ]);

        if (activo) {
          setMundo(datosMundo);
          setMundos(listaMundos);
          setCromos(listaCromos);
          setRarezas(listaRarezas);
        }
      } catch (err) {
        console.error("Error al cargar datos del mundo:", err);
        if (activo) setError(true);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarDatos();

    return () => {
      activo = false;
    };
  }, [idNormalizado]);

  // Actualizar filtros en URL mediante useSearchParams
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

  // Filtrado de cromos (por rareza, tipo y nombre de cromo)
  const cromosFiltrados = useMemo(() => {
    return cromos.filter((cromo) => {
      if (
        rarezaActual &&
        cromo.rareza?.toLowerCase() !== rarezaActual.toLowerCase()
      ) {
        return false;
      }
      if (
        tipoActual &&
        cromo.tipo?.toLowerCase() !== tipoActual.toLowerCase()
      ) {
        return false;
      }
      if (
        busqueda &&
        !cromo.nombre?.toLowerCase().includes(busqueda.trim().toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [cromos, rarezaActual, tipoActual, busqueda]);

  // Cálculos dinámicos de cromos por filtro
  const conteoPorRareza = useMemo(() => {
    const acumulador = { legendaria: 0, epica: 0, rara: 0, comun: 0 };
    cromos.forEach((c) => {
      const r = c.rareza?.toLowerCase();
      if (acumulador[r] !== undefined) acumulador[r] += 1;
    });
    return acumulador;
  }, [cromos]);

  const conteoPorTipo = useMemo(() => {
    const acumulador = { heroe: 0, aliado: 0, villano: 0 };
    cromos.forEach((c) => {
      const t = c.tipo?.toLowerCase();
      if (acumulador[t] !== undefined) acumulador[t] += 1;
    });
    return acumulador;
  }, [cromos]);

  // Textos dinámicos desde useTextos
  const tMundo = textos?.paginas?.albumMundo;
  const tFiltros = tMundo?.filtros;
  const tOrden = tMundo?.orden;
  const tVacio = tMundo?.vacio;

  // Número ordinal del mundo (1 al 6)
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
      <div className="vista-mundo-cargando">
        <p className="cuerpo-m">
          {textos?.estados?.cargando ?? "Cargando..."}
        </p>
      </div>
    );
  }

  if (error || !mundo) {
    return (
      <div className="vista-mundo-error">
        <h2 className="titular-h2">
          {textos?.errores?.noEncontrado?.titulo ?? "Mundo no encontrado"}
        </h2>
        <p className="cuerpo-m">
          {textos?.errores?.noEncontrado?.texto ?? "No se pudieron cargar los datos de este mundo."}
        </p>
        <Link to="/" className="boton-home primario">
          {tMundo?.migas?.inicio ?? "Inicio"}
        </Link>
      </div>
    );
  }

  return (
    <div className="vista-mundo">
      {/* Cabecera Violeta con estilo Figma (Desktop y Mobile) */}
      <header className="vista-mundo-banner">
        <div className="vista-mundo-banner-interior">
          {/* Navegación y título Desktop */}
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

          {/* Cabecera Mobile */}
          <div className="banner-movil">
            <Link
              to="/"
              className="banner-movil-boton-atras"
              aria-label={tMundo?.migas?.inicio ?? "Volver a inicio"}
            >
              <Icono nombre="flechaizq" />
            </Link>
            <div className="banner-movil-titulos">
              <h1 className="titular-h3 banner-movil-nombre">{mundo.nombre}</h1>
              <p className="detalle-nota banner-movil-tema">
                {mundo.tema || mundo.descripcion}
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

          {/* Campo de búsqueda interactivo en móvil */}
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

      {/* Contenido principal en fondo crema (#fff8ec) */}
      <div className="vista-mundo-cuerpo">
        <div className="contenedor vista-mundo-layout">
          {/* Barra de Filtros Mobile (Selectores tipo píldora) */}
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
                {rarezas.map((r) => (
                  <option key={r.id} value={r.id}>
                    {(tFiltros?.rareza?.valor ?? "Rareza: {rareza}").replace(
                      "{rareza}",
                      r.nombre
                    )}
                  </option>
                ))}
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
                {Object.entries(tFiltros?.tipo?.opciones ?? {
                  heroe: "Héroe",
                  aliado: "Aliado",
                  villano: "Villano",
                }).map(([clave, nombre]) => (
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

          {/* Menú Lateral Izquierdo (Desktop) */}
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

          {/* Columna Derecha: Catálogo de cromos */}
          <main className="catalogo-principal">
            {/* Cabecera del catálogo (Orden en Desktop) */}
            <div className="catalogo-acciones-superiores">
              <div className="catalogo-orden-pildora">
                <span className="detalle-nota-fuerte">{etiquetaOrden}</span>
                <Icono nombre="chevronabajo" />
              </div>
            </div>

            {/* Contenedor del Catálogo */}
            <div className="catalogo-marco-grilla">
              {cromosFiltrados.length === 0 ? (
                <div className="catalogo-vacio">
                  <h3 className="titular-h3">
                    {tVacio?.titulo ?? "Ningún cromo coincide con estos filtros"}
                  </h3>
                  <p className="cuerpo-m">
                    {tVacio?.texto ?? "Prueba con otra rareza u otro tipo."}
                  </p>
                  <button
                    type="button"
                    onClick={limpiarFiltros}
                    className="boton-home primario catalogo-boton-limpiar"
                  >
                    {tVacio?.botones?.limpiar ?? "Quitar filtros"}
                  </button>
                </div>
              ) : (
                <div className="catalogo-grilla-cromos">
                  {cromosFiltrados.map((cromo) => (
                    <TarjetaCromo
                      key={cromo.id}
                      cromo={cromo}
                      mundoNombre={mundo.nombre}
                      colorMundo={mundo.color ?? "var(--marca-primario)"}
                      rarezasInfo={rarezas}
                      textos={textos}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
