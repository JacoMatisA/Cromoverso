# Cromoverso React

Aplicación web frontend en React + Vite para **Cromoverso**, una plataforma de colección e intercambio de cromos a través de seis mundos temáticos. El proyecto sigue una arquitectura modular basada en **componentes reutilizables mediante props**, **textos 100 % dinámicos desde la API (`es` / `en`)**, **tokens estrictos en `tokens.css`** y **autenticación segura mediante cookie `httpOnly`**.

---

## Requisitos, Configuración y Ejecución

- **Node.js**: versión 18 o superior recomendada.
- **Variable de entorno** (`.env` basado en `.env.example`):
  ```env
  VITE_API_URL=https://yanethm-cromoverso-api.fly.dev/api/v1
  ```
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

```text
src/
├── assets/
│   ├── cromos/                     # Artes rasterizados oficiales de cromos (1x, @2x, @3x)
│   ├── ilustraciones/              # Ilustraciones principales (abanico de cromos)
│   └── imagenes.js                 # Módulo de resolución y mapeo dinámico de imágenes
├── components/
│   ├── cards/                      # Tarjetas reutilizables por props
│   │   ├── TarjetaCromo.jsx        # Tarjeta de cromo (props atómicas o vía objeto)
│   │   ├── TarjetaMundo.jsx        # Tarjeta temática de mundo con props configurables
│   │   ├── TarjetaHero.jsx         # Tarjeta individual para el abanico
│   │   └── index.js
│   ├── catalogo/                   # Contenedores de colecciones
│   │   ├── GrillaCromos.jsx        # Grilla de cromos + estado vacío con limpieza de filtros
│   │   └── index.js
│   ├── DetalleCromo/               # Vista 3 · Detalle individual del cromo
│   │   ├── VistaDetalleCromo.jsx   # Modal de ficha con atributos, vecinos, esqueletos y errores
│   │   ├── IlustracionCromoSVG.jsx
│   │   └── DetalleCromo.css
│   ├── AbanicoCromos.jsx           # Abanico reutilizable (3 cromos web / 2 en móvil en ingreso)
│   ├── ArteCromo.jsx               # Resolución de arte oficial por cromo
│   ├── BannerCookies.jsx           # Banner de consentimiento de cookies
│   ├── CampoClave.jsx              # Campo de contraseña con botón ojo/ojoTachado accesible
│   ├── Estados.jsx                 # Esqueleto, AvisoCarga y EstadoError reutilizables
│   ├── Footer.jsx                  # Pie de página dinámico
│   ├── GestorCookies.jsx           # Coordinador de consentimiento de cookies
│   ├── HeroCromoverso.jsx          # Hero de la página de inicio
│   ├── Icono.jsx                   # Librería centralizada de iconos SVG de Figma
│   ├── Ingresar.jsx                # Vista 4 · Iniciar sesión a pantalla completa (/ingresar)
│   ├── LayoutPublico.jsx           # Layout público (omite Navbar/Footer en /ingresar)
│   ├── LogoCromoverso.jsx          # Logotipo SVG (normal e invertido)
│   ├── MenuAccesibilidad.jsx       # Panel de accesibilidad (tamaño, contraste, movimiento, etc.)
│   ├── MenuCuenta.jsx              # Avatar e interfaz desplegable de cuenta y cierre de sesión
│   ├── MenuLateralMundos.jsx       # Navegación y filtros laterales del catálogo
│   ├── MenuMovil.jsx               # Apoyo de navegación móvil
│   ├── Navbar.jsx                  # Barra superior responsive y drawer móvil con estado de sesión
│   ├── PreferenciasCookies.jsx     # Diálogo de preferencias de cookies
│   ├── ProveedorSesion.jsx         # Contexto global de sesión (GET /sesion y DELETE /sesion)
│   ├── RayosFondo.jsx              # Estrella radial de fondo reutilizable
│   ├── SaltarContenido.jsx         # Enlace accesible "Saltar al contenido"
│   ├── SeccionMundos.jsx           # Grilla de los seis mundos
│   ├── SelectorIdioma.jsx          # Selector ES / EN conectado a cookie con consentimiento
│   ├── TextField.jsx               # Campo de formulario reutilizable con label y error inline
│   ├── VistaInicio.jsx             # Vista 1 · Inicio público (/)
│   ├── VistaMundo.jsx              # Vista 2 · Catálogo de mundo (/mundos/:id)
│   ├── VistaRecuperarClave.jsx     # Vista provisional (/recuperar-clave)
│   ├── VistaRegistro.jsx           # Vista provisional (/registro)
│   └── index.js                    # Barril principal de exportaciones
├── hooks/
│   ├── useSesion.js                # Hook y contexto de sesión de usuario
│   └── useTextos.js                # Consumo de textos i18n desde GET /textos?idioma=es|en
├── services/
│   └── api.js                      # Cliente HTTP (ErrorHttp, simulación, mundos, cromos, sesión)
├── styles/
│   ├── tokens.css                  # Tokens de diseño oficiales de Figma
│   └── global.css                  # Estilos base, botones y utilidades de accesibilidad
├── utils/
│   ├── cookies.js                  # Lectura, escritura y borrado de cookies de preferencias
│   ├── erroresIngreso.js           # Traducción de errores 401, 429, 422 y red en /ingresar
│   └── sesion.js                   # Iniciales del avatar y preferencia de sesión temporal
├── App.jsx                         # Enrutamiento principal, accesibilidad e idioma
└── main.jsx                        # Punto de entrada con BrowserRouter y ProveedorSesion
```

