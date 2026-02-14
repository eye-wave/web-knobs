import { defineConfig } from 'rolldown';
import UnpluginIsolatedDecl from 'unplugin-isolated-decl/rolldown';

export default defineConfig({
	input: [
		'src/index.ts',
		'src/components/image-knob.ts',
		'src/components/svg-knob.ts',
		'src/params.ts',
		'src/helpers.ts',
		'src/draggable.ts'
	],
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
