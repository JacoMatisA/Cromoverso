import { useEffect, useRef } from "react";
import "./BannerCookies.css";

export default function BannerCookies({
  cookiesTextos,
  onAceptar,
  onRechazar,
}) {
  const bannerRef = useRef(null);
  const banner = cookiesTextos?.banner;

  useEffect(() => {
    // Al montarse, enfocar el contenedor o primer botón para navegación accesible
    bannerRef.current?.focus();
  }, []);

  if (!banner) return null;

  return (
    <aside
      ref={bannerRef}
      className="banner-cookies"
      tabIndex={-1}
      role="region"
      aria-labelledby="titulo-banner-cookies"
      aria-describedby="texto-banner-cookies"
    >
      <div className="banner-cookies-contenido">
        <h2 id="titulo-banner-cookies" className="titular-h4 banner-cookies-titulo">
          {banner.titulo}
        </h2>
        <p id="texto-banner-cookies" className="cuerpo-p banner-cookies-texto">
          {banner.texto}
        </p>
      </div>
      <div className="banner-cookies-acciones">
        {banner.botones?.rechazar && (
          <button
            type="button"
            className="boton-home secundario banner-boton banner-boton-rechazar"
            onClick={onRechazar}
          >
            {banner.botones.rechazar}
          </button>
        )}
        {banner.botones?.aceptar && (
          <button
            type="button"
            className="boton-home banner-boton banner-boton-aceptar"
            onClick={onAceptar}
          >
            {banner.botones.aceptar}
          </button>
        )}
      </div>
    </aside>
  );
}
