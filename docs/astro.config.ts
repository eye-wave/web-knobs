import { defineConfig } from 'astro/config';

const prod = (process.env.NODE_ENV = 'production');

// https://astro.build/config
export default defineConfig({
	base: prod ? '/web-knobs' : undefined
});
