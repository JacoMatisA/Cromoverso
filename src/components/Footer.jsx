import LogoCromoverso from "./LogoCromoverso.jsx";
import "./Footer.css";

const DESTINOS = {
  inicio: "#inicio",
  mundos: "#mundos",
  ingresar: "#ingresar",
  crearCuenta: "#crear-cuenta",
  terminos: "#terminos",
  accesibilidad: "#accesibilidad",
};

export default function Footer({
  textos,
  onCuenta,
  onAbrirCookies,
}) {
  const pie = textos?.footer;
  const columnas = pie?.columnas;
  const lema = pie?.lema;
  const derechos = pie?.legal?.derechos
    ? pie.legal.derechos.replace("{anio}", new Date().getFullYear().toString())
    : null;
  const textoCookies = textos?.cookies?.preferencias?.titulo ?? "Cookies";

  function manejarCuenta(clave, e) {
    if (onCuenta && (clave === "ingresar" || clave === "crearCuenta")) {
      e.preventDefault();
      onCuenta(clave === "crearCuenta" ? "registro" : "ingresar");
    }
  }

  return (
    <footer className="pie-sitio" role="contentinfo">
      <div className="contenedor">
        <div className="columnas-pie">
          <div className="pie-marca-bloque">
            <a href="#inicio" className="pie-marca" aria-label={textos?.sitio?.nombre}>
              <LogoCromoverso invertido />
            </a>
            {lema && <p className="cuerpo-p">{lema}</p>}
          </div>

          {columnas?.explora && (
            <nav className="pie-seccion" aria-label={columnas.explora.titulo}>
              <h3 className="titular-h4 pie-columna-titulo">{columnas.explora.titulo}</h3>
              <ul className="pie-lista">
                {Object.entries(columnas.explora.enlaces ?? {}).map(([clave, etiqueta]) => (
                  <li key={clave}>
                    <a href={DESTINOS[clave] ?? `#${clave}`} className="cuerpo-p pie-enlace">
                      {etiqueta}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {columnas?.cuenta && (
            <nav className="pie-seccion" aria-label={columnas.cuenta.titulo}>
              <h3 className="titular-h4 pie-columna-titulo">{columnas.cuenta.titulo}</h3>
              <ul className="pie-lista">
                {Object.entries(columnas.cuenta.enlaces ?? {}).map(([clave, etiqueta]) => (
                  <li key={clave}>
                    <a
                      href={DESTINOS[clave] ?? `#${clave}`}
                      className="cuerpo-p pie-enlace"
                      onClick={(e) => manejarCuenta(clave, e)}
                    >
                      {etiqueta}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {columnas?.legal && (
            <nav className="pie-seccion" aria-label={columnas.legal.titulo}>
              <h3 className="titular-h4 pie-columna-titulo">{columnas.legal.titulo}</h3>
              <ul className="pie-lista">
                {Object.entries(columnas.legal.enlaces ?? {}).map(([clave, etiqueta]) => (
                  <li key={clave}>
                    <a href={DESTINOS[clave] ?? `#${clave}`} className="cuerpo-p pie-enlace">
                      {etiqueta}
                    </a>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className="cuerpo-p pie-enlace enlace-cookies"
                    onClick={onAbrirCookies}
                  >
                    {textoCookies}
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>

        {derechos && (
          <div className="pie-creditos">
            <span className="detalle-nota">{derechos}</span>
          </div>
        )}
      </div>
    </footer>
  );
}
