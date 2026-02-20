import { DEFAULT_KNOB_VALUE } from '@eyewave/web-knobs/core';
import { createSvgKnob } from '@eyewave/web-knobs/core/components/svg-knob';

declare const basic_knob: HTMLDivElement;
declare const basic_knob_disabled: HTMLDivElement;
declare const basic_knob_value: HTMLSpanElement;

const knob = createSvgKnob(basic_knob_disabled, { disabled: true });
const onChange = (v: number) => {
	knob.setValue(v);
	basic_knob_value.textContent = v.toFixed(2);
};

onChange(DEFAULT_KNOB_VALUE);

createSvgKnob(basic_knob, { onValueChange: onChange });
