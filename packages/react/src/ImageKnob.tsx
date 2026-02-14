import {
	createImageKnob,
	type ImageKnobApi,
	type ImageKnobOptions,
	type ImageKnobReactive
} from '@web-knobs/core/components/image-knob';

import {
	DEFAULT_KNOB_SNAP_THRESHOLD,
	DEFAULT_KNOB_STEP,
	DEFAULT_KNOB_VALUE,
	DEFAULT_KNOB_WEIGHT,
	type DraggableReactive
} from '@web-knobs/core/draggable';

import { type JSX, useEffect, useRef } from 'react';

type Props = ImageKnobOptions &
	DraggableReactive &
	ImageKnobReactive &
	React.HTMLAttributes<HTMLDivElement>;

export default function ImageKnob({
	value = DEFAULT_KNOB_VALUE,
	disabled = false,
	defaultValue = DEFAULT_KNOB_VALUE,
	invertWheel = false,
	step = DEFAULT_KNOB_STEP,
	snapPoints,
	snapThreshold = DEFAULT_KNOB_SNAP_THRESHOLD,
	weight = DEFAULT_KNOB_WEIGHT,

	src,
	numberOfFrames = null,
	width,
	height,

	onValueChange,
	onDisabledChange,
	onDefaultValueChange,
	onInvertWheelChange,
	onStepChange,
	onSnapPointsChange,
	onSnapThresholdChange,
	onWeightChange,

	onSrcChange,
	onNumberOfFramesChange,
	onWidthChange,
	onHeightChange,

	...divProps
}: Props): JSX.Element {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const engineRef = useRef<ImageKnobApi | null>(null);

	const callbacksRef = useRef<Omit<ImageKnobOptions, 'src' | 'width' | 'height'> | null>(null);

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
			onSrcChange,
			onNumberOfFramesChange,
			onWidthChange,
			onHeightChange
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
		onSrcChange,
		onNumberOfFramesChange,
		onWidthChange,
		onHeightChange
	]);

	/* 
  biome-ignore lint/correctness/useExhaustiveDependencies: src, width, height
    are getting updated in the engine somewhere else.
    This just needs to run once in the mount lifecycle
  */
	useEffect(() => {
		if (!containerRef.current) return;

		if (engineRef.current) {
			engineRef.current.destroy();
			engineRef.current = null;
		}
		containerRef.current.innerHTML = '';

		engineRef.current = createImageKnob(containerRef.current, {
			src,
			width,
			height,
			onValueChange: callbacksRef.current?.onValueChange,
			onDisabledChange: callbacksRef.current?.onDisabledChange,
			onDefaultValueChange: callbacksRef.current?.onDefaultValueChange,
			onInvertWheelChange: callbacksRef.current?.onInvertWheelChange,
			onStepChange: callbacksRef.current?.onStepChange,
			onSnapPointsChange: callbacksRef.current?.onSnapPointsChange,
			onSnapThresholdChange: callbacksRef.current?.onSnapThresholdChange,
			onWeightChange: callbacksRef.current?.onWeightChange,
			onSrcChange: callbacksRef.current?.onSrcChange,
			onNumberOfFramesChange: callbacksRef.current?.onNumberOfFramesChange,
			onWidthChange: callbacksRef.current?.onWidthChange,
			onHeightChange: callbacksRef.current?.onHeightChange
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

	useEffect(() => {
		if (snapPoints) {
			engineRef.current?.setSnapPoints(snapPoints);
		}
	}, [snapPoints]);

	return <div ref={containerRef} {...divProps} />;
}
