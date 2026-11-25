import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import abanico from "../assets/ilustraciones/abanico-de-cromos.png";
import abanico2x from "../assets/ilustraciones/abanico-de-cromos@2x.png";
import { iniciarSesion } from "../services/api.js";
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

/** Vista 4 · Iniciar sesión (US-CRO-S2-03). */
export default function Ingresar({ textos }) {
  const pagina = textos?.paginas?.ingresar;
  const navigate = useNavigate();

  const [valores, setValores] = useState({ correo: "", clave: "" });
  const [mantener, setMantener] = useState(true);
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState(null);

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

  if (!pagina) return null;

  const { formulario, presentacion } = pagina;

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
    if (marcarCampos(validarIngreso(valores, pagina.errores))) {
      setAviso(pagina.errores.camposObligatorios);
      return;
    }

    setAviso(null);
    try {
      await iniciarSesion({
        correo: valores.correo.trim(),
        clave: valores.clave,
      });
      navigate("/");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setAviso(pagina.errores.credenciales);
    }
  }

  return (
    <div className="ingreso">
      <section className="ingreso-escenario" aria-hidden="true">
        <RayosFondo className="ingreso-rayos" />
        <div className="ingreso-escenario-contenido">
          <Link className="ingreso-logo" to="/" tabIndex={-1}>
            <LogoCromoverso invertido />
          </Link>

          <img
            className="ingreso-abanico"
            src={abanico}
            srcSet={`${abanico} 1x, ${abanico2x} 2x`}
            width="600"
            height="420"
            alt=""
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
            <div className="ingreso-aviso" role="alert">
              <Icono nombre="alerta" />
              <div>
                {aviso.titulo && (
                  <p className="ingreso-aviso-titulo cuerpo-p-fuerte">
                    {aviso.titulo}
                  </p>
                )}
                {aviso.texto && <p className="cuerpo-p">{aviso.texto}</p>}
              </div>
            </div>
          )}

          <fieldset className="ingreso-campos">
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
          >
            {formulario.botones.ingresar}
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
