import Icono from "./Icono.jsx";
import "./MenuMovil.css";

export default function MenuMovil({
  abierto,
  onAlternar,
  menuId = "navbar-panel",
  botonRef,
  textos,
}) {
  const cerrarTexto = textos?.cerrarMenu ?? "Cerrar menú";
  const abrirTexto = textos?.abrirMenu ?? "Abrir menú";

  return (
    <button
      type="button"
      ref={botonRef}
      className="boton-menu"
      aria-label={abierto ? cerrarTexto : abrirTexto}
      aria-expanded={abierto}
      aria-controls={menuId}
      onClick={onAlternar}
    >
      <Icono nombre={abierto ? "cerrar" : "menu"} />
    </button>
  );
}
