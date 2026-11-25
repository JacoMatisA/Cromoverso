import { Link } from "react-router-dom";

/**
 * Pantalla provisional para /registro.
 * Lista para completarse en historias futuras de creación de cuenta.
 */
export default function VistaRegistro({ textos }) {
  const pagina = textos?.paginas?.registro;
  const titulo =
    pagina?.formulario?.titulo ??
    pagina?.seo?.titulo ??
    textos?.navbar?.botones?.crearCuenta;
  const subtitulo = pagina?.formulario?.subtitulo ?? pagina?.seo?.descripcion;
  const textoVolver = textos?.general?.acciones?.volver;

  return (
    <section
      className="contenedor"
      style={{
        paddingBlock: "var(--espacio-8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "var(--espacio-4)",
      }}
    >
      {titulo && <h1 className="titular-h1">{titulo}</h1>}
      {subtitulo && <p className="cuerpo-m">{subtitulo}</p>}
      {textoVolver && (
        <Link to="/ingresar" className="boton-home secundario">
          {textoVolver}
        </Link>
      )}
    </section>
  );
}
