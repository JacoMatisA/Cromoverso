import "./SaltarContenido.css";

export default function SaltarContenido({ texto, destino = "#contenido" }) {
  if (!texto) return null;
  return (
    <a href={destino} className="saltar-contenido cuerpo-p-fuerte">
      {texto}
    </a>
  );
}
