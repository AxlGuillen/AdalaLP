# AdalaLP - Contexto del Proyecto

## Descripción General
Sitio web profesional y bilingüe (ES/EN) para **ADALA** — Agencia Internacional de Migración, Certificación Laboral y Turismo Corporativo.

- **Framework:** Astro 5.0 (SSG estático)
- **Estilos:** Tailwind CSS 3.4.17
- **URL:** https://adala.mx
- **Idioma por defecto:** Español (`/es`)
- **Deploy:** Vercel (dashboard, conectando el repo)

## Stack
- **Astro 5** — SSG, rutas por archivo, View Transitions, MDX
- **Vue 3** — Sliders/carrusel (Swiper, client:only="vue")
- **React 19** — Componentes de formulario (client:load)
- **TypeScript** — Strict mode. Alias `~` → `src/`
- **Iconos:** Tabler Icons via `astro-icon` + `@iconify-json/tabler`

## Paleta de Colores
- **Primary:** `#009fe3` (cyan)
- **Secondary:** `#95c11f` (verde)
- **Accent:** `#194c6e` (azul oscuro) — también fondo de `Content.astro` y `Note.astro`
- Dark mode: class-based (`dark:`)

## Rutas
| Ruta | Descripción |
|------|-------------|
| `/` | Redirect a `/es` |
| `/es/` | Home en español |
| `/en/` | Home en inglés |
| `/es/privacy`, `/es/terms` | Legales (Markdown) |
| `/en/privacy`, `/en/terms` | Legales en inglés |

## Comandos
```bash
npm run dev       # Servidor local (localhost:4321)
npm run build     # Build estático → /dist
npm run preview   # Preview del build
npm run check     # TypeScript + ESLint + Prettier
npm run fix       # Auto-fix ESLint + Prettier
```

---

## Layouts disponibles

| Layout | Uso |
|--------|-----|
| `Layout.astro` | Raíz HTML (head, body, ClientRouter). Base de todo. |
| `PageLayout.astro` | Página estándar: incluye Header + Footer automáticamente |
| `LandingLayout.astro` | Header minimalista con botón de idioma |
| `MarkdownLayout.astro` | Para páginas `.md`: aplica prose, centra contenido |

---

## Widgets de página (`src/components/widgets/`)

Son las secciones de alto nivel que se componen para armar una página. Todos aceptan `id`, `isDark`, `bg`, `classes` (base `Widget`).

### Hero — Sección principal
| Componente | Descripción |
|-----------|-------------|
| `Hero.astro` | Texto centrado + imagen abajo. Overlap del header (-76px). |
| `Hero2.astro` | Split 50/50: texto izquierda, imagen derecha. Full screen en desktop. |
| `Hero3.astro` | Texto izquierda + slider Vue (SwiperHeaderSlider). Animación de texto (TextType). |
| `Hero4.astro` | Igual que Hero3 pero con SwiperHeaderSlider2 (rotación lateral). |
| `HeroText.astro` | Solo texto, sin imagen. Soporta 2 botones CTA. |

**Props comunes Hero:** `title`, `subtitle`, `tagline`, `content`, `actions` (array de CTAs o HTML), `image`

### Contenido y features
| Componente | Descripción |
|-----------|-------------|
| `Features.astro` | Grid de ítems con ícono redondo a la izquierda del texto. |
| `Features2.astro` | Cards con glass-morphism y ícono centrado. |
| `Features3.astro` | Imagen arriba + ítems abajo. |
| `Content.astro` | Split texto + imagen. `isReversed` invierte lados. Fondo azul oscuro. Acepta `items` como lista. |
| `Note.astro` | Banner callout. Fondo azul oscuro, ícono + título + descripción. |

### Pasos y procesos
| Componente | Descripción |
|-----------|-------------|
| `Steps.astro` | Timeline vertical + imagen opcional al lado. |
| `Steps2.astro` | Círculos numerados grandes (fondo azul oscuro) + texto. |
| `Steps3.astro` | Timeline izquierda + slider vertical (SwiperHeaderSlider3) derecha. |

### Otros widgets
| Componente | Descripción |
|-----------|-------------|
| `Header.astro` | Navegación: logo, links (con submenú), acciones, toggle de tema/idioma. |
| `Footer.astro` | Footer: social links, links secundarios, footnote. |
| `CallToAction.astro` | Banner CTA centrado con sombra. Animación wave en el título. |
| `FAQs.astro` | Acordeón de preguntas. Usa ItemGrid internamente. |
| `Testimonials.astro` | Grid de testimonios en tarjetas (3 columnas). |
| `Pricing.astro` | Tabla de precios con ribbon "Popular". 3 columnas. |
| `Stats.astro` | Métricas clave. 4 columnas. Ícono + número + título. |
| `Brands.astro` | Logos de marcas en flex wrap. |
| `Contact.astro` | Sección con formulario (Form.astro interno). |
| `BlogLatestPosts.astro` | Últimos N posts del blog (solo si blog habilitado). |
| `BlogHighlightedPosts.astro` | Posts específicos por IDs. |

