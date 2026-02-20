import { createSvgKnob } from '@eyewave/web-knobs/core/components/svg-knob';

declare const snap_knob: HTMLDivElement;
declare const snap_knob_value: HTMLSpanElement;

createSvgKnob(snap_knob, {
	snapPoints: [0.5],
	onValueChange(v) {
		snap_knob_value.textContent = v.toFixed(2);
	}
});
