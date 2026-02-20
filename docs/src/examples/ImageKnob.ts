import { createImageKnob } from '@eyewave/web-knobs/core/components/image-knob';

declare const image_knob: HTMLDivElement;

createImageKnob(image_knob, { src: '/web-knobs/PurpleKnob2.webp', width: 90, height: 90 });
