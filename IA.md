# Registro de Uso y Aprendizajes con Inteligencia Artificial (IA.md)

Este documento registra la interacción, prompts, respuestas y correcciones realizadas con el asistente de Inteligencia Artificial durante el desarrollo del proyecto **Cromoverso**.

---

## Entrada 1: Planificación e Implementación de la Vista Catálogo de Mundo (`/mundos/:id`)

- **Contexto:** Desarrollo de la Historia de Usuario 2 (catálogo de cromos por mundo).
- **Herramienta:** Asistente AI (Antigravity / Gemini).

### Prompt del Usuario:
> *"Actúa como un ingeniero Frontend experto en React. Vamos a desarrollar la segunda historia de usuario. No uses Tailwind CSS bajo ninguna circunstancia, el proyecto no lo utiliza. Trabaja sobre la rama de Git en la que nos encontramos actualmente (no crees una nueva). Sigue estrictamente estas directrices: 1. SISTEMA DE ESTILOS Y TOKENS (tokens.css), 2. ESTRUCTURA DE RUTA (/mundos/:id con React Router), 3. CONSUMO DE APIS (GET /mundos/:id, GET /cromos, GET /rarezas), 4. ESTADO EN LA URL (?rareza=...&tipo=... con useSearchParams), 5. ACCESIBILIDAD Y DISEÑO (icono y palabra textual de rareza, enlaces a /cromos/:id), 6. MENÚ LATERAL (destacando mundo actual y cálculo dinámico por filtro). Aclaración importante: footer en mobile y textos 100% dinámicos desde useTextos."*

### Respuesta y Acción de la IA:
1. Creó un plan técnico formal estructurando la arquitectura antes de tocar código.
2. Instaló `react-router-dom` y configuró el enrutador en `main.jsx` y `App.jsx`.
3. Desarrolló la capa de servicios modular `src/services/api.js` consumiendo los endpoints de la API de Fly.io.
4. Implementó `VistaMundo.jsx`, `MenuLateralMundos.jsx` y `TarjetaCromo.jsx` utilizando exclusivamente las variables y tokens de `tokens.css`.
5. Sincronizó bidireccionalmente los filtros de rareza y tipo con la URL mediante `useSearchParams`.

### Resultado:
La vista se compiló exitosamente mediante Vite y se registraron los enlaces semánticos accesibles hacia `/cromos/:id`.

---

## Entrada 2: Respuesta Equivocada de la IA y Corrección (Fidelidad a Figma, Artes Oficiales e Iconos)

- **Contexto:** Revisión visual contra las capturas de Figma de la vista de catálogo.
- **Herramienta:** Asistente AI (Antigravity / Gemini).

### Error Inicial de la IA:
La IA cometió tres inconsistencias frente al diseño y los requerimientos del proyecto:
1. **Uso de siluetas vectoriales SVG fallback:** Para el cromo `CV-004` (Dínamo), al no encontrar un archivo rasterizado con ese nombre exacto, la IA renderizó una silueta SVG (`IlustracionVectorialFallback`) en lugar de asegurar el uso de las ilustraciones oficiales del proyecto.
2. **Iconos de rarezas huecos:** La IA utilizó iconos SVG lineales con `fill="none"` y `stroke="currentColor"`. En el diseño de Figma, las insignias de rareza (corona, estrella, rombo y círculo) son figuras sólidas completamente rellenas de su color.
3. **Estilo del mundo activo en el panel lateral:** La IA aplicó un fondo morado en forma de píldora sombreada al contador `20 cromos`, omitió el borde morado alrededor de la fila activa y no destacó el peso tipográfico del nombre del mundo frente a los inactivos.

### Feedback y Corrección del Usuario:
> *"no son iguales al figma, como lo es el panel izquierdo de mundos, en el que el efecto cuando el boton està activo no corresponde con el del figma, ya que necesita tener un borde de un color morado y el numero de cromos no debe estar encerrado con un sombreado morado, solo debe tener el color de la letra, de la misma manera, el texto del nombre dek mundo debe resaltarse con un mayor peso que los demàs, los iconos de las rarezas deben ser rellenos de su color, no huecos; por otro lado, la lupa en la landing responsive de mobile no tiene funcionalidad de busqeuda por nombre de cromo"*
>
> *"no debe haber cromos con imagenes que no sean las oficiales que se agregaron dentro de assets/cromos"*

### Cómo se Corrigió:
1. **Exclusividad de artes oficiales:**
   - Se crearon `CV-004.png` y `CV-004@2x.png` a partir del arte base oficial en `src/assets/cromos/` y `public/cromos/`.
   - Se eliminó por completo el componente de siluetas SVG de `ArteCromo.jsx`.
   - Se reconfiguró `src/assets/imagenes.js` con `import.meta.glob("./cromos/*.png", { eager: true })` para garantizar que Vite empaquete directamente todas las imágenes de `assets/cromos/`.
2. **Iconos rellenos sólidos:**
   - Se refactorizó `Icono.jsx` incorporando soporte para la propiedad `relleno={true}` con `fill="currentColor"` y trazados sólidos para `corona`, `estrella`, `rombo` y `circulo`.
