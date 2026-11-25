import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { iniciarSesion } from "../services/api.js";
import { useSesion } from "../hooks/useSesion.js";
import { avisoDeError, insertarVariables } from "../utils/erroresIngreso.js";
import { recordarPreferenciaDeSesion } from "../utils/sesion.js";
import AbanicoCromos from "./AbanicoCromos.jsx";
import CampoClave from "./CampoClave.jsx";
import Icono from "./Icono.jsx";
import LogoCromoverso from "./LogoCromoverso.jsx";
import RayosFondo from "./RayosFondo.jsx";
import TextField from "./TextField.jsx";
import "./Ingresar.css";

/** Valida campos obligatorios en el orden visual del formulario. */
export function validarIngreso({ correo, clave }, erroresTextos) {
  const resultado = {};
  if (!correo.trim()) {
    resultado.correo = erroresTextos?.correoObligatorio;
  }
  if (!clave) {
    resultado.clave = erroresTextos?.claveObligatoria;
  }
  return resultado;
}

function AvisoIngreso({ titulo, texto, esBloqueo = false }) {
  return (
    <div className="ingreso-aviso" role="alert">
      <Icono nombre="alerta" />
      <div>
        {titulo && (
          <p className="ingreso-aviso-titulo cuerpo-p-fuerte">{titulo}</p>
        )}
        {/* En cuenta regresiva cada segundo cambia el texto: no se re-anuncia en cada tick. */}
        {texto && (
          <p className="cuerpo-p" aria-live={esBloqueo ? "off" : undefined}>
            {texto}
          </p>
        )}
      </div>
    </div>
  );
}

