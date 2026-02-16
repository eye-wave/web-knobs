import {
	createDraggable,
	DEFAULT_KNOB_VALUE,
	type DraggableApi,
	type DraggableOptions
} from '../draggable';
import {
	addReactive,
	describeArc,
	polarToCartesian,
	valueToAngle,
	type WithSilent
} from '../helpers';

export const DEFAULT_SIZE = 80;
export const DEFAULT_BG_COLOR = '#333';
export const DEFAULT_DISABLED_COLOR = '#777';
export const DEFAULT_MIN_ANGLE = -135;
export const DEFAULT_MAX_ANGLE = 135;
export const DEFAULT_SNAP_POINT_LENGTH = 0.44;
export const DEFAULT_CIRCLE_RADIUS = 0.32;
export const DEFAULT_ARC_RADIUS = 0.4;
export const DEFAULT_POINTER_LENGTH = 0;

export type SvgKnobReactive = {
	/**
	 * Size of the knob in pixels.
	 * Default size is 80.
	 */
	size?: number;

	snapPointLength?: number;
	circleRadius?: number;
	arcRadius?: number;

	pointerLength?: number;

	/**
	 * Background color of the knob.
	 * Default color is #333
	 */
	bgColor?: string;

	/**
	 * Disabled color for the knob.
	 * Default color is #777
	 */
	disabledColor?: string;

	/**
	 * Starting angle for the knob in degrees ( when the value is 0.0 ).
	 * Default minAngle is -135
	 */
	minAngle?: number;

	/**
	 * Ending angle for the knob in degrees ( when the value is 1.0 ).
	 * Default maxAngle is 135
	 */
	maxAngle?: number;
};

export type SvgKnobApi = DraggableApi & {
	readonly __knob_state: SvgState;
	setArcRadius: (v: number) => void;
	setBgColor: (v: string) => void;
	setCircleRadius: (v: number) => void;
	setDisabledColor: (v: string) => void;
	setMaxAngle: (v: number) => void;
	setMinAngle: (v: number) => void;
	setPointerLength: (v: number) => void;
	setSize: (v: number) => void;
	setSnapPointLength: (v: number) => void;
};

export type SvgKnobOptions = DraggableOptions & {
	onArcRadiusChange?: (v: number) => void;
	onBgColorChange?: (v: string) => void;
	onCircleRadiusChange?: (v: number) => void;
	onDisabledColorChange?: (v: string) => void;
	onMaxAngleChange?: (v: number) => void;
	onMinAngleChange?: (v: number) => void;
	onPointerLengthChange?: (v: number) => void;
	onSizeChange?: (v: number) => void;
	onSnapPointLengthChange?: (v: number) => void;
} & SvgKnobReactive;

type SvgStateRaw = Required<SvgKnobReactive>;
type SvgState = WithSilent<SvgStateRaw>;