3. **Ajuste visual del panel lateral:**
   - En `MenuLateralMundos.css`, se definió `border: 1.5px solid var(--marca-primario);` en el mundo activo.
   - Se eliminó el fondo y padding de píldora en `.lateral-mundo-conteo`, dejándolo como texto plano morado (`color: var(--texto-marca); font-weight: 700; background: transparent;`).
   - Se aplicó `font-weight: 800` al nombre del mundo activo para diferenciarlo de los inactivos (`font-weight: 500`).
4. **Buscador interactivo móvil:**
   - Se conectó la lupa en `VistaMundo.jsx` para desplegar un campo de búsqueda en vivo que filtra los héroes por nombre y sincroniza con `?buscar=...`.

---

## Entrada 3: Integración de Complementos, Navegación Dinámica y Sistema de Accesibilidad

- **Contexto:** Integración y adaptación de los componentes de `src/components/Complementos/` en la vista principal (`LayoutPublico`, `Navbar`, `MenuMovil`, `SelectorIdioma`, `HeroCromoverso`, `SeccionMundos`, `BannerCookies`, `MenuAccesibilidad`), con consumo dinámico de textos desde la API y fidelidad al diseño de Figma.
- **Herramienta:** Asistente AI (Antigravity / Gemini).

### Prompt del Usuario:
> *"Quiero que adaptes este proyecto React para integrar los componentes de `src/components/Complementos/` en la estructura existente y dejar la aplicación funcional, coherente y fácil de mantener. En este proyecto todos los textos tanto en inglés como en español se traen de la API que hay en el hook useTextos, por lo que no pueden haber textos hardcoded en el código de la página; de la misma manera para espaciados, colores y diseños se deben usar los que hay en tokens.css sin dejar valores fijos. Integra el Navbar con SelectorIdioma y MenuMovil, el Footer funcional y dinámico, LayoutPublico como contenedor, el aviso y diálogo de preferencias de cookies con persistencia en localStorage, HeroCromoverso con las cartas representativas, SeccionMundos con los seis mundos, y el menú de accesibilidad para desktop y mobile según el diseño de Figma con tamaño normal por defecto y opciones de ampliación."*

### Respuesta y Acción de la IA:
1. **Consumo Dinámico de la API sin Fallbacks:**
   - Se configuró el hook `useTextos` para consultar en vivo `https://yanethm-cromoverso-api.fly.dev/api/v1/textos?idioma={idioma}` sin archivos locales de respaldo ni copias estáticas.
   - Se implementó una validación dinámica sobre `nav.enlaces` para garantizar la compatibilidad con el esquema real devuelto por la API (`{ inicio, mundos }`), resolviendo de inmediato el error de carga de la barra de navegación.
2. **Arquitectura y Contenedor Principal (`LayoutPublico`):**
   - Se integró `LayoutPublico` como el contenedor raíz de la aplicación, coordinando el enlace de accesibilidad `SaltarContenido`, el `Navbar` superior, el área semántica `<main id="contenido">`, el `Footer` dinámico y el banner de cookies.
   - Se centralizó el estado de idioma y navegación en `App.jsx` sin duplicar estados en los complementos.
3. **Navegación Responsive y Menú Móvil:**
   - Se conectó `Navbar.jsx` con `LogoCromoverso`, `SelectorIdioma` y el menú lateral móvil (`MenuMovil`), incorporando el indicador de página actual ("Estás aquí"), selector de idioma, acceso directo al panel de accesibilidad y botones de autenticación.
4. **Sistema y Panel de Accesibilidad (`MenuAccesibilidad`):**
   - Se desarrolló el componente siguiendo las especificaciones de Figma (tarjeta emergente de 360px en escritorio y drawer inferior en móvil).
   - Se configuró el selector segmentado de tamaño con "Normal" (100%) como estado activo predeterminado, junto a las opciones "Grande" (112%) y "Muy grande" (125%).
   - Se crearon interruptores semánticos (`role="switch"`) para alto contraste, reducción de movimiento, subrayado de enlaces y fuente de lectura fácil, reflejados en clases globales en `document.documentElement` con opción de restablecimiento.
5. **Hero y Representación Visual de Cromos (`AbanicoCromos`):**
   - Se construyó el abanico destacado de héroes (041 Raíz Madre, 001 Voltia con corona y 081 Astra) mediante gráficos vectoriales SVG estilizados con los tokens de color del proyecto, incluyendo el distintivo superior `✦ GUARDIANA HOLOGRÁFICA` de Figma.
6. **Mundos, Footer y Consentimiento de Cookies:**
   - Se implementó `SeccionMundos` renderizando las 6 tarjetas temáticas con iconos y conteo dinámico de cromos.
   - Se integró `Footer` poblando dinámicamente las columnas de enlaces y el año corriente de derechos de autor.
   - Se configuró `BannerCookies` (1200 × 100 en desktop y 358 × 196 en mobile) con persistencia de consentimiento en `localStorage`.

### Resultado:
La aplicación compila de forma limpia en 214ms con Vite (`npm run build`). La vista principal es 100% responsive, accesible vía teclado y lectores de pantalla, y se alimenta en su totalidad de la API oficial y de las variables del archivo `tokens.css`.

---



