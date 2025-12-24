<script lang="ts">
	import { Draggable, type DraggableProps } from '@web-knobs/core/draggable';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = { children?: Snippet; props: DraggableProps } & SvelteHTMLElements['div'];

	const engine = new Draggable();

	let { children, props = $bindable(), ...divProps }: Props = $props();
	let isDisabled = $derived(props.disabled);

	engine.on('onPropChange', (p) => (props = p));
</script>

<div
	aria-disabled={isDisabled}
	class={divProps.class}
	style={divProps.style}
	role="slider"
	aria-valuenow={divProps['aria-valuenow']}
	tabindex="0"
	draggable={false}
	ondblclick={engine.handleDblClick}
	onkeydown={engine.handleKeyDown}
	onmousedown={engine.handleMouseDown}
	ontouchstart={engine.handleTouchStart}
	onwheel={engine.handleWheel}
>
	{@render children?.()}
</div>
