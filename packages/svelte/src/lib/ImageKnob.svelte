<script lang="ts" module>
	import type { DraggableProps } from './Draggable.svelte';

	export type ImageKnobProps = DraggableProps & {
		/**
		 * Source for the knob image strip.
		 */
		src: string;

		/**
		 * Number of animation frames in the image.
		 * By default the component will try to guess.
		 */
		numberOfFrames?: number;

		/**
		 * Width of the image in pixels.
		 * Default width is 80;
		 */
		width?: number;

		/**
		 * Height of the image in pixels.
		 * Default height is 80;
		 */
		height?: number;
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import Draggable from './Draggable.svelte';

	type Props = SvelteHTMLElements['div'] & ImageKnobProps;
	let {
		value = $bindable(0.5),
		width = 80,
		height = 80,
		numberOfFrames,
		src,
		...defaultProps
	}: Props = $props();

	onMount(() => {
		const image = new Image();
		image.src = src;
		image.onload = () => {
			if ('width' in image && 'height' in image) {
				console.warn('Automatic estimation of numberOfFrames might be inaccurate');
				numberOfFrames = Math.floor(image.height / image.width) - 1;
			} else {
				throw Error('Failed to estimate numberOfFrames');
			}
		};
	});

	let transform = $derived(Math.floor(value * (numberOfFrames ?? 0)));
</script>

<Draggable
	bind:value
	style="width:{width}px;height:{height}px;{defaultProps.style}"
	{...defaultProps}
>
	<div
		style:background-image="url({src})"
		style:background-position="0 {-transform * height}px"
	></div>
</Draggable>

<style>
	div {
		position: relative;
		width: 100%;
		height: 100%;
	}
</style>
