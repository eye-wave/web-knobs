<script setup lang="ts">
import {
	createImageKnob,
	type ImageKnobApi,
	type ImageKnobReactive
} from '@web-knobs/core/components/image-knob';
import {
	DEFAULT_KNOB_SNAP_THRESHOLD,
	DEFAULT_KNOB_STEP,
	DEFAULT_KNOB_VALUE,
	DEFAULT_KNOB_WEIGHT,
	type DraggableApi,
	type DraggableReactive
} from '@web-knobs/core/draggable';
import { ref, watch, onMounted, onUnmounted } from 'vue';

interface ImageKnobProps extends ImageKnobReactive, DraggableReactive {
	modelValue?: number;
}

const props = withDefaults(defineProps<ImageKnobProps>(), {
	modelValue: DEFAULT_KNOB_VALUE,
	disabled: false,
	defaultValue: DEFAULT_KNOB_VALUE,
	invertWheel: false,
	step: DEFAULT_KNOB_STEP,
	snapThreshold: DEFAULT_KNOB_SNAP_THRESHOLD,
	weight: DEFAULT_KNOB_WEIGHT,

	numberOfFrames: null
});

const emit = defineEmits<{
	'update:modelValue': [value: number];
	'update:disabled': [value: boolean];
	'update:defaultValue': [value: number];
	'update:invertWheel': [value: boolean];
	'update:step': [value: number];
	'update:snapPoints': [value: number[]];
	'update:snapThreshold': [value: number];
	'update:weight': [value: number];

	'update:src': [value: string];
	'update:numberOfFrames': [value: number | null];
	'update:width': [value: number];
	'update:height': [value: number];
}>();

const divRef = ref<HTMLDivElement>();
const engine = ref<ImageKnobApi | null>(null);

onMounted(() => {
	if (divRef.value) {
		engine.value = createImageKnob(divRef.value, {
			src: props.src,
			width: props.width,
			height: props.height,

			onValueChange: (v) => emit('update:modelValue', v),
			onDisabledChange: (v) => emit('update:disabled', v),
			onDefaultValueChange: (v) => emit('update:defaultValue', v),
			onInvertWheelChange: (v) => emit('update:invertWheel', v),
			onStepChange: (v) => emit('update:step', v),
			onSnapPointsChange: (v) => emit('update:snapPoints', v),
			onSnapThresholdChange: (v) => emit('update:snapThreshold', v),
			onWeightChange: (v) => emit('update:weight', v),

			onSrcChange: (v) => emit('update:src', v),
			onNumberOfFramesChange: (v) => emit('update:numberOfFrames', v),
			onWidthChange: (v) => emit('update:width', v),
			onHeightChange: (v) => emit('update:height', v)
		});
	}
});

onUnmounted(() => {
	engine.value?.destroy();
});

watch(
	() => props.modelValue,
	(v) => engine.value?.setValue?.(v)
);
watch(
	() => props.disabled,
	(v) => engine.value?.setDisabled?.(v)
);
watch(
	() => props.defaultValue,
	(v) => engine.value?.setDefaultValue?.(v)
);
watch(
	() => props.invertWheel,
	(v) => engine.value?.setInvertWheel?.(v)
);
watch(
	() => props.step,
	(v) => engine.value?.setStep?.(v)
);
watch(
	() => props.snapPoints,
	(v) => v && engine.value?.setSnapPoints?.(v)
);
watch(
	() => props.snapThreshold,
	(v) => engine.value?.setSnapThreshold?.(v)
);
watch(
	() => props.weight,
	(v) => engine.value?.setWeight?.(v)
);

watch(
	() => props.src,
	(v) => engine.value?.setSrc?.(v)
);
watch(
	() => props.numberOfFrames,
	(v) => engine.value?.setNumberOfFrames?.(v)
);
watch(
	() => props.width,
	(v) => engine.value?.setWidth?.(v)
);
watch(
	() => props.height,
	(v) => engine.value?.setHeight?.(v)
);
</script>

<template>
	<div ref="divRef">
		<slot />
	</div>
</template>