---

## Composición de Componentes Reutilizables por Props

### 1. Tarjetas y catálogo (`TarjetaCromo`, `TarjetaMundo`, `TarjetaHero`, `GrillaCromos`)

```jsx
import { TarjetaCromo, TarjetaMundo, GrillaCromos } from "./components";

<TarjetaCromo
  id="CV-001"
  numero={1}
  nombre="Voltia"
  rareza="legendaria"
  tipo="heroe"
  mundo="Ciudad Neón"
  enlace="/cromos/CV-001"
/>

<GrillaCromos
  cromos={cromosFiltrados}
  mundoNombre="Ciudad Neón"
  colorMundo="var(--mundo-neon)"
  rarezasInfo={rarezas}
  textos={textos}
  onLimpiarFiltros={limpiarFiltros}
/>
```

### 2. Estados de carga y error (`Estados.jsx`)

Componentes reutilizables para vistas asíncronas, alimentados exclusivamente por `textos.estados` y `textos.errores`:

```jsx
import { AvisoCarga, Esqueleto, EstadoError } from "./components";

<AvisoCarga textos={textos} />
<Esqueleto className="vista-mundo-esqueleto-carta" />
<EstadoError
  textos={textos}
  error={error}
  onReintentar={reintentar}
  etiquetaTitulo="h1"
/>
```

### 3. Formularios accesibles (`TextField` y `CampoClave`)

```jsx
import { TextField, CampoClave } from "./components";

<TextField
  ref={correoRef}
  id="ingreso-correo"
  name="correo"
  type="email"
  label={formulario.etiquetas.correo}
  placeholder={formulario.placeholders.correo}
  value={valores.correo}
  onChange={cambiar}
  error={errores.correo}
/>

<CampoClave
  ref={claveRef}
  id="ingreso-clave"
  name="clave"
  label={formulario.etiquetas.clave}
  etiquetaMostrar={formulario.botones.mostrarClave}
  etiquetaOcultar={formulario.botones.ocultarClave}
  value={valores.clave}
  onChange={cambiar}
  error={errores.clave}
/>
```

### 4. Cuenta y sesión (`MenuCuenta` y `Avatar`)

- `Avatar` acepta `variante="acento"` (amarillo de acento para la barra en escritorio) o `variante="propio"` (color de perfil `usuario.colorAvatar` para el panel desplegable y el menú hamburguesa móvil).
- `MenuCuenta` muestra el avatar circular en la barra superior de escritorio y despliega un menú accesible (cierre con `Escape` y clic exterior) con los datos del usuario y el botón **Cerrar sesión**.

---

## Vistas Principales y Rutas

| Ruta | Componente | Descripción |
| :--- | :--- | :--- |
| `/` | `VistaInicio` | Inicio público: `HeroCromoverso` con `AbanicoCromos` y `SeccionMundos`. |
| `/mundos/:id` | `VistaMundo` | Catálogo filtrable (`?rareza=&tipo=&buscar=`) con esqueletos, vacío y error con reintento. |
| `/cromos/:id` | `VistaDetalleCromo` | Modal de detalle de cromo con atributos, vecinos, esqueletos, 404 y error con reintento. |
| `/ingresar` | `Ingresar` | Vista 4 a pantalla completa (sin `Navbar` ni `Footer`) para inicio de sesión con `POST /sesion`. |
| `/registro` | `VistaRegistro` | Pantalla provisional lista para implementar la creación de cuenta. |
| `/recuperar-clave` | `VistaRecuperarClave` | Pantalla provisional lista para implementar la recuperación de contraseña. |

