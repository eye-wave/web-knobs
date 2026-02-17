import { statSync, cpSync } from 'node:fs';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { spawn } from 'node:child_process';

const root = path.resolve(import.meta.dirname);
const destinationRoot = path.join(root, 'dist');

if (await fs.exists(destinationRoot))
	await fs.rm(destinationRoot, { force: true, recursive: true });

await fs.mkdir(destinationRoot);

const packages = (await fs.readdir(path.join(root, '..'), 'utf8'))
	.filter((e) => !e.includes('web-knobs'))
	.filter((e) => statSync(path.join(root, '..', e)).isDirectory());

console.log('Found packages:', packages.join(', '), '\n');

async function buildPackage(name: string) {
	const packagePath = path.join(root, '..', name);
	console.log('Building', name, '...');

	return new Promise<void>((resolve, reject) => {
		const proc = spawn('bun', ['run', 'build'], { cwd: packagePath, stdio: 'inherit' });

		proc.on('error', reject);
		proc.on('close', (code) => {
			if (code === 0) {
				const source = path.join(packagePath, 'dist');
				const dest = path.join(destinationRoot, name);

				cpSync(source, dest, { recursive: true });
				console.log('Copied', name);

				resolve();
			} else reject(new Error(`build failed with ${code}`));
		});
	});
}

await Promise.all(packages.map(buildPackage));

const files = (
	await fs.readdir(destinationRoot, {
		recursive: true,
		withFileTypes: true
	})
)
	.filter((e) => e.isFile())
	.map((e) => path.join(e.parentPath, e.name))
	.filter((p) => !p.endsWith('.map') && !p.includes(path.sep + 'core' + path.sep));

const FIND_IMPORTS = /import.*?from (?:"|')([^"']+)/gs;

const corePath = path.join(destinationRoot, 'core');

for (const file of files) {
	const content = await fs.readFile(file, 'utf8');
	const newContent = content.replaceAll(FIND_IMPORTS, (match, importSource: string) => {
		if (!importSource.startsWith('@web-knobs')) return match;

		const targetFilePath = path.join(corePath, importSource.replace('@web-knobs/core/', ''));
		const relative = path.relative(path.dirname(file), targetFilePath);
		const normalized = relative.startsWith('.') ? relative : `./${relative}`;

		const importTarget = normalized + (file.endsWith('d.ts') ? '' : '.js');

		return match.replace(importSource, importTarget);
	});

	await fs.writeFile(file, newContent);

	const trimmed = path.relative(root, file);
	console.log('Succesfully saved', trimmed);
}
