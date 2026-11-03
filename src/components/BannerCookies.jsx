import "./BannerCookies.css";

export default function BannerCookies({
  cookiesTextos,
  onAceptar,
  onRechazar,
}) {
  const banner = cookiesTextos?.banner;
  if (!banner) return null;

  return (
    <aside className="banner-cookies" aria-label={banner.titulo} role="region">
      <div className="banner-cookies-contenido">
        <h2 className="titular-h4 banner-cookies-titulo">{banner.titulo}</h2>
        <p className="cuerpo-p banner-cookies-texto">{banner.texto}</p>
      </div>
      <div className="banner-cookies-acciones">
        {banner.botones?.rechazar && (
          <button
            type="button"
            className="boton-home secundario banner-boton"
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
