import { writeFile, mkdir } from 'node:fs/promises';
import * as P from 'node:path';
import configs from './configs';
import generate, { generateIndexes } from './templates';

const outDir = P.resolve(import.meta.dirname, '../dist');
await mkdir(outDir, { recursive: true });

const files: [string, string][] = [...configs.flatMap(generate), ...generateIndexes(configs)];

for (const [filename, content] of files) {
	const path = P.resolve(outDir, filename);
	const base = P.dirname(path);

	await mkdir(base, { recursive: true });
	await writeFile(path, content);

	const rel = P.relative(import.meta.dirname, path);
	console.log(`Generated ${rel}`);
}
