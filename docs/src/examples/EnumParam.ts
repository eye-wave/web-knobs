import { DEFAULT_KNOB_VALUE } from '@eyewave/web-knobs/core';
import { createSvgKnob, type SvgKnobApi } from '@eyewave/web-knobs/core/components/svg-knob';
import { BoolParam, EnumParam } from '@eyewave/web-knobs/core/params';

declare const fruit_knob: HTMLDivElement;
declare const fruit_knob_value: HTMLParagraphElement;
declare const filter_knob: HTMLDivElement;
declare const filter_knob_value: HTMLParagraphElement;
declare const bool_knob: HTMLDivElement;
declare const bool_knob_value: HTMLParagraphElement;

const fruitParam = new EnumParam(['🍍', '🍉', '🍌', '🍋', '🍇'] as const);
const filterTypeParam = new EnumParam([
	'Low pass',
	'High pass',
	'Low shelf',
	'High shelf',
	'Bell',
	'Notch',
	'Allpass'
] as const);

const booleanParam = new BoolParam();

let isSyncing = false;

function onChange(v: number, toUpdate: SvgKnobApi[] = []) {
	if (isSyncing) return;
	isSyncing = true;

	fruit_knob_value.textContent = fruitParam.denormalize(v);
	filter_knob_value.textContent = filterTypeParam.denormalize(v);
	bool_knob_value.textContent = booleanParam.denormalize(v).toString();

	toUpdate.forEach((k) => {
		k.setValue(v);
	});

	isSyncing = false;
}

onChange(DEFAULT_KNOB_VALUE);

const fruitKnob = createSvgKnob(fruit_knob, {
	snapPoints: fruitParam.snapPoints,
	snapThreshold: fruitParam.snapThreshold,
	onValueChange: (v) => onChange(v, [boolKnob, filterKnob])
});

const filterKnob = createSvgKnob(filter_knob, {
	...filterTypeParam.knobProps,
	onValueChange: (v) => onChange(v, [fruitKnob, boolKnob])
});

const boolKnob = createSvgKnob(bool_knob, {
	...booleanParam.knobProps,
	onValueChange: (v) => onChange(v, [fruitKnob, filterKnob])
});
