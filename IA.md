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

## Entrada 4: Corrección de Textos Hardcodeados y Traducción Dinámica desde la API

- **Contexto:** Revisión de textos que no cambiaban al alternar el idioma entre español e inglés en la página de inicio y en la vista de mundos.
- **Herramienta:** Asistente AI (Antigravity / Gemini).

### Prompt del Usuario:
> *"dentro de la pagina hay algunos textos que deberian cambiar y no lo hacen al cambiar de idioma, por lo que pude que estén hardcodeados, revisalos y confirma si tienen variantes en ingles desde la api, si es asi corrigelo para que cambien cuando el idioma seleccionado cambie, los textos particulares son el rol de los cromos del hero banner, que dicen heroe en lugar de hero con la pagina en ingles, y también las rarezas del menu de la izquierda en la vista de los mundos, en la seleccion para filtrar por rarezas, todas las rarezas estan en español, como legendario en lugar de legendary, epico en lugar de epic, etc con la pagina en ingles, al realizar estos cambios verifica que no haya más textos hardcodeados"*

### Respuesta y Acción de la IA:
1. **Verificación en la API:**
   - Se consultaron los endpoints `/textos?idioma=en` y `/rarezas?idioma=en`.
   - Se confirmó que `/rarezas` siempre devuelve los nombres en español, pero que `/textos?idioma=en` sí incluye las traducciones oficiales en `textos.componentes.cromo.rarezas` y `textos.componentes.cromo.tipos`.
2. **Corrección del rol en el Hero Banner:**
   - Se pasó la prop `textos` desde `HeroCromoverso.jsx` hacia `AbanicoCromos.jsx` y `TarjetaHero.jsx`.
   - En `TarjetaHero.jsx` se conectó el tipo del cromo con `textos.componentes.cromo.tipos` y se aplicó la plantilla de subtítulo `formatoTipo`, mostrando `Hero` en inglés y `Héroe` en español.
3. **Corrección de rarezas en el menú lateral:**
   - En `MenuLateralMundos.jsx` se cambió la prioridad para tomar primero `textos.componentes.cromo.rarezas` en lugar de `meta.nombre` (que venía en español desde `/rarezas`).
4. **Revisión y corrección de otros textos fijos:**
   - En `TarjetaCromo.jsx` se aplicó la misma prioridad para que el nombre de rareza en tooltips y accesibilidad cambie de idioma.
   - En `VistaMundo.jsx` se tradujeron las opciones de rareza del selector móvil usando `textos.componentes.cromo.rarezas`.
   - En `VistaDetalleCromo.jsx` se reemplazó el texto fijo `"Cargando..."` por `textos?.estados?.cargando`.
   - En `AbanicoCromos.jsx` se conectó el respaldo de la insignia de guardiana con `textos?.paginas?.inicio?.hero?.etiquetas?.guardiana`.

### Resultado:
El proyecto compiló sin errores con `npm run build` (Vite). Los roles del hero banner, las rarezas de los filtros y los demás textos revisados ahora cambian correctamente al alternar entre español e inglés.

---

## Entrada 5: Ajuste del Detalle de Cromo en Desktop y Corrección de Fallos en Mobile

- **Contexto:** Ajustes visuales en la vista de detalle de cromo (`/cromos/:id`) para centrar la estrella de fondo y alinear los contenedores en desktop, y adaptar el menú inferior en mobile fielmente al diseño de Figma.
- **Herramienta:** Asistente AI (Antigravity / Gemini).

### Prompt del Usuario:
> *"se requiere que la estrella que hay de fondo en el detalle de un cromo, detras del mismo en desktop este con unas medidas base que varien con respecto al ancho de la pantalla, con unos valores traidos de figma de layout width: 760; height: 760; angle: 0 deg; opacity: 0.16; que este bien centrado dentro del contenedor en el que se muestra, no de manera general en todo el contenedor del detalle de cromo, y que este contenedor en general tenga su borde superior a la misma altura del borde superior del contenedor de la informacion de la derecha, esto por la parte de desktop, en la parte de mobile, en el menu de detalle de cromo se requiere que sea fiel a la imagen que se adjunta del figma, si tienes dudas con medidas o algo por el estilo preguntalas para traerlas directamente del figma"*

### Error Inicial de la IA:
Tras consultar y aplicar las medidas de Figma, las primeras iteraciones en mobile presentaron varios fallos visuales al probar en dispositivos reales (Android e iOS):
1. **Texto del cromo sobre la ilustración:** Al posicionar `.cromo__pie` de forma absoluta con porcentajes (`top: 84.82%`) y usar `transform: translateZ(0)`, el nombre y subtítulo quedaron encima del personaje y el espacio blanco inferior quedó vacío.
2. **Barras de atributos vacías y parpadeos:** El uso de `display: contents`, `position: absolute` y `transform: translateZ(0)` en las barras, junto con variables CSS del mundo sin normalizar, hizo que las barras aparecieran vacías o desaparecieran al hacer scroll en Safari móvil.
3. **Scroll con espacio vacío y contenido cortado:** Un pseudo-elemento `::after` de `100vh` generó un espacio en blanco gigante al desplazarse; al restringir el scroll después, los últimos atributos quedaron cortados bajo la barra del navegador. Además, faltaba el fondo sólido oscuro (`opacity: 1`) detrás del menú móvil y la píldora de rareza desbordaba con textos largos como `LEGENDARIA`.

