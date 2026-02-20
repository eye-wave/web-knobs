import { DEFAULT_KNOB_VALUE } from '@eyewave/web-knobs/core';
import { createSvgKnob } from '@eyewave/web-knobs/core/components/svg-knob';
import { LinearParam, LogParam } from '@eyewave/web-knobs/core/params';

declare const param_knob_freq: HTMLDivElement;
declare const param_knob_freq_value: HTMLSpanElement;
declare const param_knob_lin: HTMLDivElement;
declare const param_knob_lin_value: HTMLSpanElement;

const freqParam = new LogParam(20, 20_000, 10);
const linParam = new LinearParam(0, 100);

let isSyncing = false;

function onChange(v: number) {
	param_knob_freq_value.textContent = (freqParam.denormalize(v) | 0) + 'hz';
	param_knob_lin_value.textContent = (linParam.denormalize(v) | 0) + '%';
}

onChange(DEFAULT_KNOB_VALUE);

const freqKnob = createSvgKnob(param_knob_freq, {
	onValueChange: (v) => {
		if (isSyncing) return;
		isSyncing = true;

		linKnob.setValue(v);
		onChange(v);

		isSyncing = false;
	}
});

const linKnob = createSvgKnob(param_knob_lin, {
	onValueChange: (v) => {
		if (isSyncing) return;
		isSyncing = true;

		freqKnob.setValue(v);
		onChange(v);

		isSyncing = false;
	}
});
