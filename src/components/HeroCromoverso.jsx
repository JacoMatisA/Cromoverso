import Icono from "./Icono.jsx";
import AbanicoCromos from "./AbanicoCromos.jsx";
import "./HeroCromoverso.css";

export default function HeroCromoverso({
  textos,
  abrirCuenta,
  onExplorar,
}) {
  const hero = textos?.paginas?.inicio?.hero;
  const formatoTipo = textos?.paginas?.inicio?.tarjeta?.tipo;

  return (
    <section className="hero-cromoverso" aria-labelledby="hero-titulo">
      <div className="contenedor interior-cromoverso">
        <div className="texto-cromoverso">
          {hero?.titulo && (
            <h1 id="hero-titulo" className="titular-display hero-titulo">
              {hero.titulo}
            </h1>
          )}
          {hero?.subtituloMovil && (
            <p className="descripcion-cromoverso-movil cuerpo-m">
              {hero.subtituloMovil}
            </p>
          )}
          <div className="grupo-botones">
            {hero?.botones?.crearCuentaGratis && (
              <button
                type="button"
                className="boton-home primario hero-boton"
                onClick={() => abrirCuenta?.("registro")}
              >
                <Icono nombre="estrella" />
                <span>{hero.botones.crearCuentaGratis}</span>
              </button>
            )}
            {hero?.botones?.explorarMundos && (
              <a
                href="#mundos"
                className="boton-home secundario hero-boton"
                onClick={onExplorar}
              >
                <Icono nombre="mundo" />
                <span>{hero.botones.explorarMundos}</span>
              </a>
            )}
          </div>
          {hero?.subtitulo && (
            <p className="nota-registro cuerpo-p">
              <Icono nombre="destellos" />
              <span>{hero.subtitulo}</span>
            </p>
          )}
        </div>
        <AbanicoCromos
          etiquetaGuardiana={hero?.etiquetas?.guardiana}
          formatoTipo={formatoTipo}
        />
      </div>
    </section>
  );
}
