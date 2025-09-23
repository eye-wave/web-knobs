<script lang="ts" module>
	import { Spring, type Tween } from 'svelte/motion';

	type Motion<T> = Spring<T> | Tween<T>;

	let shield: HTMLDivElement | null = null;

	export type DraggableProps = {
		/**
		 * Normalized value of the component.
		 */
		value?: number;

		/**
		 * Readonly smoothed value
		 */
		valueSmoothed?: number;

		weight?: number;

		/**
		 * The increment or decrement value for keyboard interactions.
		 * Defaults to `0.05` if not specified.
		 */
		step?: number;

		/**
		 * Optional: specific values the knob will snap to.
		 */
		snapPoints?: Array<number>;

		snapThreshold?: number;

		invertWheel?: boolean;

		/**
		 * "svelte/motion" class instance used to animate the knob.
		 * Default motion in Spring with stiffness of 0.3
		 */
		motion?: Motion<number>;

		/**
		 * Initial value for the component.
		 */
		defaultValue?: number;

		/**
		 * Disables all interactivity for the component.
		 * When set to `true`, the component will be non-interactive,
		 */
		disabled?: boolean;
	};
</script>

<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { onDestroy, onMount } from 'svelte';
	import styles from './shield.module.css';
	import { clamp } from '$lib/helpers/clamp.js';

	type Props = DraggableProps & SvelteHTMLElements['div'];

	let {
		value = $bindable(0.5),
		valueSmoothed = $bindable(0.5),
		children,
		disabled: isDisabled = false,
		defaultValue,
		invertWheel = false,
		step = 0.05,
		snapPoints: _snapPoints,
		motion = new Spring(0.5, { stiffness: 0.3 }),
		snapThreshold = 0.08,
		weight = 200,
		...divProps
	}: Props = $props();

	type SvelteEvent = { currentTarget: EventTarget & HTMLDivElement };

	// Sort snap points and add 0 and 1 to beginning and end of the list
	let snapPoints = $derived.by(() => {
		if (_snapPoints === undefined) return;

		const sorted = _snapPoints.filter((n) => n >= 0.0 && n <= 1.0).toSorted((a, b) => a - b);
		if (sorted[0] !== 0.0) sorted.unshift(0.0);
		if (sorted[sorted.length - 1] !== 1.0) sorted.push(1.0);

		return sorted;
	});

	let isDragging = false;
	let isShieldOn = $state(false);
	let startX: number;
	let startY: number;
	let startValue: number;

	const isBrowser = typeof window === 'object';

	function snap(value: number, snapPoints?: Array<number>) {
		if (!snapPoints?.length) return value;
		for (const point of snapPoints) {
			const diff = Math.abs(point - value);
			if (diff < snapThreshold) {
				return point;
			}
		}

		return value;
	}

	function toMobile(handler: ({ clientY }: MouseEvent & SvelteEvent) => void | boolean) {
		return (event: TouchEvent) => {
			const touch = event.touches?.[0];
			if (!touch) return;
			const clientY = touch.clientY;
			const clientX = touch.clientX;
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			handler({ clientY, clientX } as MouseEvent & SvelteEvent) && event.preventDefault();
		};
	}

	function handleMouseDown(e: MouseEvent & SvelteEvent) {
		divProps?.onmousedown?.(e);
		if (isDisabled) return;

		isDragging = true;
		startX = e.clientX;
		startY = e.clientY;

		startValue = value;

		return true;
	}

	let wasHorizontal = true;

	function handleMouseMove({ clientY, clientX, altKey }: MouseEvent) {
		if (isDisabled || !isDragging) return;
		isShieldOn = true;

		const dy = startY - clientY;
		const dx = -(startX - clientX);

		const isHorizontal = Math.abs(dx) > Math.abs(dy);

		if (isHorizontal !== wasHorizontal) {
			startX = clientX;
			startY = clientY;
			startValue = value;
		}

		wasHorizontal = isHorizontal;

		const delta = isHorizontal ? dx : dy;
		const deltaValue = delta / weight;

		if (!altKey && snapPoints) {
			value = clamp(snap(startValue + deltaValue, snapPoints));
		} else {
			value = clamp(startValue + deltaValue);
		}

		return true;
	}

	function handleWheel(e: WheelEvent & SvelteEvent) {
		divProps?.onwheel?.(e);

		if (isDisabled) return;
		e.preventDefault();

		const delta = (e.deltaY > 0 ? 1.0 : -1.0) * (invertWheel ? -1.0 : 1.0);

		value = clamp(snap(value + delta * step, snapPoints));
	}

	function handleMouseUp() {
		isDragging = false;
		isShieldOn = false;
	}

	function handleDblClick(e: MouseEvent & SvelteEvent) {
		divProps?.ondblclick?.(e);
		if (isDisabled) return;
		if (defaultValue) value = defaultValue;
	}

	function handleKeyDown(e: KeyboardEvent & SvelteEvent) {
		divProps?.onkeydown?.(e);

		if (isDisabled) return;
		if (e.key === 'Escape') e.currentTarget?.blur();

		const isPointingLeft = e.key === 'ArrowLeft' || e.key === 'ArrowDown';
		const isPointingRight = e.key === 'ArrowRight' || e.key === 'ArrowUp';

		if (isPointingLeft || isPointingRight) e.preventDefault();

		if (!e.altKey && snapPoints) {
			let next = snapPoints.findIndex((n) => n >= value);

			next += +isPointingRight;
			next -= +isPointingLeft;

			next = clamp(next, 0, snapPoints.length - 1);

			value = snapPoints[next];
		} else {
			value += +isPointingRight * step - +isPointingLeft * step;
		}

		value = clamp(value);
	}

	const handleTouchStart = toMobile(handleMouseDown);
	const handleTouchMove = toMobile(handleMouseMove);

	onMount(() => {
		if (isBrowser) window.addEventListener('touchmove', handleTouchMove, { passive: false });
	});

	onDestroy(() => {
		if (isBrowser) window.removeEventListener('touchmove', handleTouchMove);
		shield?.remove();
	});

	$effect(() => {
		if (isShieldOn) {
			if (shield === null) shield = document.createElement('div');

			shield.className = styles.shield;
			document.body.append(shield);
			document.body.style.userSelect = 'none';
		} else {
			shield?.remove();
			document.body.style.userSelect = '';
		}
	});

	$effect(() => {
		motion.set(value);
	});

	$effect(() => {
		valueSmoothed = motion.current;
	});
</script>

<svelte:window onmousemove={handleMouseMove} onmouseup={handleMouseUp} ontouchend={handleMouseUp} />

<div
	aria-disabled={isDisabled}
	class={divProps.class}
	style={divProps.style}
	role="slider"
	aria-valuenow={divProps['aria-valuenow']}
	tabindex="0"
	draggable={false}
	ondblclick={handleDblClick}
	onkeydown={handleKeyDown}
	onmousedown={handleMouseDown}
	ontouchstart={handleTouchStart}
	onwheel={handleWheel}
>
	{@render children?.()}
</div>

<style>
	div {
		width: fit-content;
		cursor: grab;
	}

	div[aria-disabled='true'] {
		cursor: auto;
	}
</style>
