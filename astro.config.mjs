import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkMermaid } from './src/plugins/remark-mermaid.mjs';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';

export default defineConfig({
  site: 'https://saidibnerradi603.github.io',
  integrations: [
    expressiveCode({
      themes: ['rose-pine', 'github-light'],
      themeCssSelector: (theme) =>
        theme.name === 'rose-pine' ? '[data-theme="dark"]' : '[data-theme="light"]',
      styleOverrides: {
        borderRadius: '0.75rem',
        borderWidth: '1px',
        codeFontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
        codeFontSize: '0.875rem',
        codeLineHeight: '1.65',
        frames: {
          frameBoxShadowCssValue: 'none',
        },
      },
    }),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [remarkMermaid, remarkReadingTime, remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
