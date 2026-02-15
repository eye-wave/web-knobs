<script lang="ts" module>
  import type { SvgKnobReactive } from "@web-knobs/core/components/svg-knob";
  import type { DraggableReactive } from "@web-knobs/core/draggable";
  import type { HTMLAttributes } from "svelte/elements";

  export type DraggableProps = DraggableReactive &
    SvgKnobReactive &
    HTMLAttributes<HTMLDivElement>;
</script>

<script lang="ts">
  import {
    DEFAULT_KNOB_SNAP_THRESHOLD,
    DEFAULT_KNOB_STEP,
    DEFAULT_KNOB_VALUE,
    DEFAULT_KNOB_WEIGHT,
  } from "@web-knobs/core/draggable";

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
  } from "@web-knobs/core/components/svg-knob";

  import { onDestroy, onMount } from "svelte";

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

    // SVG Knob props
    arcRadius = DEFAULT_ARC_RADIUS,
    bgColor = DEFAULT_BG_COLOR,
    circleRadius = DEFAULT_CIRCLE_RADIUS,
    disabledColor = DEFAULT_DISABLED_COLOR,
    maxAngle = DEFAULT_MAX_ANGLE,
    minAngle = DEFAULT_MIN_ANGLE,
    pointerLength = DEFAULT_POINTER_LENGTH,
    size = DEFAULT_SIZE,
    snapPointLength = DEFAULT_SNAP_POINT_LENGTH,
    ...divProps
  }: DraggableProps = $props();

  let ref = $state<HTMLDivElement>();
  let engine = $state<SvgKnobApi | null>(null);

  onDestroy(() => engine?.destroy());
  onMount(() => {
    if (ref)
      engine = createSvgKnob(ref, {
        onValueChange: (v) => (value = v),
        onDisabledChange: (v) => (isDisabled = v),
        onDefaultValueChange: (v) => (defaultValue = v),
        onInvertWheelChange: (v) => (invertWheel = v),
        onStepChange: (v) => (step = v),
        onSnapPointsChange: (v) => (snapPoints = v),
        onSnapThresholdChange: (v) => (snapThreshold = v),
        onWeightChange: (v) => (weight = v),

        onArcRadiusChange: (v) => (arcRadius = v),
        onBgColorChange: (v) => (bgColor = v),
        onCircleRadiusChange: (v) => (circleRadius = v),
        onDisabledColorChange: (v) => (disabledColor = v),
        onMaxAngleChange: (v) => (maxAngle = v),
        onMinAngleChange: (v) => (minAngle = v),
        onPointerLengthChange: (v) => (pointerLength = v),
        onSizeChange: (v) => (size = v),
        onSnapPointLengthChange: (v) => (snapPointLength = v),
      });

    $effect(() => engine?.setValue(value));
    $effect(() => engine?.setDisabled(isDisabled));
    $effect(() => engine?.setDefaultValue(defaultValue));
    $effect(() => engine?.setInvertWheel(invertWheel));
    $effect(() => engine?.setStep(step));
    $effect(() => snapPoints && engine?.setSnapPoints(snapPoints));
    $effect(() => engine?.setSnapThreshold(snapThreshold));
    $effect(() => engine?.setWeight(weight));

    $effect(() => engine?.setArcRadius(arcRadius));
    $effect(() => engine?.setBgColor(bgColor));
    $effect(() => engine?.setCircleRadius(circleRadius));
    $effect(() => engine?.setDisabledColor(disabledColor));
    $effect(() => engine?.setMaxAngle(maxAngle));
    $effect(() => engine?.setMinAngle(minAngle));
    $effect(() => engine?.setPointerLength(pointerLength));
    $effect(() => engine?.setSize(size));
    $effect(() => engine?.setSnapPointLength(snapPointLength));
  });
</script>

<div bind:this={ref} {...divProps} />
