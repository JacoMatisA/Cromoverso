import { useState } from "react";
import BannerCookies from "./BannerCookies.jsx";
import PreferenciasCookies from "./PreferenciasCookies.jsx";
import { obtenerCookie, establecerCookie } from "../utils/cookies";
import "./GestorCookies.css";

const NOMBRE_COOKIE_CONSENTIMIENTO = "consentimiento";

export default function GestorCookies({
  textos,
  abierto = false,
  onAbrir,
  onCerrar,
  onConsentimientoCambio,
}) {
  const [consentimiento, setConsentimiento] = useState(() => {
    try {
      return obtenerCookie(NOMBRE_COOKIE_CONSENTIMIENTO);
    } catch (e) {
      console.warn("No se pudo leer la cookie de consentimiento:", e);
      return null;
    }
  });

  const [error, setError] = useState(false);
  const cookiesTextos = textos?.cookies;

  function guardar(permitir) {
    try {
      const decision = permitir ? "aceptado" : "rechazado";
      establecerCookie(NOMBRE_COOKIE_CONSENTIMIENTO, decision, 365);
      setConsentimiento(decision);
      onConsentimientoCambio?.(decision);
      setError(false);
      onCerrar?.();
    } catch (err) {
      console.error("Error al persistir consentimiento de cookies:", err);
      setError(true);
    }
  }

  if (!cookiesTextos) return null;

  return (
    <>
      {!consentimiento && (
        <BannerCookies
          cookiesTextos={cookiesTextos}
          onAceptar={() => guardar(true)}
          onRechazar={() => guardar(false)}
          onConfigurar={onAbrir}
        />
      )}
      <PreferenciasCookies
        abierto={abierto}
        cookiesTextos={cookiesTextos}
        permitir={consentimiento === "aceptado"}
        onGuardar={guardar}
        onCerrar={onCerrar}
        error={error}
      />
    </>
  );
}
