import {
	createDraggable,
	DEFAULT_KNOB_SNAP_THRESHOLD,
	DEFAULT_KNOB_STEP,
	DEFAULT_KNOB_VALUE,
	DEFAULT_KNOB_WEIGHT,
	type DraggableApi,
	type DraggableOptions,
	type DraggableReactive
} from '@web-knobs/core/draggable';

import { type ReactElement, useEffect, useRef } from 'react';

type Props = DraggableOptions & DraggableReactive & React.HTMLAttributes<HTMLDivElement>;

export default function Draggable({
	value = DEFAULT_KNOB_VALUE,
	disabled = false,
	defaultValue = DEFAULT_KNOB_VALUE,
	invertWheel = false,
	step = DEFAULT_KNOB_STEP,
	snapPoints,
	snapThreshold = DEFAULT_KNOB_SNAP_THRESHOLD,
	weight = DEFAULT_KNOB_WEIGHT,

	onValueChange,
	onDisabledChange,
	onDefaultValueChange,
	onInvertWheelChange,
	onStepChange,
	onSnapPointsChange,
	onSnapThresholdChange,
	onWeightChange,

	...divProps
}: Props): ReactElement {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const engineRef = useRef<DraggableApi | null>(null);

	const callbacksRef = useRef<DraggableOptions | null>(null);

	useEffect(() => {
		callbacksRef.current = {
			onValueChange,
			onDisabledChange,
			onDefaultValueChange,
			onInvertWheelChange,
			onStepChange,
			onSnapPointsChange,
			onSnapThresholdChange,
			onWeightChange
		};
	}, [
		onValueChange,
		onDisabledChange,
		onDefaultValueChange,
		onInvertWheelChange,
		onStepChange,
		onSnapPointsChange,
		onSnapThresholdChange,
		onWeightChange
	]);

	useEffect(() => {
		if (!containerRef.current) return;

		if (engineRef.current) {
			engineRef.current.destroy();
			engineRef.current = null;
		}
		containerRef.current.innerHTML = '';

		engineRef.current = createDraggable(containerRef.current, {
			value,
			disabled,
			defaultValue,
			invertWheel,
			step,
			snapPoints,
			snapThreshold,
			weight,
			onValueChange: callbacksRef.current?.onValueChange,
			onDisabledChange: callbacksRef.current?.onDisabledChange,
			onDefaultValueChange: callbacksRef.current?.onDefaultValueChange,
			onInvertWheelChange: callbacksRef.current?.onInvertWheelChange,
			onStepChange: callbacksRef.current?.onStepChange,
			onSnapPointsChange: callbacksRef.current?.onSnapPointsChange,
			onSnapThresholdChange: callbacksRef.current?.onSnapThresholdChange,
			onWeightChange: callbacksRef.current?.onWeightChange
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
