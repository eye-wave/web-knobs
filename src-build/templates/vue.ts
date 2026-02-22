import {
	allProps,
	dtsImportBlock,
	handler,
	jsImportBlock,
	reactiveTypeNames,
	setter,
	vueName
} from '../helpers';
import type { DefaultProp, PropDefinition, WrapperConfig } from '../model';

export function generateJs(cfg: WrapperConfig): string {
	const { factoryFn, importGroups, propGroups, hostElement = 'div', hasSlot = false } = cfg;
	const props = allProps(cfg);

	const importLines = importGroups.map(jsImportBlock).filter(Boolean).join('\n');
	const vueImport = `import { ref, watch, onMounted, onUnmounted, defineComponent, h } from 'vue';`;

	const propsObj = props
		.map((p) => {
			if (p.bindable) {
				const defVal = p.kind === 'default' ? p.value : 'undefined';
				return `\t\tmodelValue: { default: ${defVal} }`;
			}
			if (p.kind === 'default') return `\t\t${p.name}: { default: ${p.value} }`;
			return `\t\t${p.name}: {}`;
		})
		.join(',\n');

	const emitsList = props.map((p) => `'update:${vueName(p)}'`).join(', ');

	const factoryProps = propGroups
		.map((g) =>
			g
				.map((p) => {
					const read = p.bindable ? `props.modelValue` : `props.${p.name}`;
					return `\t\t\t${p.name}: ${read}`;
				})
				.join(',\n')
		)
		.join(',\n');

	const factoryCbs = propGroups
		.map((g) =>
			g.map((p) => `\t\t\t${handler(p.name)}: (v) => emit('update:${vueName(p)}', v)`).join(',\n')
		)
		.join(',\n');

	const watcherBlocks = propGroups
		.map((g) =>
			g
				.map((p) => {
					const read = p.bindable ? `props.modelValue` : `props.${p.name}`;
					const call = `(v) => engine.value?.${setter(p.name)}?.(v)`;
					return `\t\twatch(() => ${read}, ${call});`;
				})
				.join('\n')
		)
		.join('\n\n');

	const slotRender = hasSlot ? `slots.default?.()` : '';
	const renderEl = hasSlot
		? `h('${hostElement}', { ref: elRef }, ${slotRender})`
		: `h('${hostElement}', { ref: elRef })`;

	return `${importLines}
${vueImport}

export default defineComponent({
\tprops: {
${propsObj}
\t},
\temits: [${emitsList}],
\tsetup(props, { emit, slots }) {
\t\tconst elRef  = ref(null);
\t\tconst engine = ref(null);

\t\tonMounted(() => {
\t\t\tif (elRef.value) {
\t\t\t\tengine.value = ${factoryFn}(elRef.value, {
${factoryProps},
${factoryCbs}
\t\t\t\t});
\t\t\t}
\t\t});

\t\tonUnmounted(() => {
\t\t\tengine.value?.destroy();
\t\t});

${watcherBlocks}

\t\treturn () => ${renderEl};
\t}
});
`;
}

export function generateDts(cfg: WrapperConfig): string {
	const { componentName, importGroups, hasSlot = false } = cfg;
	const props = allProps(cfg);

	const usedTypes = new Set(reactiveTypeNames(cfg));
	const importLines = importGroups
		.map((g) => dtsImportBlock(g, usedTypes))
		.filter(Boolean)
		.join('\n');
	const vueImport = `import { type DefineComponent, type PublicProps, type ComponentProvideOptions } from 'vue';`;

	const reactiveTypes = reactiveTypeNames(cfg);
	const extendsClause = reactiveTypes.join(', ');

	const bindableProp = props.find((p) => p.bindable);
	const interfaceExtra = bindableProp ? `    modelValue?: ${bindableProp.type};` : '';

	const emitsShape = props
		.map((p) => `    "update:${vueName(p)}": (value: ${p.type}) => any;`)
		.join('\n');

	const onUpdateShape = props
		.map((p) => `    "onUpdate:${vueName(p)}"?: ((value: ${p.type}) => any) | undefined;`)
		.join('\n');

	const defaultsShape = props
		.filter((p): p is PropDefinition & DefaultProp => p.kind === 'default')
		.map((p) => `    ${vueName(p)}: ${p.type};`)
		.join('\n');

	const slotType = hasSlot
		? `type __VLS_Slots = { default?: (props: typeof __VLS_1) => any; };`
		: `type __VLS_Slots = {};`;

	return `${importLines}
${vueImport}

interface ${componentName}Props extends ${extendsClause} {
${interfaceExtra}
}

declare var __VLS_1: {};
${slotType}

declare const __VLS_base: DefineComponent<
    ${componentName}Props,
    {},
    {},
    {},
    {},
    import('vue').ComponentOptionsMixin,
    import('vue').ComponentOptionsMixin,
    {
${emitsShape}
    },
    string,
    PublicProps,
    Readonly<${componentName}Props> & Readonly<{
${onUpdateShape}
    }>,
    {
${defaultsShape}
    },
    {},
    {},
    string,
    ComponentProvideOptions,
    false,
    {},
    any
>;

declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;

type __VLS_WithSlots<T, S> = T & { new (): { $slots: S } };
`;
}
