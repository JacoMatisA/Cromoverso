# Cromoverso React

Aplicación web frontend en React para Cromoverso, una plataforma de colección e intercambio de cromos a través de diferentes mundos temáticos.

## Requisitos y ejecución

- **Node.js**: versión 18 o superior recomendada.
- **Instalación de dependencias**:
  ```bash
  npm install
  ```
- **Modo desarrollo**:
  ```bash
  npm run dev
  ```
- **Compilación para producción**:
  ```bash
  npm run build
  ```
- **Vista previa de producción**:
  ```bash
  npm run preview
  ```

---

## Estructura del proyecto

```text
cromoverso-react/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.css
    ├── App.jsx
    ├── main.jsx
    ├── hooks/
    │   └── useTextos.js
    ├── styles/
    │   ├── global.css
    │   └── tokens.css
    └── components/
        ├── Footer.css
        ├── Footer.jsx
        ├── Icono.jsx
        ├── LogoCromoverso.jsx
        ├── Navbar.css
        ├── Navbar.jsx
        ├── SaltarContenido.css
        ├── SaltarContenido.jsx
        ├── AbanicoCromos.css
        ├── AbanicoCromos.jsx
        ├── BannerCookies.css
        ├── BannerCookies.jsx
        ├── GestorCookies.css
        ├── GestorCookies.jsx
        ├── HeroCromoverso.css
        ├── HeroCromoverso.jsx
        ├── LayoutPublico.css
        ├── LayoutPublico.jsx
        ├── MenuAccesibilidad.css
        ├── MenuAccesibilidad.jsx
        ├── MenuMovil.css
        ├── MenuMovil.jsx
        ├── PreferenciasCookies.css
        ├── PreferenciasCookies.jsx
        ├── SeccionMundos.css
        ├── SeccionMundos.jsx
        ├── SelectorIdioma.css
        └── SelectorIdioma.jsx
```

---

## Componentes y arquitectura

### 1. `LayoutPublico` (`src/components/LayoutPublico.jsx`)
- **Propósito**: Contenedor principal que envuelve las páginas de la aplicación. Centraliza el enlace accesible de salto al contenido (`<main id="contenido">`), la barra de navegación, el pie de página y la gestión del banner y diálogo de cookies.
- **Props**:
  - `textos`: Objeto de textos provisto en tiempo real por el hook `useTextos` desde la API.
  - `cargando`, `error`, `recargar`: Estados de carga y reintento.
  - `idioma`: Idioma actual (`"es"` o `"en"`), sincronizado con el estado único de `App`.
  - `onCambiarIdioma`: Callback para actualizar el idioma.
  - `activo`: Sección activa basada en el hash de navegación (`#inicio`, `#mundos`).
  - `configAccesibilidad`: Objeto con el estado de tamaño de fuente y toggles de accesibilidad.
  - `onCambiarAccesibilidad`: Callback para cambiar un parámetro de accesibilidad.
  - `onRestablecerAccesibilidad`: Callback para restaurar valores por defecto.
  - `onCuenta`: Callback para acciones de cuenta (ingreso / registro).
  - `children`: Contenido principal de la página.

### 2. `Navbar` (`src/components/Navbar.jsx`)
- **Propósito**: Barra de navegación superior responsive y accesible que replica fielmente el diseño de Figma para desktop y mobile.
- **Subcomponentes integrados**:
  - `LogoCromoverso` e `Icono`.
  - `SelectorIdioma`: Selector tipo píldora (`ES` / `EN`) con atributos accesibles (`role="group"`, `aria-pressed`, `lang`).
  - `MenuAccesibilidad`: Menú emergente de accesibilidad (tarjeta de 360px en escritorio, modal/drawer en móvil).
  - Menú lateral móvil con navegación semántica, indicación de "Estás aquí", opciones de idioma, accesibilidad y botones de cuenta.

### 3. `MenuAccesibilidad` (`src/components/MenuAccesibilidad.jsx`)
- **Propósito**: Panel de accesibilidad configurable conforme al diseño de Figma.
- **Características**:
  - Selector de tamaño de texto segmentado: "Normal" (100% predeterminado activo), "Grande" (112%), "Muy grande" (125%).
  - Toggles accesibles (`role="switch"`):
    - Alto contraste (`alto-contraste`).
    - Reducir movimiento (`reducir-movimiento`).
    - Subrayar enlaces (`subrayar-enlaces`).
    - Fuente para lectura fácil (`fuente-lectura-facil`).
  - Botón de restablecimiento y enlace a declaración de accesibilidad.

