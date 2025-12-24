import dts from 'bun-plugin-dts';
import { readdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });

const entrypoints = (await readdir('src', 'utf8'))
	.filter((m) => m.endsWith('.ts'))
	.map((m) => './src/' + m);

await Bun.build({
	entrypoints,
	format: 'esm',
	packages: 'external',
	splitting: true,
	target: 'browser',
	outdir: './dist',
	plugins: [dts()]
});
