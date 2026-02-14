import { defineConfig } from 'rolldown';
import UnpluginIsolatedDecl from 'unplugin-isolated-decl/rolldown';

export default defineConfig({
	input: ['src/index.ts', 'src/params.ts', 'src/helpers.ts', 'src/draggable.ts'],
	output: {
		format: 'es',
		sourcemap: true
	},
	plugins: [
		UnpluginIsolatedDecl({
			transformer: 'oxc',
			sourceMap: true
		})
	]
});
