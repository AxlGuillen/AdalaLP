# AdalaLP

Official website for **ADALA** — International Agency for Migration, Labor Certification, and Corporate Tourism.

**URL:** [adala.mx](https://adala.mx)

## Stack

- [Astro 5](https://astro.build) — static site generation (SSG)
- [Tailwind CSS](https://tailwindcss.com) — styling
- [Vue 3](https://vuejs.org) — interactive components (sliders)
- [React 19](https://react.dev) — form components
- TypeScript

## Requirements

- Node.js `>=18.17.1`
- npm

## Development

```bash
npm install
npm run dev
```

The site runs at `http://localhost:4321`.

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Static build (output in `/dist`) |
| `npm run preview` | Preview the build |
| `npm run check` | TypeScript + ESLint + Prettier |
| `npm run fix` | Auto-fix ESLint + Prettier |

## Project structure

```
src/
├── assets/
│   ├── images/slider/   # Hero carousel images
│   └── styles/          # Tailwind + CSS variables
├── components/
│   ├── common/          # Meta, analytics, theme toggle
│   ├── custom/          # Vue components (Swiper, TextType)
│   ├── ui/              # UI primitives (Button, Input, etc.)
│   └── widgets/         # Page sections (Hero, Features, Footer…)
├── layouts/             # Base layout, PageLayout, MarkdownLayout
├── pages/
│   ├── index.astro      # Redirects to /es
│   ├── en/              # English pages
│   └── es/              # Spanish pages
├── config.yaml          # Global site configuration
└── navigation.ts        # Header and footer links
```

## Internationalization

The site is bilingual. Language is determined by the route:

| Route | Language |
|---|---|
| `/es/` | Spanish (default) |
| `/en/` | English |

No i18n library is used — language is handled through file-based routing.

## Deploy

Deployed on **Vercel** by connecting the repository from the dashboard. Vercel auto-detects Astro and runs `npm run build`.

The `vercel.json` file configures:
- Clean URLs (`cleanUrls: true`)
- No trailing slash
- One-year cache for Astro assets (`/_astro/*`)
