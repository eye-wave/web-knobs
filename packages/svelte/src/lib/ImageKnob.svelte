<script lang="ts" module>
	import type { ImageKnobReactive } from '@web-knobs/core/components/image-knob';
	import type { DraggableReactive } from '@web-knobs/core/draggable';
	import type { HTMLAttributes } from 'svelte/elements';

	export type DraggableProps = DraggableReactive &
		ImageKnobReactive &
		HTMLAttributes<HTMLDivElement>;
</script>

<script lang="ts">
	import {
		DEFAULT_KNOB_SNAP_THRESHOLD,
		DEFAULT_KNOB_STEP,
		DEFAULT_KNOB_VALUE,
		DEFAULT_KNOB_WEIGHT
	} from '@web-knobs/core/draggable';

	import { createImageKnob, type ImageKnobApi } from '@web-knobs/core/components/image-knob';

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

		// Image Knob props
		src,
		numberOfFrames = null,
		width,
		height,

		...divProps
	}: DraggableProps = $props();

	let ref = $state<HTMLDivElement>();
	let engine = $state<ImageKnobApi | null>(null);

	onDestroy(() => engine?.destroy());
	onMount(() => {
		if (ref)
			engine = createImageKnob(ref, {
				src,
				width,
				height,

				onValueChange: (v) => (value = v),
				onDisabledChange: (v) => (isDisabled = v),
				onDefaultValueChange: (v) => (defaultValue = v),
				onInvertWheelChange: (v) => (invertWheel = v),
				onStepChange: (v) => (step = v),
				onSnapPointsChange: (v) => (snapPoints = v),
				onSnapThresholdChange: (v) => (snapThreshold = v),
				onWeightChange: (v) => (weight = v),

				onSrcChange: (v) => (src = v),
				onNumberOfFramesChange: (v) => (numberOfFrames = v),
				onWidthChange: (v) => (width = v),
				onHeightChange: (v) => (height = v)
			});

		$effect(() => engine?.setValue(value));
		$effect(() => engine?.setDisabled(isDisabled));
		$effect(() => engine?.setDefaultValue(defaultValue));
		$effect(() => engine?.setInvertWheel(invertWheel));
		$effect(() => engine?.setStep(step));
		$effect(() => snapPoints && engine?.setSnapPoints(snapPoints));
		$effect(() => engine?.setSnapThreshold(snapThreshold));
		$effect(() => engine?.setWeight(weight));

		$effect(() => engine?.setSrc(src));
		$effect(() => engine?.setNumberOfFrames(numberOfFrames));
		$effect(() => engine?.setWidth(width));
		$effect(() => engine?.setHeight(height));
	});
</script>

<div bind:this={ref} {...divProps} />
