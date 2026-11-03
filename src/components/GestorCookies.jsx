import { useState } from "react";
import BannerCookies from "./BannerCookies.jsx";
import PreferenciasCookies from "./PreferenciasCookies.jsx";
import "./GestorCookies.css";

const CLAVE_CONSENTIMIENTO = "cromoverso_cookies_consent";

export default function GestorCookies({
  textos,
  abierto = false,
  onAbrir,
  onCerrar,
}) {
  const [consentimiento, setConsentimiento] = useState(() => {
    try {
      return localStorage.getItem(CLAVE_CONSENTIMIENTO);
    } catch (e) {
      console.warn("No se pudo leer el almacenamiento local:", e);
      return null;
    }
  });

  const [error, setError] = useState(false);
  const cookiesTextos = textos?.cookies;

  function guardar(permitir) {
    try {
      const valor = permitir ? "aceptado" : "esenciales";
      localStorage.setItem(CLAVE_CONSENTIMIENTO, valor);
      setConsentimiento(valor);
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
