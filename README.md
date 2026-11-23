# Cromoverso React

Aplicación web frontend en React para **Cromoverso**, una plataforma de colección e intercambio de cromos a través de diferentes mundos temáticos. El código ha sido refactorizado con una arquitectura modular, declarativa y basada en la **composición de componentes y tarjetas reutilizables mediante props**, siguiendo las mejores prácticas de proyectos como [Bitácora Espacial](https://bitacora-espacial-ecru.vercel.app).

---

## Requisitos y Ejecución

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

## Estructura del Proyecto

El proyecto organiza sus componentes por dominio y responsabilidad clara, facilitando su comprensión, mantenimiento y reutilización:

```text
src/
├── assets/
│   ├── cromos/               # Artes rasterizados de cromos (1x, @2x, @3x)
│   ├── ilustraciones/        # Ilustraciones principales (hero banner)
│   └── imagenes.js           # Módulo de resolución y mapeo dinámico de imágenes
├── components/
│   ├── cards/                # 🃏 TARJETAS REUTILIZABLES POR PROPS
│   │   ├── TarjetaCromo.jsx  # Tarjeta de cromo (props atómicas o vía objeto)
│   │   ├── TarjetaMundo.jsx  # Tarjeta temática de mundo con props configurables
│   │   ├── TarjetaHero.jsx   # Tarjeta individual para el abanico del Hero
│   │   └── index.js          # Exportaciones limpias de tarjetas
│   ├── catalogo/             # 📦 CONTENEDORES Y COLECCIONES
│   │   ├── GrillaCromos.jsx  # Grilla desacoplada de cromos + estados vacíos
│   │   └── index.js
│   ├── hero/                 # 🚀 SECCIÓN HERO Y PRESENTACIÓN
│   │   ├── HeroCromoverso.jsx
│   │   └── AbanicoCromos.jsx # Compone tarjetas TarjetaHero de forma limpia
│   ├── layout/               # 🏛️ ESTRUCTURA Y NAVEGACIÓN
│   │   ├── LayoutPublico.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── MenuMovil.jsx
│   │   └── SaltarContenido.jsx
│   ├── cookies/              # 🍪 GESTIÓN DE CONSENTIMIENTO
│   │   ├── BannerCookies.jsx
│   │   ├── GestorCookies.jsx
│   │   └── PreferenciasCookies.jsx
│   ├── common/               # 🧩 ELEMENTOS COMUNES Y ÁTOMOS
│   │   ├── ArteCromo.jsx
│   │   ├── Icono.jsx
│   │   ├── LogoCromoverso.jsx
│   │   ├── RayosFondo.jsx
│   │   ├── MenuAccesibilidad.jsx
│   │   └── SelectorIdioma.jsx
│   ├── VistaInicio.jsx       # Vista de inicio integradora
│   ├── VistaMundo.jsx        # Vista de álbum de mundo filtrable
│   └── index.js              # Barril principal de exportaciones
├── hooks/
│   └── useTextos.js          # Consumo de textos i18n desde la API
├── services/
│   └── api.js                # Cliente HTTP para mundos, cromos y rarezas
├── styles/
│   ├── tokens.css            # Tokens de diseño (espaciados, colores, fuentes)
│   └── global.css            # Estilos base y tipografía
├── utils/
│   └── cookies.js            # Utilidades de persistencia y cookies
├── App.jsx                   # Enrutamiento, accesibilidad e idioma
└── main.jsx                  # Punto de entrada
```

---

## Composición de Componentes Reutilizables por Props

Inspirado en el patrón de tarjetas de [Bitácora Espacial](https://bitacora-espacial-ecru.vercel.app), los componentes clave reciben sus datos mediante **props explícitas y atómicas**, lo que permite usarlos en cualquier contexto sin atarse a estructuras rígidas de la base de datos.

### 1. `TarjetaCromo` (`src/components/cards/TarjetaCromo.jsx`)
Renderiza una tarjeta de cromo coleccionable con su marco, número formateado, insignia de rareza, arte con fallback dinámico y pie con metadatos.

**Uso declarativo por props atómicas:**
```jsx
import { TarjetaCromo } from "./components";

// Ejemplo de uso limpio por props:
<TarjetaCromo
  id="CV-001"
  numero={1}
  nombre="Voltia"
  rareza="legendaria"
  tipo="heroe"
  mundo="Ciudad Neón"
  enlace="/cromos/CV-001"
/>
```

**Uso mediante objeto de datos (retrocompatibilidad):**
```jsx
<TarjetaCromo
  cromo={cromoData}
  mundoNombre="Ciudad Neón"
  rarezasInfo={listaRarezas}
  textos={textosI18n}
/>
```

---

### 2. `TarjetaMundo` (`src/components/cards/TarjetaMundo.jsx`)
Tarjeta desacoplada para mostrar mundos temáticos en catálogos, secciones o carruseles.

```jsx
import { TarjetaMundo } from "./components";

<TarjetaMundo
  clave="neon"
  nombre="Ciudad Neón"
  numero={1}
  icono="rayo"
  totalCromos={20}
  tieneTag={true}
  etiquetaMundo="Mundo {numero}"
  etiquetaCromos="{cantidad} cromos"
  enlace="/mundos/neon"
/>
```

---

### 3. `TarjetaHero` (`src/components/cards/TarjetaHero.jsx`)
Tarjeta individual para composiciones destacadas (utilizada en el abanico del Hero banner). Elimina la duplicación de código en vistas destacadas.

```jsx
import { TarjetaHero } from "./components";

<TarjetaHero
  id="CV-001"
  numero={1}
  nombre="Voltia"
  posicion="centro"
  destacada={true}
  formatoTipo="{mundo} • {tipo}"
/>
```

---

### 4. `GrillaCromos` (`src/components/catalogo/GrillaCromos.jsx`)
Componente contenedor de alto nivel que gestiona el mapeo de colecciones y el renderizado del estado vacío si no hay coincidencias de filtrado.

```jsx
import { GrillaCromos } from "./components";

<GrillaCromos
  cromos={cromosFiltrados}
  mundoNombre="Ciudad Neón"
  colorMundo="var(--mundo-neon)"
  rarezasInfo={rarezas}
  textos={textos}
  onLimpiarFiltros={() => limpiarFiltros()}
/>
```

---

## Vistas Principales

### `VistaInicio` (`src/components/VistaInicio.jsx`)
Compone:
1. **`HeroCromoverso`**: Encabezado principal que incluye el llamado a la acción y el **`AbanicoCromos`** (compuesto por tres `TarjetaHero`).
2. **`SeccionMundos`**: Grilla de los 6 mundos temáticos compuesta mediante **`TarjetaMundo`**.

### `VistaMundo` (`src/components/VistaMundo.jsx`)
Vista de catálogo y álbum interactivo:
- Carga reactiva de datos (`obtenerMundo`, `obtenerCromos`, `obtenerRarezas`).
- Sincronización bidireccional de filtros de búsqueda, rareza y tipo en los parámetros de la URL (`?buscar=&rareza=&tipo=`).
- Menú lateral interactivo (`MenuLateralMundos`) con conteos en tiempo real por categoría.
- Grilla desacoplada mediante **`GrillaCromos`**.

---

## Accesibilidad y Tokens de Diseño

- **Accesibilidad**: Toggles para alto contraste (`.alto-contraste`), reducción de movimiento (`.reducir-movimiento`), subrayado de enlaces (`.subrayar-enlaces`) y tipografía amigable (`.fuente-lectura-facil`).
- **Tokens**: Sistema completo de variables CSS en `src/styles/tokens.css` (espaciados `--espacio-1` a `--espacio-8`, radios `--radio-s` a `--radio-pildora`, colores temáticos por mundo).
- **Textos i18n dinámicos**: Consumo sin cadenas fijas mediante el hook `useTextos` (`es` / `en`).
