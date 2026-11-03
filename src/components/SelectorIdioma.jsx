import "./SelectorIdioma.css";

export default function SelectorIdioma({
  idioma,
  onCambiar,
  etiqueta = "Cambiar idioma",
  codigos = { es: "ES", en: "EN" },
}) {
  return (
    <div className="idiomas-home" role="group" aria-label={etiqueta}>
      {Object.entries(codigos).map(([valor, texto]) => (
        <button
          type="button"
          key={valor}
          lang={valor}
          aria-pressed={idioma === valor}
          onClick={() => onCambiar(valor)}
        >
          {texto}
        </button>
      ))}
    </div>
  );
}
