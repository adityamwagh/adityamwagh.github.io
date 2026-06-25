import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  site: "https://adityamwagh.me",
  // Astro 7 changed compressHTML's default to 'jsx', which strips whitespace
  // between inline elements across source newlines — collapsed the space before
  // inline <a> links (e.g. "founded by<a>"). `true` keeps the old behaviour.
  compressHTML: true,
  // Cloudflare Pages serves directory URLs and 308-redirects non-slash paths.
  // Match that so internal links never hit a redirect (which breaks ClientRouter
  // script execution on client-side navigation).
  trailingSlash: "always",
  integrations: [mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  markdown: {
    // Astro 6.4+: remark/rehype plugins go through `processor`; shikiConfig stays top-level.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark-default" },
      wrap: true,
    },
  },
});
