import {
	allProps,
	cap,
	dtsImportBlock,
	handler,
	jsImportBlock,
	reactiveTypeNames,
	setter
} from '../helpers';
import type { WrapperConfig } from '../model';

export function generateJs(cfg: WrapperConfig): string {
	const { factoryFn, importGroups, propGroups, hostElement = 'div', hasSlot = false } = cfg;
	const props = allProps(cfg);

	const importLines = importGroups.map(jsImportBlock).filter(Boolean).join('\n');
	const reactImport = `import { useEffect, useRef } from 'react';`;

	const propDestructure = props
		.map((p) => (p.kind === 'default' ? `${p.name} = ${p.value}` : p.name))
		.join(', ');

	const cbDestructure = props.map((p) => handler(p.name)).join(', ');

	const cbAssign = props.map((p) => `\t\t\t${handler(p.name)}`).join(',\n');
	const cbDeps = props.map((p) => `\t\t${handler(p.name)}`).join(',\n');

	const factoryProps = propGroups
		.map((g) => g.map((p) => `\t\t\t${p.name}`).join(',\n'))
		.join(',\n');

	const factoryCbs = propGroups
		.map((g) =>
			g.map((p) => `\t\t\t${handler(p.name)}: callbacksRef.current?.${handler(p.name)}`).join(',\n')
		)
		.join(',\n');

	const syncEffects = propGroups
		.map((g) =>
			g
				.map(
					(p) => `\tuseEffect(() => engineRef.current?.${setter(p.name)}(${p.name}), [${p.name}]);`
				)
				.join('\n')
		)
		.join('\n\n');

	const childrenArg = hasSlot ? 'children, ' : '';
	const jsx = hasSlot
		? `<${hostElement} ref={containerRef} {...${hostElement}Props}>{children}</${hostElement}>`
		: `<${hostElement} ref={containerRef} {...${hostElement}Props} />`;

	return `${importLines}
${reactImport}

export default function ${cfg.componentName}({
\t${childrenArg}${propDestructure},
\t${cbDestructure},
\t...${hostElement}Props
}) {
\tconst containerRef = useRef(null);
\tconst engineRef    = useRef(null);
\tconst callbacksRef = useRef(null);

\tuseEffect(() => {
\t\tcallbacksRef.current = {
${cbAssign}
\t\t};
\t}, [
${cbDeps}
\t]);

\tuseEffect(() => {
\t\tif (!containerRef.current) return;
\t\tif (engineRef.current) {
\t\t\tengineRef.current.destroy();
\t\t\tengineRef.current = null;
\t\t}
\t\tcontainerRef.current.innerHTML = '';

\t\tengineRef.current = ${factoryFn}(containerRef.current, {
${factoryProps},
${factoryCbs}
\t\t});

\t\treturn () => {
\t\t\tengineRef.current?.destroy();
\t\t\tengineRef.current = null;
\t\t};
\t}, []);

${syncEffects}

\treturn ${jsx};
}
`;
}

export function generateDts(cfg: WrapperConfig): string {
	const { componentName, importGroups, optionsType, hostElement = 'div', hasSlot = false } = cfg;
	const hostType = `HTML${cap(hostElement)}Element`;

	const usedTypes = new Set([optionsType, ...reactiveTypeNames(cfg)]);
	const importLines = importGroups
		.map((g) => dtsImportBlock(g, usedTypes))
		.filter(Boolean)
		.join('\n');
	const reactImport = `import { type ReactElement${hasSlot ? ', type ReactNode' : ''} } from 'react';`;

	const reactiveTypes = reactiveTypeNames(cfg);
	const propsType = [optionsType, ...reactiveTypes, `React.HTMLAttributes<${hostType}>`].join(
		' & '
	);

	const propNames = allProps(cfg)
		.map((p) => p.name)
		.join(', ');
	const cbNames = allProps(cfg)
		.map((p) => handler(p.name))
		.join(', ');

	return `${importLines}
${reactImport}

type Props = ${propsType};

export default function ${componentName}({ ${hasSlot ? 'children, ' : ''}${propNames}, ${cbNames}, ...${hostElement}Props }: Props): ReactElement;
`;
}
