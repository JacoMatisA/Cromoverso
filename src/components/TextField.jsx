import { forwardRef, useId } from "react";
import Icono from "./Icono.jsx";
import "./TextField.css";

/**
 * Campo de formulario reutilizable por props: etiqueta visible asociada al input,
 * descripción opcional, error inline enlazado por aria-describedby y accesorio opcional
 * dentro de la caja (por ejemplo, botón de mostrar/ocultar contraseña).
 */
const TextField = forwardRef(function TextField(
  {
    label,
    id,
    description,
    error,
    accesorio,
    "aria-describedby": ariaDescribedBy,
    className = "",
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;
  const describedBy = [
    ariaDescribedBy,
    description ? descriptionId : null,
    error ? errorId : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`campo${className ? ` ${className}` : ""}`}>
      <label className="campo-etiqueta cuerpo-p-fuerte" htmlFor={inputId}>
        {label}
      </label>
      <div className="campo-caja">
        <input
          ref={ref}
          className="campo-control cuerpo-m"
          id={inputId}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {accesorio}
      </div>
      {description && (
        <p className="campo-descripcion detalle-nota" id={descriptionId}>
          {description}
        </p>
      )}
      {error && (
        <p className="campo-error detalle-nota" id={errorId} role="alert">
          <Icono nombre="alerta" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});

export default TextField;
