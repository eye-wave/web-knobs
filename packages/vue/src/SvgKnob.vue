<script setup lang="ts">
import {
	createSvgKnob,
	DEFAULT_ARC_RADIUS,
	DEFAULT_BG_COLOR,
	DEFAULT_CIRCLE_RADIUS,
	DEFAULT_DISABLED_COLOR,
	DEFAULT_MAX_ANGLE,
	DEFAULT_MIN_ANGLE,
	DEFAULT_POINTER_LENGTH,
	DEFAULT_SIZE,
	DEFAULT_SNAP_POINT_LENGTH,
	type SvgKnobApi,
	type SvgKnobReactive
} from '@web-knobs/core/components/svg-knob';
import {
	DEFAULT_KNOB_SNAP_THRESHOLD,
	DEFAULT_KNOB_STEP,
	DEFAULT_KNOB_VALUE,
	DEFAULT_KNOB_WEIGHT,
	type DraggableReactive
} from '@web-knobs/core/draggable';
import { ref, watch, onMounted, onUnmounted } from 'vue';

interface SvgKnobProps extends SvgKnobReactive, DraggableReactive {
	modelValue?: number;
}

const props = withDefaults(defineProps<SvgKnobProps>(), {
	modelValue: DEFAULT_KNOB_VALUE,
	disabled: false,
	defaultValue: DEFAULT_KNOB_VALUE,
	invertWheel: false,
	step: DEFAULT_KNOB_STEP,
	snapThreshold: DEFAULT_KNOB_SNAP_THRESHOLD,
	weight: DEFAULT_KNOB_WEIGHT,

	arcRadius: DEFAULT_ARC_RADIUS,
	bgColor: DEFAULT_BG_COLOR,
	circleRadius: DEFAULT_CIRCLE_RADIUS,
	disabledColor: DEFAULT_DISABLED_COLOR,
	maxAngle: DEFAULT_MAX_ANGLE,
	minAngle: DEFAULT_MIN_ANGLE,
	pointerLength: DEFAULT_POINTER_LENGTH,
	size: DEFAULT_SIZE,
	snapPointLength: DEFAULT_SNAP_POINT_LENGTH
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

	'update:arcRadius': [value: number];
	'update:bgColor': [value: string];
	'update:circleRadius': [value: number];
	'update:disabledColor': [value: string];
	'update:maxAngle': [value: number];
	'update:minAngle': [value: number];
	'update:pointerLength': [value: number];
	'update:size': [value: number];
	'update:snapPointLength': [value: number];
}>();

const divRef = ref<HTMLDivElement>();
const engine = ref<SvgKnobApi | null>(null);

onMounted(() => {
	if (divRef.value) {
		engine.value = createSvgKnob(divRef.value, {
			value: props.value,
			disabled: props.disabled,
			defaultValue: props.defaultValue,
			invertWheel: props.invertWheel,
			step: props.step,
			snapPoints: props.snapPoints,
			snapThreshold: props.snapThreshold,
			weight: props.weight,
			arcRadius: props.arcRadius,
			bgColor: props.bgColor,
			circleRadius: props.circleRadius,
			disabledColor: props.disabledColor,
			maxAngle: props.maxAngle,
			minAngle: props.minAngle,
			pointerLength: props.pointerLength,
			size: props.size,
			snapPointLength: props.snapPointLength,
			onValueChange: (v) => emit('update:modelValue', v),
			onDisabledChange: (v) => emit('update:disabled', v),
			onDefaultValueChange: (v) => emit('update:defaultValue', v),
			onInvertWheelChange: (v) => emit('update:invertWheel', v),
			onStepChange: (v) => emit('update:step', v),
			onSnapPointsChange: (v) => emit('update:snapPoints', v),
			onSnapThresholdChange: (v) => emit('update:snapThreshold', v),
			onWeightChange: (v) => emit('update:weight', v),

			onArcRadiusChange: (v) => emit('update:arcRadius', v),
			onBgColorChange: (v) => emit('update:bgColor', v),
			onCircleRadiusChange: (v) => emit('update:circleRadius', v),
			onDisabledColorChange: (v) => emit('update:disabledColor', v),
			onMaxAngleChange: (v) => emit('update:maxAngle', v),
			onMinAngleChange: (v) => emit('update:minAngle', v),
			onPointerLengthChange: (v) => emit('update:pointerLength', v),
			onSizeChange: (v) => emit('update:size', v),
			onSnapPointLengthChange: (v) => emit('update:snapPointLength', v)
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
	() => props.arcRadius,
	(v) => engine.value?.setArcRadius?.(v)
);
watch(
	() => props.bgColor,
	(v) => engine.value?.setBgColor?.(v)
);
watch(
	() => props.circleRadius,
	(v) => engine.value?.setCircleRadius?.(v)
);
watch(
	() => props.disabledColor,
	(v) => engine.value?.setDisabledColor?.(v)
);
watch(
	() => props.maxAngle,
	(v) => engine.value?.setMaxAngle?.(v)
);
watch(
	() => props.minAngle,
	(v) => engine.value?.setMinAngle?.(v)
);
watch(
	() => props.pointerLength,
	(v) => engine.value?.setPointerLength?.(v)
);
watch(
	() => props.size,
	(v) => engine.value?.setSize?.(v)
);
watch(
	() => props.snapPointLength,
	(v) => engine.value?.setSnapPointLength?.(v)
);
</script>

<template>
	<div ref="divRef">
		<slot />
	</div>
</template>
