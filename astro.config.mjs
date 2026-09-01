import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://invitacion-dino.netlify.app',
  devToolbar: {
    enabled: false,
  },
  integrations: [
    react(),
    tailwind(),
  ],
  output: 'static',
});
