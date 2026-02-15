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
	type SvgKnobOptions,
	type SvgKnobReactive
} from '@web-knobs/core/components/svg-knob';

import {
	DEFAULT_KNOB_SNAP_THRESHOLD,
	DEFAULT_KNOB_STEP,
	DEFAULT_KNOB_VALUE,
	DEFAULT_KNOB_WEIGHT,
	type DraggableReactive
} from '@web-knobs/core/draggable';

import { type ReactElement, useEffect, useRef } from 'react';

type Props = SvgKnobOptions &
	DraggableReactive &
	SvgKnobReactive &
	React.HTMLAttributes<HTMLDivElement>;

export default function SvgKnob({
	value = DEFAULT_KNOB_VALUE,
	disabled = false,
	defaultValue = DEFAULT_KNOB_VALUE,
	invertWheel = false,
	step = DEFAULT_KNOB_STEP,
	snapPoints,
	snapThreshold = DEFAULT_KNOB_SNAP_THRESHOLD,
	weight = DEFAULT_KNOB_WEIGHT,

	arcRadius = DEFAULT_ARC_RADIUS,
	bgColor = DEFAULT_BG_COLOR,
	circleRadius = DEFAULT_CIRCLE_RADIUS,
	disabledColor = DEFAULT_DISABLED_COLOR,
	maxAngle = DEFAULT_MAX_ANGLE,
	minAngle = DEFAULT_MIN_ANGLE,
	pointerLength = DEFAULT_POINTER_LENGTH,
	size = DEFAULT_SIZE,
	snapPointLength = DEFAULT_SNAP_POINT_LENGTH,

	onValueChange,
	onDisabledChange,
	onDefaultValueChange,
	onInvertWheelChange,
	onStepChange,
	onSnapPointsChange,
	onSnapThresholdChange,
	onWeightChange,

	onArcRadiusChange,
	onBgColorChange,
	onCircleRadiusChange,
	onDisabledColorChange,
	onMaxAngleChange,
	onMinAngleChange,
	onPointerLengthChange,
	onSizeChange,
	onSnapPointLengthChange,

	...divProps
}: Props): ReactElement {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const engineRef = useRef<SvgKnobApi | null>(null);

	const callbacksRef = useRef<SvgKnobOptions | null>(null);

	useEffect(() => {
		callbacksRef.current = {
			onValueChange,
			onDisabledChange,
			onDefaultValueChange,
			onInvertWheelChange,
			onStepChange,
			onSnapPointsChange,
			onSnapThresholdChange,
			onWeightChange,
			onArcRadiusChange,
			onBgColorChange,
			onCircleRadiusChange,
			onDisabledColorChange,
			onMaxAngleChange,
			onMinAngleChange,
			onPointerLengthChange,
			onSizeChange,
			onSnapPointLengthChange
		};
	}, [
		onValueChange,
		onDisabledChange,
		onDefaultValueChange,
		onInvertWheelChange,
		onStepChange,
		onSnapPointsChange,
		onSnapThresholdChange,
		onWeightChange,
		onArcRadiusChange,
		onBgColorChange,
		onCircleRadiusChange,
		onDisabledColorChange,
		onMaxAngleChange,
		onMinAngleChange,
		onPointerLengthChange,
		onSizeChange,
		onSnapPointLengthChange
	]);

	useEffect(() => {
		if (!containerRef.current) return;

		if (engineRef.current) {
			engineRef.current.destroy();
			engineRef.current = null;
		}
		containerRef.current.innerHTML = '';

		engineRef.current = createSvgKnob(containerRef.current, {
			onValueChange: callbacksRef.current?.onValueChange,
			onDisabledChange: callbacksRef.current?.onDisabledChange,
			onDefaultValueChange: callbacksRef.current?.onDefaultValueChange,
			onInvertWheelChange: callbacksRef.current?.onInvertWheelChange,
			onStepChange: callbacksRef.current?.onStepChange,
			onSnapPointsChange: callbacksRef.current?.onSnapPointsChange,
			onSnapThresholdChange: callbacksRef.current?.onSnapThresholdChange,
			onWeightChange: callbacksRef.current?.onWeightChange,
			onArcRadiusChange: callbacksRef.current?.onArcRadiusChange,
			onBgColorChange: callbacksRef.current?.onBgColorChange,
			onCircleRadiusChange: callbacksRef.current?.onCircleRadiusChange,
			onDisabledColorChange: callbacksRef.current?.onDisabledColorChange,
			onMaxAngleChange: callbacksRef.current?.onMaxAngleChange,
			onMinAngleChange: callbacksRef.current?.onMinAngleChange,
			onPointerLengthChange: callbacksRef.current?.onPointerLengthChange,
			onSizeChange: callbacksRef.current?.onSizeChange,
			onSnapPointLengthChange: callbacksRef.current?.onSnapPointLengthChange
		});

		return () => {
			engineRef.current?.destroy();
			engineRef.current = null;
		};
	}, []);

	useEffect(() => engineRef.current?.setValue(value), [value]);
	useEffect(() => engineRef.current?.setDisabled(disabled), [disabled]);
	useEffect(() => engineRef.current?.setDefaultValue(defaultValue), [defaultValue]);
	useEffect(() => engineRef.current?.setInvertWheel(invertWheel), [invertWheel]);
	useEffect(() => engineRef.current?.setStep(step), [step]);
	useEffect(() => engineRef.current?.setSnapThreshold(snapThreshold), [snapThreshold]);
	useEffect(() => engineRef.current?.setWeight(weight), [weight]);

	useEffect(() => engineRef.current?.setArcRadius(arcRadius), [arcRadius]);
	useEffect(() => engineRef.current?.setBgColor(bgColor), [bgColor]);
	useEffect(() => engineRef.current?.setCircleRadius(circleRadius), [circleRadius]);
	useEffect(() => engineRef.current?.setDisabledColor(disabledColor), [disabledColor]);
	useEffect(() => engineRef.current?.setMaxAngle(maxAngle), [maxAngle]);
	useEffect(() => engineRef.current?.setMinAngle(minAngle), [minAngle]);
	useEffect(() => engineRef.current?.setPointerLength(pointerLength), [pointerLength]);
	useEffect(() => engineRef.current?.setSize(size), [size]);
	useEffect(() => engineRef.current?.setSnapPointLength(snapPointLength), [snapPointLength]);

	useEffect(() => {
		if (snapPoints) {
			engineRef.current?.setSnapPoints(snapPoints);
		}
	}, [snapPoints]);

	return <div ref={containerRef} {...divProps} />;
}
