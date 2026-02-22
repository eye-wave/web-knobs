import { defineConfig } from 'astro/config';
import { vitePreprocess } from '@astrojs/svelte';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';

const prod = process.env.NODE_ENV === 'production';

// https://astro.build/config
export default defineConfig({
	base: prod ? '/web-knobs' : undefined,
	integrations: [
		react(),
		svelte({
			preprocess: vitePreprocess()
		})
	]
});
