import { forwardRef, useState } from "react";
import Icono from "./Icono.jsx";
import TextField from "./TextField.jsx";

/**
 * Campo de contraseña con botón accesible para mostrar u ocultar la clave.
 * Anuncia su estado actual a lectores de pantalla con `aria-pressed` y `aria-label`.
 */
const CampoClave = forwardRef(function CampoClave(
  { etiquetaMostrar, etiquetaOcultar, ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      ref={ref}
      type={visible ? "text" : "password"}
      autoComplete="current-password"
      accesorio={
        <button
          type="button"
          className="campo-accesorio"
          aria-pressed={visible}
          aria-label={visible ? etiquetaOcultar : etiquetaMostrar}
          onClick={() => setVisible((actual) => !actual)}
        >
          <Icono nombre={visible ? "ojoTachado" : "ojo"} />
        </button>
      }
      {...props}
    />
  );
});

export default CampoClave;
