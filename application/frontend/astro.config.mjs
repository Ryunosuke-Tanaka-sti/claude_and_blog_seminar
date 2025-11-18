import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: 'https://ryunosuke-tanaka-sti.github.io',
  base: '/claude_and_blog_seminar',
});
