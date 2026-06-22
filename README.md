# adityamwagh.me

Personal site of Aditya Wagh, built with [Astro](https://astro.build) and Tailwind CSS.

## Stack

- **Astro 5** (static output)
- **Tailwind v4** via the Vite plugin
- **MDX** blog as an Astro content collection
- Build-time math (`remark-math` + `rehype-katex`) and code highlighting (Shiki, dual everforest theme)
- **Pagefind** search (postbuild)
- Body serif: self-hosted ET Bembo · mono: Iosevka

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # astro build + pagefind index → dist/
npm run preview  # preview the production build
```

## Deploy

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds the
site and publishes `dist/` to GitHub Pages. The custom domain `adityamwagh.me`
is set via `public/CNAME`.

## Structure

- `src/pages/` — routes (home, work, blog, 404, RSS)
- `src/layouts/Base.astro` — shared `<head>`, nav, footer, theme + view transitions
- `src/components/` — Nav, ThemeMenu, SearchOverlay, ProfileCard, ProjectCard, etc.
- `src/content/blog/` — blog posts (Markdown)
- `public/` — static assets (fonts, images, icons, CNAME)
