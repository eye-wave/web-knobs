<script lang="ts" module>
	import type { DraggableReactive } from '@web-knobs/core/draggable';
	import type { HTMLAttributes } from 'svelte/elements';

	export type DraggableProps = DraggableReactive & HTMLAttributes<HTMLDivElement>;
</script>

<script lang="ts">
	import {
		createDraggable,
		DEFAULT_KNOB_SNAP_THRESHOLD,
		DEFAULT_KNOB_STEP,
		DEFAULT_KNOB_VALUE,
		DEFAULT_KNOB_WEIGHT,
		type DraggableApi
	} from '@web-knobs/core/draggable';
	import { onDestroy, onMount } from 'svelte';

	let {
		children,
		value = $bindable(DEFAULT_KNOB_VALUE),
		disabled: isDisabled = false,
		defaultValue = DEFAULT_KNOB_VALUE,
		invertWheel = false,
		step = DEFAULT_KNOB_STEP,
		snapPoints,
		snapThreshold = DEFAULT_KNOB_SNAP_THRESHOLD,
		weight = DEFAULT_KNOB_WEIGHT,
		...divProps
	}: DraggableProps = $props();

	let ref = $state<HTMLDivElement>();
	let engine = $state<DraggableApi | null>(null);

	onDestroy(() => engine?.destroy());
	onMount(() => {
		if (ref)
			engine = createDraggable(ref, {
				value,
				disabled: isDisabled,
				defaultValue,
				invertWheel,
				step,
				snapPoints,
				snapThreshold,
				weight,
				onValueChange: (v) => (value = v),
				onDisabledChange: (v) => (isDisabled = v),
				onDefaultValueChange: (v) => (defaultValue = v),
				onInvertWheelChange: (v) => (invertWheel = v),
				onStepChange: (v) => (step = v),
				onSnapPointsChange: (v) => (snapPoints = v),
				onSnapThresholdChange: (v) => (snapThreshold = v),
				onWeightChange: (v) => (weight = v)
			});

		$effect(() => engine?.setValue(value));
		$effect(() => engine?.setDisabled(isDisabled));
		$effect(() => engine?.setDefaultValue(defaultValue));
		$effect(() => engine?.setInvertWheel(invertWheel));
		$effect(() => engine?.setStep(step));
		$effect(() => snapPoints && engine?.setSnapPoints(snapPoints));
		$effect(() => engine?.setSnapThreshold(snapThreshold));
		$effect(() => engine?.setWeight(weight));
	});
</script>

<div bind:this={ref} {...divProps}>{@render children?.()}</div>
