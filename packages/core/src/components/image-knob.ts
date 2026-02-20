import {
	createDraggable,
	DEFAULT_KNOB_VALUE,
	type DraggableApi,
	type DraggableOptions
} from '../draggable';
import { addReactive, type PropsToApi, type PropsToOptions } from '../helpers';

export type ImageKnobReactive = {
	/**
	 * Source for the knob image strip.
	 */
	src: string;

	/**
	 * Number of animation frames in the image.
	 * By default the component will try to guess.
	 */
	numberOfFrames?: number | null;

	/**
	 * Width of the single image frame in pixels.
	 * Default width is 80;
	 */
	width: number;

	/**
	 * Height of the single image frame in pixels.
	 * Default height is 80;
	 */
	height: number;
};

export type ImageKnobApi = DraggableApi & PropsToApi<ImageKnobReactive, '_knob'>;
export type ImageKnobOptions = DraggableOptions & PropsToOptions<ImageKnobReactive>;

export function createImageKnob<E extends HTMLElement>(
	container: E,
	options: ImageKnobOptions
): ImageKnobApi {
	const state = {} as Required<ImageKnobReactive>;
	const image = new Image();

	const transform = (value: number) => Math.floor(value * (state.numberOfFrames ?? 0));

	image.onload = () => {
		if ('width' in image && 'height' in image) {
			console.warn('Automatic estimation of numberOfFrames might be inaccurate');
			state.numberOfFrames = Math.floor(image.height / image.width) - 1;
		} else {
			throw Error('Failed to estimate numberOfFrames');
		}
	};

	const engine = createDraggable(container, {
		...options,
		onValueChange(v) {
			options.onValueChange?.(v);
			draw(v);
		}
	}) as ImageKnobApi;

	addReactive(state, 'src', options.src, (src) => {
		options.onSrcChange?.(src);

		image.src = src;
		container.style.backgroundImage = `url(${src})`;
	});
	addReactive(state, 'numberOfFrames', null, options.onNumberOfFramesChange);
	addReactive(
		state,
		'width',
		options.width,
		(width) => {
			options.onWidthChange?.(width);

			container.style.width = width + 'px';
			draw(engine.__state.value);
		},
		false
	);
	addReactive(
		state,
		'height',
		options.height,
		(height) => {
			options.onHeightChange?.(height);

			container.style.width = height + 'px';
			draw(engine.__state.value);
		},
		false
	);

	Object.freeze(state);

	container.style.width = options.width + 'px';
	container.style.height = options.height + 'px';

	draw(options.value ?? DEFAULT_KNOB_VALUE);
	function draw(value: number) {
		container.style.backgroundPosition = `0 ${-transform(value) * state.height}px`;
	}

	Object.defineProperty(engine, '__state_knob', {
		get() {
			return state;
		}
	});

	engine.setSrc = (v) => (state.src = v);
	engine.setNumberOfFrames = (v) => (state.numberOfFrames = v);
	engine.setWidth = (v) => (state.width = v);
	engine.setHeight = (v) => (state.height = v);

	return engine;
}