export function createSvgKnob<E extends HTMLElement>(
	container: E,
	options: SvgKnobOptions = {}
): SvgKnobApi {
	const state = {} as SvgState;

	const ns = 'http://www.w3.org/2000/svg';

	const svg = document.createElementNS(ns, 'svg');
	svg.setAttribute('stroke-linecap', 'round');
	svg.setAttribute('stroke-linejoin', 'round');

	const circle = document.createElementNS(ns, 'circle');
	const knobArc = document.createElementNS(ns, 'path');
	const knobArcFilled = document.createElementNS(ns, 'path');
	const snapPoints = document.createElementNS(ns, 'path');
	const snapPointsActive = document.createElementNS(ns, 'path');
	const indicator = document.createElementNS(ns, 'line');

	knobArc.setAttribute('fill', 'none');
	knobArcFilled.setAttribute('fill', 'none');

	snapPointsActive.setAttribute('stroke', 'currentColor');

	svg.append(circle);
	svg.append(knobArc);
	svg.append(knobArcFilled);
	svg.append(snapPoints);
	svg.append(snapPointsActive);
	svg.append(indicator);

	container.append(svg);

	const engine = createDraggable(container, {
		...options,
		onValueChange(v) {
			options.onValueChange?.(v);
			draw(v);
		}
	}) as SvgKnobApi;

	addReactive(
		state,
		'arcRadius',
		options.arcRadius ?? DEFAULT_ARC_RADIUS,
		(r) => {
			options.onArcRadiusChange?.(r);
			draw(engine.__state.value);
		},
		false
	);

	const bgColorCallback = (color: string) => {
		knobArc.setAttribute('stroke', color);
		snapPoints.setAttribute('stroke', color);
		circle.setAttribute('fill', color);
	};

	bgColorCallback(options.bgColor ?? DEFAULT_BG_COLOR);
	addReactive(
		state,
		'bgColor',
		options.bgColor ?? DEFAULT_BG_COLOR,
		(color) => {
			options.onBgColorChange?.(color);
			bgColorCallback(color);
			draw(engine.__state.value);
		},
		false
	);

	addReactive(
		state,
		'circleRadius',
		options.circleRadius ?? DEFAULT_CIRCLE_RADIUS,
		(r) => {
			options.onCircleRadiusChange?.(r);
			draw(engine.__state.value);
		},
		false
	);

	const disabledColorCallback = (color: string) => {
		const stroke = engine.__state.disabled ? color : 'currentColor';

		knobArcFilled.setAttribute('stroke', stroke);
		indicator.setAttribute('stroke', stroke);
	};

	disabledColorCallback(options.disabledColor ?? DEFAULT_DISABLED_COLOR);
	addReactive(
		state,
		'disabledColor',
		options.disabledColor ?? DEFAULT_DISABLED_COLOR,
		(color) => {
			options.onDisabledColorChange?.(color);
			disabledColorCallback(color);
			draw(engine.__state.value);
		},
		false
	);

	addReactive(
		state,
		'maxAngle',
		options.maxAngle ?? DEFAULT_MAX_ANGLE,
		(a) => {
			options.onMaxAngleChange?.(a);
			draw(engine.__state.value);
		},
		false
	);
	addReactive(
		state,
		'minAngle',
		options.minAngle ?? DEFAULT_MIN_ANGLE,
		(a) => {
			options.onMinAngleChange?.(a);
			draw(engine.__state.value);
		},
		false
	);
	addReactive(
		state,
		'pointerLength',
		options.pointerLength ?? DEFAULT_POINTER_LENGTH,
		(pl) => {
			options.onPointerLengthChange?.(pl);
			draw(engine.__state.value);
		},
		false
	);

	const sizeCallback = (size: number) => {
		svg.setAttribute('width', size + 'px');
		svg.setAttribute('height', size + 'px');
		svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
		svg.setAttribute('stroke-width', (size * 0.06).toPrecision(2));

		const c = size / 2;
		const circleRadius = size * state.circleRadius;

		circle.setAttribute('cx', c.toPrecision(2));
		circle.setAttribute('cy', c.toPrecision(2));
		circle.setAttribute('r', circleRadius.toPrecision(2));
	};

	sizeCallback(options.size ?? DEFAULT_SIZE);
	addReactive(
		state,
		'size',
		options.size ?? DEFAULT_SIZE,
		(size) => {
			options.onSizeChange?.(size);
			sizeCallback(size);
			draw(engine.__state.value);
		},
		false
	);

	addReactive(
		state,
		'snapPointLength',
		options.snapPointLength ?? DEFAULT_SNAP_POINT_LENGTH,
		(spl) => {
			options.onSnapPointLengthChange?.(spl);
			draw(engine.__state.value);
		},
		false
	);

	Object.freeze(state);

	draw(options.value ?? DEFAULT_KNOB_VALUE);
	function draw(value: number) {
		const c = state.size / 2;
		const circleRadius = state.size * state.circleRadius;
		const arcRadius = state.size * state.arcRadius;

		const angles: [number, number] = [state.minAngle, state.maxAngle];

		// Indicator
		{
			const [x1, y1] = polarToCartesian(c, c, circleRadius * 0.8, valueToAngle(value, ...angles));

			const [x2, y2] = polarToCartesian(
				c,
				c,
				circleRadius * 0.8 - state.pointerLength * state.size * 0.52,
				valueToAngle(value, ...angles)
			);

			indicator.setAttribute('x1', x1.toPrecision(2));
			indicator.setAttribute('y1', y1.toPrecision(2));
			indicator.setAttribute('x2', x2.toPrecision(2));
			indicator.setAttribute('y2', y2.toPrecision(2));
		}

		// Arc
		{
			const path = describeArc(c, c, arcRadius, 1.0, ...angles);
			knobArc.setAttribute('d', path);
		}

		// Arc filled
		{
			const path = describeArc(c, c, arcRadius, value, ...angles);
			knobArcFilled.setAttribute('d', path);
		}

		// Snap points
		{
			const snapRadius = state.size * state.snapPointLength;

			let inactivePath = '';
			let activePath = '';

			for (const p of engine.__state.snapPoints ?? []) {
				const [x1, y1] = polarToCartesian(c, c, arcRadius, valueToAngle(p, ...angles));
				const [x2, y2] = polarToCartesian(c, c, snapRadius, valueToAngle(p, ...angles));

				if (value >= p) {
					activePath += `M ${x1} ${y1} L ${x2} ${y2}`;
				} else {
					inactivePath += `M ${x1} ${y1} L ${x2} ${y2}`;
				}
			}

			snapPoints.setAttribute('d', inactivePath);
			snapPointsActive.setAttribute('d', activePath);
		}
	}

	Object.defineProperty(engine, '__knob_state', {
		get() {
			return state;
		}
	});

	engine.setArcRadius = (v) => state.arcRadiusSilent(v);
	engine.setBgColor = (v) => state.bgColorSilent(v);
	engine.setCircleRadius = (v) => state.circleRadiusSilent(v);
	engine.setDisabledColor = (v) => state.disabledColorSilent(v);
	engine.setMaxAngle = (v) => state.maxAngleSilent(v);
	engine.setMinAngle = (v) => state.minAngleSilent(v);
	engine.setPointerLength = (v) => state.pointerLengthSilent(v);
	engine.setSize = (v) => state.sizeSilent(v);
	engine.setSnapPointLength = (v) => state.snapPointLengthSilent(v);

	return engine;
}
