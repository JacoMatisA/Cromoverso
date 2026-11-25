import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContextoSesion } from "../hooks/useSesion.js";
import { cerrarSesion, obtenerSesion } from "../services/api.js";
import { debeCerrarSesionAlIniciar } from "../utils/sesion.js";

/**
 * Proveedor global de sesión
 * La cookie httpOnly `sesion` la administra el navegador y la API; aquí solo se
 * conserva en memoria el objeto `usuario` devuelto por `GET /sesion` o `POST /sesion`.
 */
export default function ProveedorSesion({
  children,
  usuarioInicial = null,
  verificarAlIniciar = true,
}) {
  const [usuario, setUsuario] = useState(usuarioInicial);
  const [verificada, setVerificada] = useState(!verificarAlIniciar);
  const navigate = useNavigate();
  const usuarioActual = useRef(usuario);
  usuarioActual.current = usuario;

  // Si la sesión vence (401 no_autenticado), limpia el estado y lleva a ingresar.
  const sesionVencida = useCallback(() => {
    setUsuario(null);
    navigate("/ingresar");
  }, [navigate]);

  const verificar = useCallback(async () => {
    try {
      const actual = await obtenerSesion();
      if (!actual && usuarioActual.current) {
        sesionVencida();
      } else {
        setUsuario(actual);
      }
    } catch {
      // Sin conexión: se conserva el estado actual sin expulsar al usuario.
    } finally {
      setVerificada(true);
    }
  }, [sesionVencida]);

  // Al cargar la aplicación consulta GET /sesion para mantener la sesión tras recargar.
  useEffect(() => {
    if (!verificarAlIniciar) return;
    if (debeCerrarSesionAlIniciar()) {
      cerrarSesion()
        .catch(() => {})
        .finally(verificar);
    } else {
      verificar();
    }
    // Solo al montar la aplicación.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Si la persona regresa a la pestaña con sesión activa, comprueba si sigue vigente.
  useEffect(() => {
    function alVolver() {
      if (document.visibilityState === "visible" && usuarioActual.current) {
        verificar();
      }
    }
    document.addEventListener("visibilitychange", alVolver);
    window.addEventListener("focus", alVolver);
    return () => {
      document.removeEventListener("visibilitychange", alVolver);
      window.removeEventListener("focus", alVolver);
    };
  }, [verificar]);

  // Cierre de sesión: llama a DELETE /sesion y vuelve al inicio como visitante.
  const salir = useCallback(async () => {
    try {
      await cerrarSesion();
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      setUsuario(null);
      navigate("/");
    }
  }, [navigate]);

  const valor = useMemo(
    () => ({ usuario, setUsuario, verificada, salir, sesionVencida }),
    [usuario, verificada, salir, sesionVencida],
  );

  return (
    <ContextoSesion.Provider value={valor}>
      {children}
    </ContextoSesion.Provider>
  );
}