---

## Componentes UI primitivos (`src/components/ui/`)

Componentes de bajo nivel. Los `.tsx` son React, los `.astro` son Astro.

| Componente | Tipo | Descripción |
|-----------|------|-------------|
| `Button.astro` | Astro | Variantes: primary, secondary, tertiary, link. |
| `button.tsx` | React (CVA) | Variantes: default, destructive, outline, secondary, ghost, link. |
| `card.tsx` | React | Card + CardHeader + CardTitle + CardContent + CardFooter. |
| `input.tsx` | React | Input estándar con dark mode y focus ring. |
| `label.tsx` | React | Label accesible (Radix UI). |
| `select.tsx` | React | Select completo con portal, animaciones, íconos (Radix UI). |
| `Form.astro` | Astro | Form genérico del template: inputs, textarea, disclaimer, button. |
| `Headline.astro` | Astro | Tagline + título + subtítulo con clases personalizables. |
| `ItemGrid.astro` | Astro | Grid de ítems con ícono, título, descripción, CTA. |
| `ItemGrid2.astro` | Astro | Variante alternativa de ItemGrid. |
| `Timeline.astro` | Astro | Línea vertical de pasos. |
| `WidgetWrapper.astro` | Astro | Wrapper común para widgets: padding, max-width, fondo. |

---

## Componentes Vue personalizados (`src/components/custom/`)

Se usan con `client:only="vue"`.

| Componente | Descripción |
|-----------|-------------|
| `SwiperHeaderSlider.vue` | Carrusel con efecto flip 180°. Autoplay 3s. Imágenes 1-5. |
| `SwiperHeaderSlider2.vue` | Carrusel con rotación lateral 90°. Imágenes 6-10. |
| `SwiperHeaderSlider3.vue` | Carrusel vertical. Push effect. Oculto en mobile. Imágenes Vertical1-5. |
| `TextType.vue` | Efecto de escritura animada. Acepta `string` o `string[]`. |

---

## Patrones clave del template

### Interface Widget (base de todos los widgets)
```ts
interface Widget {
  id?: string;
  isDark?: boolean;   // Fondo oscuro
  bg?: string;        // HTML/componente de fondo personalizado (slot)
  classes?: Record<string, string>;
}
```

### Prop `classes` para personalización granular
```astro
<!-- Ejemplo en Features -->
classes={{ container: 'max-w-5xl', title: 'text-primary', icon: 'text-secondary' }}
```

### Prop `actions` — dos formas válidas
```astro
actions={[{ variant: 'primary', text: 'Contáctanos', href: '/contacto' }]}
actions="<a href='/...' class='btn'>Ver más</a>"  <!-- Raw HTML -->
```

### Sistema de animaciones (Intersection Observer)
Clases de Tailwind que activan animaciones al hacer scroll:
```
motion-safe:md:intersect:animate-fade
motion-safe:md:intersect:animate-fade-left
motion-safe:md:intersect:animate-fade-right
motion-safe:md:intersect:animate-wave
intersect-once       → anima solo la primera vez
intersect-quarter    → dispara al 25% visible
intersect-half       → dispara al 50%
```

### Detección de idioma en componentes
```astro
const pathname = new URL(Astro.url).pathname;
const lang = pathname.startsWith('/es') ? 'es' : 'en';
```

### Slot-based content (alternativa a props)
```astro
const { title = await Astro.slots.render('title') } = Astro.props;
```

### Sticky header
`BasicScripts.astro` agrega clase `scroll` al header cuando `scrollY > 60px`.

---

## Configuración global (`src/config.yaml`)
- Nombre del sitio, URL, idioma
- Blog: 6 posts/página, categorías, tags, posts relacionados
- Google Analytics: null (deshabilitado)
- Tema UI: light

## Blog
Habilitado pero sin contenido. Posts en `src/data/post/*.{md,mdx}`.
Campo requerido: `lang: 'en' | 'es'`.

## Base del Template
Derivado de **AstroWind** (open source). La integración personalizada en `vendor/integration/` carga `src/config.yaml` como módulo virtual de Astro y actualiza `robots.txt` con el sitemap.
