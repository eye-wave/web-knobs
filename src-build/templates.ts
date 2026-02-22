import type { WrapperConfig } from './model';
import * as react from './templates/react';
import * as svelte from './templates/svelte';
import * as vue from './templates/vue';

type TemplateGenerator = {
	generateJs: (cfg: WrapperConfig) => string;
	generateDts: (cfg: WrapperConfig) => string;
};

function generateLocal(
	cfg: WrapperConfig,
	gen: TemplateGenerator,
	prefix: string,
	ext?: string
): [[string, string], [string, string]] {
	const fileExt = ext ? ext : prefix;
	return [
		[`${prefix}/${cfg.componentName}.${fileExt}`, gen.generateJs(cfg)],
		[`${prefix}/${cfg.componentName}.d.ts`, gen.generateDts(cfg)]
	];
}

type FrameworkMeta = {
	prefix: string;
	ext: string;
	exportsPropsType: boolean;
};

const FRAMEWORKS: FrameworkMeta[] = [
	{ prefix: 'svelte', ext: 'svelte', exportsPropsType: true },
	{ prefix: 'vue', ext: 'vue', exportsPropsType: false },
	{ prefix: 'react', ext: 'tsx', exportsPropsType: false }
];

function buildIndex(cfgs: WrapperConfig[], fw: FrameworkMeta): [string, string][] {
	const { prefix, ext, exportsPropsType } = fw;

	const jsLines = cfgs
		.map(
			(cfg) => `export { default as ${cfg.componentName} } from './${cfg.componentName}.${ext}';`
		)
		.join('\n');

	const dtsLines = cfgs
		.flatMap((cfg) => {
			const lines = [
				`export { default as ${cfg.componentName} } from './${cfg.componentName}.${ext}';`
			];
			if (exportsPropsType) {
				lines.push(
					`export type { ${cfg.componentName}Props } from './${cfg.componentName}.${ext}';`
				);
			}
			return lines;
		})
		.join('\n');

	return [
		[`${prefix}/index.js`, jsLines + '\n'],
		[`${prefix}/index.d.ts`, dtsLines + '\n']
	];
}

export default function generate(cfg: WrapperConfig): [string, string][] {
	return [
		...generateLocal(cfg, svelte, 'svelte'),
		...generateLocal(cfg, vue, 'vue'),
		...generateLocal(cfg, react, 'react', 'tsx')
	];
}

export function generateIndexes(cfgs: WrapperConfig[]): [string, string][] {
	return FRAMEWORKS.flatMap((fw) => buildIndex(cfgs, fw));
}
