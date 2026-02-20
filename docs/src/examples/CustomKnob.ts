import { createDraggable, DEFAULT_KNOB_VALUE, valueToAngle } from '@eyewave/web-knobs/core';

declare const custom_knob: HTMLDivElement;

const [glow, thumb, span] = custom_knob.children[0].children;

function onChange(value: number) {
	const angle = valueToAngle(value, -135, 135);

	glow.setAttribute('style', `filter:blur(${value * 5}px);transform:scale(${value})`);
	thumb.setAttribute('style', `transform:rotate(${angle}deg) translateY(-10px)`);
	span.textContent = value.toFixed(2);
}

onChange(DEFAULT_KNOB_VALUE);
createDraggable(custom_knob, { onValueChange: onChange });
