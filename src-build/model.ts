/**
 * A prop with a compile-time default value.
 * The prop is optional in the component signature.
 * Example: `{ kind: 'default', value: 'DEFAULT_KNOB_VALUE' }`
 */
export interface DefaultProp {
	kind: 'default';
	/** The default value expression, e.g. "DEFAULT_KNOB_VALUE", "false", "'#333'" */
	value: string;
}

/**
 * A prop that must always be supplied by the consumer.
 * Not included in `withDefaults` (Vue) or given an initialiser (React/Svelte).
 */
export interface RequiredProp {
	kind: 'required';
}

type PropKind = DefaultProp | RequiredProp;

export type PropDefinition = PropKind & {
	/** Prop name as it appears in the Reactive type, e.g. "value", "bgColor" */
	name: string;

	/** TypeScript type string, e.g. "number", "boolean", "string", "number[]" */
	type: string;

	/**
	 * Override the local variable name in generated Svelte code.
	 * e.g. prop "disabled" with alias "isDisabled" → `disabled: isDisabled = false`
	 * React and Vue always use the original prop name.
	 */
	alias?: string;

	/**
	 * Mark this as the primary v-model / $bindable prop.
	 * - Vue:    prop is exposed as "modelValue"
	 * - Svelte: prop gets $bindable()
	 * Only one prop per config should have this flag.
	 * Must be combined with kind: 'default' (the $bindable needs an initial value).
	 */
	bindable?: boolean;
};

export interface ImportGroup {
	/** The module specifier, e.g. "@web-knobs/core/draggable" */
	from: string;

	/**
	 * Named exports to import.
	 * Prefix type-only imports with "type ", e.g. "type DraggableApi".
	 * The generator splits value imports from type imports automatically.
	 */
	imports: string[];
}

export interface WrapperConfig {
	/** Component name, e.g. "SvgKnob" */
	componentName: string;

	/**
	 * All import groups needed by the wrapper, in the order they appear.
	 * Each group corresponds to one source module.
	 */
	importGroups: ImportGroup[];

	/** The factory function name, e.g. "createSvgKnob" */
	factoryFn: string;

	/** The Api type returned by the factory, e.g. "SvgKnobApi" */
	apiType: string;

	/**
	 * The Options type accepted by the factory, e.g. "SvgKnobOptions".
	 * Used as the type of callbacksRef in React.
	 */
	optionsType: string;

	/**
	 * Props organised in groups (one group per source Reactive type).
	 * Groups are rendered in order; a blank line separates them in the output.
	 */
	propGroups: PropDefinition[][];

	/** Host HTML element tag. Defaults to "div". */
	hostElement?: string;

	/**
	 * Whether the component exposes a slot / children.
	 * Defaults to false (self-closing host element).
	 */
	hasSlot?: boolean;
}