---

## Historias de Usuario Implementadas (Sprint 2)

### `US-CRO-S2-02` — Estados de carga, vacío y error (Vistas 2 y 3)
- **Carga**: esqueletos animados con respeto a `prefers-reduced-motion` y anuncio `role="status"` (`AvisoCarga` con `textos.estados.cargando`).
- **Vacío**: estado vacío en `GrillaCromos` cuando los filtros no arrojan resultados, con botón para quitar filtros (`textos.paginas.albumMundo.vacio` / `textos.estados.vacio`).
- **Error**: `EstadoError` con icono de alerta, mensaje por código desde `textos.errores[codigo]` (respaldo `textos.estados.error.texto`) y botón **Reintentar** (`textos.estados.error.botones.reintentar`).
- **Simulación de pruebas**: `api.js` lee los query params `?simularLatencia=2000` y `?simularError=503` y envía automáticamente las cabeceras `X-Simular-Latencia` y `X-Simular-Error`.

### `US-CRO-S2-03` — Iniciar sesión (Vista 4)
- Formulario responsive a pantalla completa en `/ingresar` (dos columnas en escritorio con abanico de 3 cromos; en móvil con abanico de 2 cromos) conectado a `POST /sesion`.
- Etiquetas visibles asociadas a cada campo (`<label htmlFor>`).
- Botón del ojo (`ojo` / `ojoTachado`) que muestra/oculta la contraseña anunciando su estado con `aria-pressed` y `aria-label`.
- Validación de campos obligatorios con mensaje junto a cada campo y foco automático en el primer campo con error.
- Ingreso exitoso (ej. `laura@cromoverso.test` / `cromos2026`) con redirección a `/` y enlaces a `/registro` y `/recuperar-clave`.

### `US-CRO-S2-04` — Estados de error y carga del formulario de ingreso
- **Envío en curso**: el botón cambia a **«Ingresando…»** con spinner, queda deshabilitado (`aria-busy="true"`) y previene envíos duplicados.
- **401 `credenciales_invalidas`**: aviso único sin revelar si falló el correo o la contraseña.
- **429 `demasiadas_peticiones`**: bloquea el formulario durante los segundos de la cabecera `Retry-After` mostrando una cuenta regresiva (con `aria-live="off"` para no saturar lectores de pantalla) y desbloquea automáticamente al llegar a `0`.
- **Sin conexión**: conserva lo escrito, muestra el error de conexión y ofrece botón **Reintentar**.

### `US-CRO-S2-05` — Mantener la sesión y cerrarla
- **Persistencia segura**: la sesión se mantiene tras recargar mediante la cookie `httpOnly` `sesion` gestionada por la API (`credentials: "include"`). **El token nunca se guarda en `localStorage`**.
- **Consulta de sesión**: `ProveedorSesion` consulta `GET /sesion` al cargar y al recuperar foco/visibilidad con sesión activa.
- **Navegación según sesión**:
  - Con sesión: avatar amarillo circular con iniciales en escritorio que abre `MenuCuenta`; en móvil, barra limpia (sin avatar) y tarjeta de usuario con su color de perfil + **Cerrar sesión** dentro del menú hamburguesa.
  - Sin sesión: botones **Ingresar** y **Crear cuenta**.
- **Cierre y expiración**: **Cerrar sesión** ejecuta `DELETE /sesion` y regresa a `/` como visitante; si la sesión vence (`401 no_autenticado`), redirige automáticamente a `/ingresar`.

---

## Accesibilidad, i18n y Tokens de Diseño

- **Accesibilidad**: panel de tamaño de texto (Normal, Grande, Muy grande), alto contraste (`.alto-contraste`), reducción de movimiento (`.reducir-movimiento`), subrayado de enlaces (`.subrayar-enlaces`), fuente de lectura fácil (`.fuente-lectura-facil`) y soporte completo de teclado y atributos ARIA.
- **Tokens**: uso exclusivo de variables definidas en `src/styles/tokens.css`.
- **Internacionalización y cookies**: textos en `es` y `en` cargados desde `GET /textos?idioma=...` mediante `useTextos`, respetando el consentimiento de cookies para persistir la preferencia de idioma.