/** Vista 4 · Iniciar sesión (US-CRO-S2-03 y US-CRO-S2-04). */
export default function Ingresar({ textos }) {
  const pagina = textos?.paginas?.ingresar;
  const { setUsuario } = useSesion();
  const navigate = useNavigate();

  const [valores, setValores] = useState({ correo: "", clave: "" });
  const [mantener, setMantener] = useState(true);
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [segundos, setSegundos] = useState(0);

  const correoRef = useRef(null);
  const claveRef = useRef(null);
  const camposRefs = { correo: correoRef, clave: claveRef };

  useEffect(() => {
    if (pagina?.seo?.titulo) {
      document.title = pagina.seo.titulo;
    }
    return () => {
      if (textos?.sitio?.nombre) {
        document.title = textos.sitio.nombre;
      }
    };
  }, [pagina, textos]);

  // Cuenta regresiva del bloqueo temporal por 429 demasiadas_peticiones (Retry-After).
  useEffect(() => {
    if (segundos <= 0) return undefined;
    const temporizador = setTimeout(() => {
      setSegundos((actual) => {
        const siguiente = actual - 1;
        if (siguiente <= 0) {
          setAviso((avisoActual) =>
            avisoActual?.tipo === "bloqueo" ? null : avisoActual,
          );
        }
        return siguiente;
      });
    }, 1000);
    return () => clearTimeout(temporizador);
  }, [segundos]);

  if (!pagina) return null;

  const { formulario, presentacion } = pagina;
  const bloqueado = segundos > 0;
  const textoAviso =
    aviso?.tipo === "bloqueo"
      ? insertarVariables(aviso.texto, { segundos })
      : aviso?.texto;

  function cambiar(evento) {
    const { name, value } = evento.target;
    setValores((actuales) => ({ ...actuales, [name]: value }));
    if (errores[name]) {
      setErrores((actuales) => ({ ...actuales, [name]: null }));
    }
  }

  function marcarCampos(nuevosErrores) {
    setErrores(nuevosErrores);
    const primero = Object.keys(nuevosErrores)[0];
    if (primero) {
      camposRefs[primero]?.current?.focus();
    }
    return Boolean(primero);
  }

  async function enviar(evento) {
    evento.preventDefault();
    if (enviando || bloqueado) return;

    if (marcarCampos(validarIngreso(valores, pagina.errores))) {
      setAviso({ ...pagina.errores.camposObligatorios, tipo: "campos" });
      return;
    }

    setAviso(null);
    setEnviando(true);
    try {
      const usuario = await iniciarSesion({
        correo: valores.correo.trim(),
        clave: valores.clave,
      });
      recordarPreferenciaDeSesion(mantener);
      setUsuario(usuario);
      navigate("/");
    } catch (err) {
      const resultado = avisoDeError(err, pagina, textos);
      setAviso({ ...resultado.aviso, tipo: resultado.tipo });
      if (resultado.campos) {
        marcarCampos(resultado.campos);
      }
      if (resultado.segundos) {
        setSegundos(resultado.segundos);
      }
      setEnviando(false);
    }
  }

  let etiquetaBoton = formulario.botones.ingresar;
  if (enviando) {
    etiquetaBoton = formulario.mensajes.ingresando;
  } else if (aviso?.tipo === "conexion") {
    etiquetaBoton = pagina.errores.conexion.botones.reintentar;
  }

  return (
    <div className="ingreso">
      <section className="ingreso-escenario" aria-hidden="true">
        <RayosFondo
          className="ingreso-rayos"
          viewBox="0 -560 1500 1500"
        />
        <div className="ingreso-escenario-contenido">
          <Link className="ingreso-logo" to="/" tabIndex={-1}>
            <LogoCromoverso invertido />
          </Link>

          <AbanicoCromos
            className="ingreso-abanico"
            mostrarGuardiana={false}
            ocultarDerechaEnMovil
            formatoTipo={textos?.paginas?.inicio?.tarjeta?.tipo}
            textos={textos}
          />

          <div className="ingreso-lema">
            {presentacion?.etiquetas?.temporada && (
              <span className="ingreso-etiqueta detalle-nota-fuerte">
                {presentacion.etiquetas.temporada}
              </span>
            )}
            {presentacion?.titulo && (
              <p className="ingreso-lema-titulo titular-h2">
                {presentacion.titulo.split(/(?<=\.)\s+/).map((frase) => (
                  <span key={frase}>{frase} </span>
                ))}
              </p>
            )}
            {presentacion?.texto && (
              <p className="ingreso-lema-texto cuerpo-m">{presentacion.texto}</p>
            )}
          </div>
        </div>
      </section>

      <div className="ingreso-lado">
        <form className="ingreso-formulario" onSubmit={enviar} noValidate>
          <Link
            className="ingreso-marca"
            to="/"
            aria-label={textos?.navbar?.logo?.aria ?? textos?.sitio?.nombre}
          >
            <LogoCromoverso />
          </Link>

          <div className="ingreso-encabezado">
            <h1 className="titular-h2 ingreso-titulo">{formulario.titulo}</h1>
            <p className="ingreso-subtitulo cuerpo-m">{formulario.subtitulo}</p>
          </div>

          {aviso && (
            <AvisoIngreso
              titulo={aviso.titulo}
              texto={textoAviso}
              esBloqueo={aviso.tipo === "bloqueo"}
            />
          )}

          <fieldset className="ingreso-campos" disabled={bloqueado}>
            <TextField
              ref={correoRef}
              id="ingreso-correo"
              name="correo"
              type="email"
              autoComplete="email"
              label={formulario.etiquetas.correo}
              placeholder={formulario.placeholders.correo}
              value={valores.correo}
              onChange={cambiar}
              error={errores.correo}
            />
            <CampoClave
              ref={claveRef}
              id="ingreso-clave"
              name="clave"
              label={formulario.etiquetas.clave}
              etiquetaMostrar={formulario.botones.mostrarClave}
              etiquetaOcultar={formulario.botones.ocultarClave}
              value={valores.clave}
              onChange={cambiar}
              error={errores.clave}
            />
          </fieldset>

          <div className="ingreso-recordar">
            <label className="ingreso-casilla cuerpo-p">
              <input
                type="checkbox"
                checked={mantener}
                disabled={bloqueado}
                onChange={(e) => setMantener(e.target.checked)}
              />
              <span className="ingreso-casilla-marca" aria-hidden="true">
                <Icono nombre="check" />
              </span>
              <span>{formulario.etiquetas.mantenerSesion}</span>
            </label>

            <Link className="ingreso-enlace cuerpo-p-fuerte" to="/recuperar-clave">
              {formulario.enlaces.olvidasteClave}
            </Link>
          </div>

          <button
            type="submit"
            className="boton boton--primario boton--g ingreso-enviar"
            disabled={enviando || bloqueado}
            aria-busy={enviando}
          >
            {enviando && (
              <span className="ingreso-girando" aria-hidden="true" />
            )}
            {etiquetaBoton}
          </button>

          <p className="ingreso-pie cuerpo-p">
            {formulario.mensajes.sinCuenta}{" "}
            <Link className="ingreso-enlace cuerpo-p-fuerte" to="/registro">
              {formulario.enlaces.crearCuenta}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
