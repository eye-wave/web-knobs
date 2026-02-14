import { defineConfig } from 'rolldown';
import UnpluginIsolatedDecl from 'unplugin-isolated-decl/rolldown';

export default defineConfig({
	input: ['src/index.ts'],
	external: (id) => id.startsWith('react') || id.startsWith('@web-knobs'),
	output: {
		format: 'es',
		sourcemap: true,
		preserveModules: true
	},
	plugins: [
		UnpluginIsolatedDecl({
			transformer: 'oxc',
			sourceMap: true
		})
	]
});