### 4. `HeroCromoverso` y `AbanicoCromos` (`src/components/`)
- **Propósito**: Sección hero destacada ("Seis mundos. 120 héroes. Un álbum tuyo.") con botones de acción primaria ("Crear cuenta gratis") y secundaria ("Explorar los mundos").
- **AbanicoCromos**:
  - Renderizado visual de cromos representativos (041 Raíz Madre, 001 Voltia, 081 Astra) con insignias de corona, visor dorado característico y distintivo superior `✦ GUARDIANA HOLOGRÁFICA`.
  - Integración de los artes oficiales de cromos (041 Raíz Madre, 001 Voltia, 081 Astra) con soporte de resoluciones 1x y @2x.
  - Componente ArteCromo con resolución automática por ID de API (cromos/CV-001) y fallback dinámico mediante ilustracion.colorBase e ilustracion.figura para cromos sin arte gráfico.
  - Soporte de ilustración global del hero banner (banico-de-cromos) en 1x y @2x.

### 5. `SeccionMundos` (`src/components/SeccionMundos.jsx`)
- **Propósito**: Sección "Los seis mundos" con las 6 tarjetas temáticas (Ciudad Neón, Abismo Coral, Bosque Eterno, Forja Volcánica, Estación Órbita, Reino de Niebla), insignias y conteo dinámico de cromos formateado según la API.

### 6. `Footer` (`src/components/Footer.jsx`)
- **Propósito**: Pie de página semántico (`role="contentinfo"`). Incluye marca, columnas dinámicas ("Explora", "Tu cuenta", "Legal"), enlace a preferencias de cookies y derechos reservados, todo alimentado dinámicamente desde `textos.footer`.

### 7. `GestorCookies` (`src/components/GestorCookies.jsx`)
- **Propósito**: Banner (`BannerCookies`) y diálogo modal nativo (`PreferenciasCookies`) con persistencia en `localStorage`. Cumple con las dimensiones y diseño de Figma (1200 x 100 en desktop y 358 x 196 en mobile).

---

## Textos dinámicos y Consumo de API

Todos los textos de la interfaz se obtienen en tiempo real a través del hook `useTextos`, el cual consulta directamente la API:
- Endpoint: `https://yanethm-cromoverso-api.fly.dev/api/v1/textos?idioma={es|en}`.
- No existen archivos intermedios de fallback ni textos fijos en los componentes.
- La validación del esquema (`validarTextos`) se adapta a los enlaces provistos por la API (`inicio`, `mundos`).

---

## Tokens de diseño

Los estilos están alineados estrictamente con las variables definidas en `src/styles/tokens.css`, sin valores fijos de espaciado en los componentes:
- Espaciados: `--espacio-1` (4px) a `--espacio-8` (64px).
- Radios: `--radio-s` (8px), `--radio-m` (12px), `--radio-l` (16px), `--radio-xl` (24px), `--radio-pildora` (999px).
- Colores de mundos: `--mundo-neon`, `--mundo-coral`, `--mundo-bosque`, `--mundo-forja`, `--mundo-orbita`, `--mundo-niebla` y sus variantes suaves.
- Fondos y texto: `--fondo-pagina`, `--fondo-superficie`, `--fondo-inverso`, `--texto-principal`, `--texto-secundario`.
- Sombras y bordes: `--sombra-pop`, `--sombra-pop-pequena`, `--borde-grosor`, `--borde-fuerte`.


---

## Imágenes y Recursos Gráficos

Los recursos gráficos exportados desde Figma se encuentran organizados en public/ y src/assets/:
- **Cromos**: public/cromos/ y src/assets/cromos/ con formato PNG en 1x y @2x nombrando cada archivo por su ID de API (ej: CV-001.png, CV-041@2x.png).
- **Ilustración del Hero**: public/ilustraciones/ y src/assets/ilustraciones/ (banico-de-cromos.png y banico-de-cromos@2x.png).
- **Módulo de resolución**: src/assets/imagenes.js provee utilidades como obtenerArteCromo(id), obtenerIlustracion(nombre) y 	ieneArteCromo(id).
- **Fallback dinámico**: Dado que la API no envía imágenes, para los cromos que no tienen arte rasterizado disponible, el componente ArteCromo genera una composición vectorial SVG utilizando ilustracion.colorBase e ilustracion.figura.
