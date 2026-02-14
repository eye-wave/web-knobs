import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [vue()],
	build: {
		sourcemap: true,
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			fileName: 'index',
			formats: ['es']
		},
		rollupOptions: {
			external: ['vue', /@web-knobs\/.+/],
			output: {
				exports: 'named',
				globals: {
					vue: 'Vue'
				}
			}
		},
		emptyOutDir: false
	}
});