### Cómo se Corrigió:
1. **Desktop (`RayosFondo.jsx`, `VistaDetalleCromo.jsx`, `DetalleCromo.css`):**
   - Se agregó la prop `viewBox="0 -560 1500 1500"` en `RayosFondo` para centrar la estrella dentro de `.detalle__carta` con tamaño responsivo `clamp(600px, 52vw, 760px)`, `angle: 0deg` y `opacity: 0.16`.
   - Se alineó `.detalle__carta` al borde superior (`align-self: flex-start`) a la misma altura que `.detalle__info`.
2. **Tarjeta móvil y píldora de rareza (`DetalleCromo.css`):**
   - Se cambió `.cromo--m` (168 × 235px) a Flexbox en columna (`display: flex; flex-direction: column;`) para que `.cromo__pie` quede siempre debajo de `.cromo__arte` en flujo normal.
   - Se cambió el ancho fijo de `.detalle-etiqueta-rareza` a `width: auto; min-width: 80px; white-space: nowrap;` para adaptarse proporcionalmente a rarezas largas como `LEGENDARIA`.
3. **Barras de atributos (`VistaDetalleCromo.jsx`, `DetalleCromo.css`):**
   - Se agregó `normalizarSlugMundo` y el color hexadecimal directo del mundo (`colorHexMundo`) en `.detalle__avance`.
   - Se reemplazó el posicionamiento absoluto, `display: contents` y `transform: translateZ(0)` por un contenedor Flexbox simple, evitando los fallos de repintado en Safari móvil.
4. **Menú desplegable y fondo sólido oscuro en móvil (`DetalleCromo.css`):**
   - Se eliminó el `::after` de `100vh`, se ocultó `.detalle__titulo` duplicado y se configuró `.detalle__dialogo` al 100% de ancho con `max-height: 94dvh` y `padding-bottom: calc(92px + env(safe-area-inset-bottom, 0px))` para mostrar todos los atributos por encima de la barra del navegador.
   - Se definió `.detalle__velo` en mobile con `background-color: var(--fondo-inverso, #1a1033)` y `opacity: 1` para cubrir el fondo con el bloque sólido oscuro de Figma.

### Resultado:
El proyecto compiló sin errores con `npm run build` (Vite). En desktop la estrella y los contenedores quedan centrados y alineados, y en mobile (Android e iOS) todo el contenido, las barras de progreso y el fondo oscuro sólido se muestran fieles al diseño de Figma.

---

## Entrada 6: Corrección del Cierre del Modal y Ajuste de la Zona Izquierda del Detalle de Cromo

- **Contexto:** Corrección del comportamiento al cerrar el detalle de un cromo (`/cromos/:id`) y ajuste visual de la zona izquierda de la carta.
- **Herramienta:** Asistente AI (Antigravity / Gemini).

### Prompt del Usuario:
> *"Se requieren cambios en la vista de detalle de cromo: ajustar la zona izquierda del cromo para que coincida con el diseño, y corregir el funcionamiento de las acciones para salir del menú, ya que al darle por fuera del menú flotante no se cierra sino que cambia de cromo, y pasa lo mismo con la x para cerrar."*

### Respuesta y Acción de la IA:
1. **Corrección de las acciones para cerrar el modal (`VistaDetalleCromo.jsx`, `DetalleCromo.css`):**
   - Se identificó que `cerrarModal()` usaba `navigate(-1)`, lo cual retrocedía al cromo anterior en el historial en lugar de salir del modal cuando el usuario había navegado entre cartas.
   - Se cambió `cerrarModal()` para navegar directamente al catálogo del mundo actual (`/mundos/${cromo.mundo}`) usando `{ replace: true }`.
   - Se agregó `replace` a los enlaces de cromo anterior y siguiente para evitar acumular entradas en el historial al cambiar de carta.
   - Se separó el fondo oscuro en un elemento independiente (`.detalle__velo`) con `onClick={cerrarModal}` para cerrar limpiamente al hacer clic fuera del cuadro flotante.
2. **Ajuste de la zona izquierda del cromo (`VistaDetalleCromo.jsx`, `DetalleCromo.css`):**
   - Se adoptó la estructura de `.detalle__carta` con el fondo temático del mundo y `RayosFondo` detrás de la carta.
   - Se aplicó el diseño `.cromo` (`.cromo--g` en desktop y `.cromo--m` en mobile) con su marco de arte, rayos internos, halo, silueta del héroe, número, insignia de rareza y pie de carta.

### Resultado:
El proyecto compiló correctamente con Vite (`npm run build` en 375ms) sin errores. Tanto el botón `X` como el clic fuera del modal ahora cierran el detalle y regresan directo al catálogo del mundo, y la zona izquierda quedó ajustada al diseño.

---