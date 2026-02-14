<script lang="ts" module>
	import type { DraggableProps } from './Draggable.svelte';

	export type SvgKnobProps = DraggableProps & {
		/**
		 * Size of the knob in pixels.
		 * Default size is 80.
		 */
		size?: number;

		snapPointLength?: number;
		circleRadius?: number;
		arcRadius?: number;

		pointerLength?: number;

		/**
		 * Background color of the knob.
		 * Default color is #333
		 */
		bgColor?: string;

		/**
		 * Disabled color for the knob.
		 * Default color is #777
		 */
		disabledColor?: string;

		/**
		 * Starting angle for the knob in degrees ( when the value is 0.0 ).
		 * Default minAngle is -135
		 */
		minAngle?: number;

		/**
		 * Ending angle for the knob in degrees ( when the value is 1.0 ).
		 * Default maxAngle is 135
		 */
		maxAngle?: number;
	};
</script>

<script lang="ts">
	import { describeArc, polarToCartesian, valueToAngle } from '@web-knobs/core/helpers';
	import Draggable from './Draggable.svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['svg'] & SvgKnobProps;
	let {
		value = $bindable(0.5),
		size = 80,
		bgColor = '#333',
		disabledColor = '#777',
		minAngle = -135,
		maxAngle = 135,
		snapPointLength = 0.44,
		invertWheel,
		circleRadius: cr = 0.32,
		arcRadius: ar = 0.4,
		pointerLength = 0,
		step,
		disabled: isDisabled,
		defaultValue,
		snapPoints,
		snapThreshold,
		weight,
		...svgProps
	}: Props = $props();

	let draggableProps = $derived({
		defaultValue,
		invertWheel,
		snapPoints,
		snapThreshold,
		step,
		weight
	});

	let c = $derived(size / 2);
	let arcRadius = $derived(size * ar);
	let circleRadius = $derived(size * cr);
	let snapRadius = $derived(size * snapPointLength);
</script>

<Draggable bind:value {...draggableProps} disabled={isDisabled}>
	<svg
		width="{size}px"
		height="{size}px"
		viewBox="0 0 {size} {size}"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width={size * 0.06}
		{...svgProps}
	>
		<circle cx={c} cy={c} r={circleRadius} fill={bgColor}></circle>
		<!-- Arcs -->
		<path
			class="knob_line"
			d={describeArc(c, c, arcRadius, 1.0, minAngle, maxAngle)}
			stroke={bgColor}
			fill="none"
		/>
		<path
			class="knob_line"
			d={describeArc(c, c, arcRadius, value, minAngle, maxAngle)}
			stroke={isDisabled ? disabledColor : 'currentColor'}
			fill="none"
		/>
		<!-- Knob indicator -->
		{@render indicator()}
		<!-- Snap points -->
		{#each snapPoints ?? [] as p}
			{@const [x1, y1] = polarToCartesian(c, c, arcRadius, valueToAngle(p, minAngle, maxAngle))}
			{@const [x2, y2] = polarToCartesian(c, c, snapRadius, valueToAngle(p, minAngle, maxAngle))}
			{@const stroke = value >= p ? 'currentColor' : bgColor}

			<line class="knob_line" {x1} {y1} {x2} {y2} {stroke} />
		{/each}
	</svg>
</Draggable>

{#snippet indicator()}
	{@const [x1, y1] = polarToCartesian(
		c,
		c,
		circleRadius * 0.8,
		valueToAngle(value, minAngle, maxAngle)
	)}
	{@const [x2, y2] = polarToCartesian(
		c,
		c,
		circleRadius * 0.8 - pointerLength * size * 0.52,
		valueToAngle(value, minAngle, maxAngle)
	)}
	<line
		class="knob_line"
		{x1}
		{y1}
		{x2}
		{y2}
		stroke={isDisabled ? disabledColor : 'currentColor'}
	/>
{/snippet}
