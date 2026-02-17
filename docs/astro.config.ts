import svelte, { vitePreprocess } from '@astrojs/svelte';
import { defineConfig } from 'astro/config';

const prod = (process.env.NODE_ENV = 'production');

// https://astro.build/config
export default defineConfig({
	base: prod ? 'https://eye-wave.github.io/web-knobs/' : undefined,
	integrations: [
		svelte({
			preprocess: vitePreprocess()
		})
	]
});
