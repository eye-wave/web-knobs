import type { ImportGroup, PropDefinition, WrapperConfig } from './model';

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const setter = (name: string) => `set${cap(name)}`;
export const handler = (name: string) => `on${cap(name)}Change`;
export const local = (p: PropDefinition) => p.alias ?? p.name;
export const vueName = (p: PropDefinition) => (p.bindable ? 'modelValue' : p.name);
export const allProps = (cfg: WrapperConfig): PropDefinition[] => cfg.propGroups.flat();

/** All *Reactive type names across import groups */
export function reactiveTypeNames(cfg: WrapperConfig): string[] {
	return cfg.importGroups.flatMap((g) =>
		g.imports.filter((i) => i.startsWith('type ') && i.includes('Reactive')).map((i) => i.slice(5))
	);
}

/** Render one import block for instance-script use (values + types together) */
export function renderImportBlock(group: ImportGroup): string {
	const items = group.imports;
	if (!items.length) return '';
	return `import {\n\t${items.join(',\n\t')}\n} from '${group.from}';`;
}

/** Render one import block with only type imports (for Svelte module block) */
export function renderTypeOnlyImportBlock(group: ImportGroup): string {
	const types = group.imports.filter((i) => i.startsWith('type '));
	if (!types.length) return '';
	return `import {\n\t${types.join(',\n\t')}\n} from '${group.from}';`;
}

/** Render one import block with only value imports (for Svelte instance block) */
export function renderValueOnlyImportBlock(group: ImportGroup, indent = '\t'): string {
	const values = group.imports.filter((i) => !i.startsWith('type '));
	if (!values.length) return '';
	return `${indent}import {\n${values.map((v) => `${indent}\t${v}`).join(',\n')}\n${indent}} from '${group.from}';`;
}

/** Value-only imports (no "type " prefix) as a JS import statement */
export function jsImportBlock(group: ImportGroup): string {
	const values = group.imports.filter((i) => !i.startsWith('type '));
	if (!values.length) return '';
	return `import { ${values.join(', ')} } from '${group.from}';`;
}

/** Type-only imports for .d.ts files, filtered to only types that are actually used.
 *  Pass `usedTypes` as a Set of type names; omit to include all type imports. */
export function dtsImportBlock(group: ImportGroup, usedTypes?: Set<string>): string {
	const types = group.imports
		.filter((i) => i.startsWith('type '))
		.map((i) => i.slice(5)) // "type Foo" → "Foo"
		.filter((t) => !usedTypes || usedTypes.has(t));
	if (!types.length) return '';
	return `import { type ${types.join(', type ')} } from '${group.from}';`;
}
