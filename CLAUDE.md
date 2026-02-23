# AdalaLP - Contexto del Proyecto

## Descripción General
Sitio web profesional y bilingüe (ES/EN) para **ADALA** (Agencia Internacional de Certificación Laboral, Migración y Turismo Corporativo).

- **Framework:** Astro 5.0 (generación estática)
- **Estilos:** Tailwind CSS 3.4.17
- **URL del sitio:** https://adala.mx
- **Idioma por defecto:** Español (`/es`)
- **Deployment:** Netlify / Vercel / Docker + Nginx

## Tecnologías Clave
- **Astro 5** — SSG, rutas por archivo, View Transitions, MDX
- **Vue 3** — Componentes de slider/carrusel (Swiper)
- **React 19** — Formulario de postulación de empleo
- **TypeScript** — Strict mode activado

## Estructura de Directorios
```
src/
├── assets/images/slider/    # Imágenes del carrusel (5 archivos .webp)
├── assets/styles/tailwind.css  # Tailwind + custom CSS variables
├── components/
│   ├── custom/              # Componentes Vue (SwiperSlider, TextType)
│   ├── widgets/             # Secciones de página (Hero3, Features, Footer, etc.)
│   ├── ui/                  # Primitivos UI (Button, Form, Input, etc.)
│   └── common/              # Utilidades (Meta, Analytics, ThemeToggle)
├── layouts/
│   ├── Layout.astro         # Raíz HTML (head + body + ClientRouter)
│   ├── PageLayout.astro     # Wrapper con metadata
│   └── MarkdownLayout.astro # Para páginas .md
├── pages/
│   ├── index.astro          # Redirige a /es
│   ├── en/                  # Páginas en inglés
│   └── es/                  # Páginas en español (incluye /es/form)
├── navigation.ts            # Links de header y footer
├── config.yaml              # Configuración global del sitio
└── types.d.ts               # TypeScript types
vendor/integration/          # Integración Astro personalizada (carga config.yaml)
```

## Rutas del Sitio
| Ruta | Descripción |
|------|-------------|
| `/` | Redirect a `/es` |
| `/es/` | Home en español |
| `/en/` | Home en inglés |
| `/es/privacy`, `/es/terms` | Legales (Markdown) |
| `/en/privacy`, `/en/terms` | Legales en inglés (Markdown) |

## Paleta de Colores (Tailwind config)
- **Primary:** `#009fe3` (cyan)
- **Secondary:** `#95c11f` (verde)
- **Accent:** `#194c6e` (azul oscuro)
- Dark mode: class-based (`dark:`)

## Comandos Principales
```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build estático (output en /dist)
npm run preview   # Preview del build
npm run check     # TypeScript + ESLint + Prettier
npm run fix       # Auto-fix ESLint + Prettier
```

## Convenciones Importantes
- **i18n por rutas:** `/es/` y `/en/` — sin librería i18n, solo rutas
- **Animaciones:** Intersection Observer + `intersect:` class, respetar `motion-safe:`
- **Hidratación Astro:** `client:only="vue"` para Vue, `client:load` para React
- **Alias de imports:** `~` apunta a `./src`
- **Iconos:** Tabler Icons via `astro-icon` (`@iconify-json/tabler`)
- **Alias de path TypeScript:** `~/*` → `src/*`

## Widgets principales de página (en `/components/widgets/`)
- `Hero3.astro` — Hero con slider de imágenes (Vue SwiperHeaderSlider)
- `Features.astro` — Grid de características con íconos
- `Content.astro` — Texto + imagen (layout invertible)
- `Steps3.astro` — Timeline/pasos con slider
- `FAQs.astro` — Acordeón de preguntas frecuentes
- `CallToAction.astro` — Sección CTA con botones
- `Header.astro` / `Footer.astro` — Navegación global
- `Form.tsx` (React) — Formulario de postulación de empleo

## Base del Template
El proyecto deriva del template open-source **AstroWind**. La integración personalizada está en `vendor/integration/` y carga `src/config.yaml` como módulo virtual de Astro.

## Blog
Habilitado en config pero sin contenido. Los posts van en `src/data/post/*.{md,mdx}` con campo `lang: 'en' | 'es'`.
