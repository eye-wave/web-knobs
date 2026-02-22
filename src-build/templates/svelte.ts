import {
	allProps,
	cap,
	dtsImportBlock,
	handler,
	jsImportBlock,
	local,
	reactiveTypeNames,
	setter
} from '../helpers';
import type { WrapperConfig } from '../model';

export function generateJs(cfg: WrapperConfig): string {
	const { factoryFn, importGroups, propGroups, hostElement = 'div', hasSlot = false } = cfg;

	const instanceImportLines = importGroups
		.map((g) => jsImportBlock(g))
		.filter(Boolean)
		.join('\n\t');

	const propDestructLines = propGroups
		.map((g) =>
			g
				.map((p) => {
					const lname = local(p);
					if (p.kind === 'default' && p.bindable) return `\t\t${lname} = $bindable(${p.value})`;
					if (p.kind === 'default' && p.alias) return `\t\t${p.name}: ${lname} = ${p.value}`;
					if (p.kind === 'default') return `\t\t${p.name} = ${p.value}`;
					return `\t\t${p.name}`;
				})
				.join(',\n')
		)
		.join(',\n\n');

	const childrenLine = hasSlot ? `\t\tchildren,\n` : '';

	const factoryPropLines = propGroups
		.map((g) => g.map((p) => `\t\t\t\t${p.name}: ${local(p)}`).join(',\n'))
		.join(',\n');

	const factoryCbLines = propGroups
		.map((g) => g.map((p) => `\t\t\t\t${handler(p.name)}: (v) => (${local(p)} = v)`).join(',\n'))
		.join(',\n');

	const effectBlocks = propGroups
		.map((g) =>
			g
				.map((p) => {
					const lname = local(p);
					return `\t\t$effect(() => engine?.${setter(p.name)}(${lname}));`;
				})
				.join('\n')
		)
		.join('\n\n');

	const templateEl = hasSlot
		? `<${hostElement} bind:this={ref} {...${hostElement}Props}>{@render children?.()}</${hostElement}>`
		: `<${hostElement} bind:this={ref} {...${hostElement}Props} />`;

	return `<script>
\t${instanceImportLines}
\timport { onDestroy, onMount } from 'svelte';

\tlet {
${childrenLine}${propDestructLines},
\t\t...${hostElement}Props
\t} = $props();

\tlet ref    = $state();
\tlet engine = $state(null);

\tonDestroy(() => engine?.destroy());
\tonMount(() => {
\t\tif (ref)
\t\t\tengine = ${factoryFn}(ref, {
${factoryPropLines},
${factoryCbLines}
\t\t\t});

${effectBlocks}
\t});
</script>

${templateEl}
`;
}

export function generateDts(cfg: WrapperConfig): string {
	const { componentName, importGroups, hostElement = 'div' } = cfg;
	const hostType = `HTML${cap(hostElement)}Element`;

	const usedTypes = new Set(reactiveTypeNames(cfg));
	const importLines = importGroups
		.map((g) => dtsImportBlock(g, usedTypes))
		.filter(Boolean)
		.join('\n');
	const svelteImport = `import type { HTMLAttributes } from 'svelte/elements';`;
	const svelteComponentImport = `import type { Component } from 'svelte';`;

	const reactiveTypes = reactiveTypeNames(cfg);
	const propsTypeExpr = [...reactiveTypes, `HTMLAttributes<${hostType}>`].join(' & ');
	const propsTypeName = `${componentName}Props`;

	const bindableProp = allProps(cfg).find((p) => p.bindable);
	const bindableArg = bindableProp ? `"${bindableProp.name}"` : 'never';

	return `${importLines}
${svelteImport}
${svelteComponentImport}

export type ${propsTypeName} = ${propsTypeExpr};

declare const ${componentName}: Component<${propsTypeName}, {}, ${bindableArg}>;
type ${componentName} = ReturnType<typeof ${componentName}>;
export default ${componentName};
`;
}
