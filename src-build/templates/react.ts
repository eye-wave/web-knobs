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
	const { componentName, factoryFn, importGroups, hostElement = 'div' } = cfg;

	const props = allProps(cfg);

	const importLines = importGroups.map(jsImportBlock).filter(Boolean).join('\n');
	const reactImport = `import { useEffect, useRef } from 'react';`;

	const propDestructure = props
		.map((p) => (p.kind === 'default' ? `${p.name} = ${p.value}` : p.name))
		.join(',\n\t');

	const cbNames = props.map((p) => handler(p.name));
	const cbDestructure = cbNames.join(',\n\t');
	const cbAssignObject = cbNames.map((n) => `\t\t\t${n}`).join(',\n');
	const cbDeps = cbNames.join(',\n\t\t');
	const factoryPropLines = props.map((p) => `\t\t\t${p.name}`).join(',\n');

	const factoryCbLines = props
		.map((p) => `\t\t\t${handler(p.name)}: callbacksRef.current?.${handler(p.name)}`)
		.join(',\n');

	const setterEffects = props
		.map(
			(p) => `useEffect(() => { engineRef.current?.${setter(p.name)}(${p.name}); },[${p.name}]);`
		)
		.join('\n\t');

	return `${importLines}
${reactImport}

export default function ${componentName}({
\t${propDestructure},

\t${cbDestructure},

\t...${hostElement}Props
}) {
\tconst containerRef = useRef(null);
\tconst engineRef = useRef(null);
\tconst callbacksRef = useRef(null);

\tuseEffect(() => {
\t\tcallbacksRef.current = {
${cbAssignObject}
\t\t};
\t}, [
\t\t${cbDeps}
\t]);

\tuseEffect(() => {
\t\tif (!containerRef.current) return;

\t\tif (engineRef.current) {
\t\t\tengineRef.current?.destroy();
\t\t\tengineRef.current = null;
\t\t}

\t\tcontainerRef.current.innerHTML = '';

\t\tengineRef.current = ${factoryFn}(containerRef.current, {
${factoryPropLines},
${factoryCbLines}
\t\t});

\t\treturn () => {
\t\t\tengineRef.current?.destroy();
\t\t\tengineRef.current = null;
\t\t};
\t}, []);

\t${setterEffects}

\treturn <${hostElement} ref={containerRef} {...${hostElement}Props} />;
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
