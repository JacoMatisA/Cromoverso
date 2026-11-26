export default function BarraAtributo({ etiqueta, valor, porcentaje, color }) {
  return (
    <div className="detalle__atributo" style={{ "--valor": porcentaje }}>
      <span className="detalle__atributo-nombre">{etiqueta}</span>
      <div className="detalle__atributo-medida">
        <span className="detalle__barra" aria-hidden="true">
          <span
            className="detalle__avance"
            style={{
              width: `${porcentaje}%`,
              backgroundColor: color,
            }}
          />
        </span>
        <span className="detalle__numero">{valor}</span>
      </div>
    </div>
  );
}
