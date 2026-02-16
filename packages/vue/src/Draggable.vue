<script setup lang="ts">
import {
	createDraggable,
	DEFAULT_KNOB_SNAP_THRESHOLD,
	DEFAULT_KNOB_STEP,
	DEFAULT_KNOB_VALUE,
	DEFAULT_KNOB_WEIGHT,
	type DraggableApi,
	type DraggableReactive
} from '@web-knobs/core/draggable';
import { ref, watch, onMounted, onUnmounted } from 'vue';

interface DraggableProps extends DraggableReactive {
	modelValue?: number;
}

const props = withDefaults(defineProps<DraggableProps>(), {
	modelValue: DEFAULT_KNOB_VALUE,
	disabled: false,
	defaultValue: DEFAULT_KNOB_VALUE,
	invertWheel: false,
	step: DEFAULT_KNOB_STEP,
	snapThreshold: DEFAULT_KNOB_SNAP_THRESHOLD,
	weight: DEFAULT_KNOB_WEIGHT
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
}>();

const divRef = ref<HTMLDivElement>();
const engine = ref<DraggableApi | null>(null);

onMounted(() => {
	if (divRef.value) {
		engine.value = createDraggable(divRef.value, {
			onValueChange: (v) => emit('update:modelValue', v),
			onDisabledChange: (v) => emit('update:disabled', v),
			onDefaultValueChange: (v) => emit('update:defaultValue', v),
			onInvertWheelChange: (v) => emit('update:invertWheel', v),
			onStepChange: (v) => emit('update:step', v),
			onSnapPointsChange: (v) => emit('update:snapPoints', v),
			onSnapThresholdChange: (v) => emit('update:snapThreshold', v),
			onWeightChange: (v) => emit('update:weight', v)
		});
	}
});

onUnmounted(() => {
	engine.value?.destroy();
});

watch(
	() => props.modelValue,
	(nv) => engine.value?.setValue(nv)
);
watch(
	() => props.disabled,
	(nv) => engine.value?.setDisabled(nv)
);
watch(
	() => props.defaultValue,
	(nv) => engine.value?.setDefaultValue(nv)
);
watch(
	() => props.invertWheel,
	(nv) => engine.value?.setInvertWheel(nv)
);
watch(
	() => props.step,
	(nv) => engine.value?.setStep(nv)
);
watch(
	() => props.snapPoints,
	(nv) => nv && engine.value?.setSnapPoints(nv)
);
watch(
	() => props.snapThreshold,
	(nv) => engine.value?.setSnapThreshold(nv)
);
watch(
	() => props.weight,
	(nv) => engine.value?.setWeight(nv)
);
</script>

<template>
	<div ref="divRef">
		<slot />
	</div>
</template>
