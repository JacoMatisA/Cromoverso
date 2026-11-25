import { createContext, useContext } from "react";

export const ContextoSesion = createContext({
  usuario: null,
  setUsuario: () => {},
  verificada: true,
  salir: async () => {},
  sesionVencida: () => {},
});

export function useSesion() {
  return useContext(ContextoSesion);
}
