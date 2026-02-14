import { clamp } from './helpers';

export const DEFAULT_KNOB_VALUE = 0.5;
export const DEFAULT_KNOB_STEP = 0.05;
export const DEFAULT_KNOB_SNAP_THRESHOLD = 0.08;
export const DEFAULT_KNOB_WEIGHT = 200;

export type DraggableReactive = {
	/**
	 * Normalized value, ranged in 0.0 to 1.0 of the component.
	 */
	value?: number;

	/**
	 * Disables all interactivity for the component.
	 * When set to `true`, the component will be non-interactive.
	 */
	disabled?: boolean;

	/**
	 * Initial normalized value for the component.
	 */
	defaultValue?: number;

	/**
	 * Inverts the direction of the wheel event.
	 */
	invertWheel?: boolean;

	/**
	 * The increment or decrement value for keyboard interactions.
	 * Defaults to `0.05` if not specified.
	 */
	step?: number;

	/**
	 * Specific values that the knob will snap to.
	 */
	snapPoints?: number[];

	/**
	 * Strength of the snapping.
	 */
	snapThreshold?: number;

	/**
	 * Weight of the knob, determines how fast it moves when dragged.
	 */
	weight?: number;
};

export type DraggableApi = {
	destroy: () => void;

	setValue: (v: number) => void;
	setDisabled: (v: boolean) => void;
	setDefaultValue: (v: number) => void;
	setInvertWheel: (v: boolean) => void;
	setStep: (v: number) => void;
	setSnapPoints: (v: number[]) => void;
	setSnapThreshold: (v: number) => void;
	setWeight: (v: number) => void;
};

export type DraggableOptions = {
	onValueChange?: (v: number) => void;
	onDisabledChange?: (v: boolean) => void;
	onDefaultValueChange?: (v: number) => void;
	onInvertWheelChange?: (v: boolean) => void;
	onStepChange?: (v: number) => void;
	onSnapPointsChange?: (v: number[]) => void;
	onSnapThresholdChange?: (v: number) => void;
	onWeightChange?: (v: number) => void;
};

// biome-ignore lint/suspicious/noExplicitAny: this 'any' is safe, special types are overriding it later in the code
function addReactive<T>(api: any, fieldName: string, init: T, callback?: (v: T) => void) {
	let value = init;

	Object.defineProperty(api, fieldName, {
		get() {
			return value;
		},
		set(v: T) {
			value = v;
			callback?.(v);
		},
		configurable: false,
		enumerable: false
	});

	api[fieldName + 'Silent'] = (v: T) => {
		value = v;
	};
}

type DragStateRaw = {
	value: number;
	isDisabled: boolean;
	defaultValue: number;
	invertWheel: boolean;
	step: number;
	snapPoints: number[];
	snapThreshold: number;
	weight: number;
};

type WithSilent<T> = T & {
	[K in keyof T as `${Extract<K, string>}Silent`]: (v: T[K]) => void;
};

type DragState = WithSilent<DragStateRaw>;

export function createDraggable<E extends HTMLElement>(
	container: E,
	options: DraggableOptions = {}
): DraggableApi {
	const shield = createShield();

	container.style.width = 'fit-content';
	container.style.cursor = 'grab';

	container.role = 'slider';
	container.tabIndex = 0;
	container.draggable = false;

	// State
	const s = {} as DragState;
	addReactive(s, 'value', DEFAULT_KNOB_VALUE, (value) => {
		options.onValueChange?.(value);
		container.ariaValueNow = value.toPrecision(2);
	});
	addReactive(s, 'isDisabled', false, (isDisabled) => {
		options.onDisabledChange?.(isDisabled);
		container.style.cursor = isDisabled ? 'auto' : 'grab';
	});
	addReactive(s, 'defaultValue', DEFAULT_KNOB_VALUE, options.onDefaultValueChange);
	addReactive(s, 'invertWheel', false, options.onInvertWheelChange);
	addReactive(s, 'step', DEFAULT_KNOB_STEP, options.onStepChange);
	addReactive(s, 'snapPoints', [], options.onSnapPointsChange);
	addReactive(s, 'snapThreshold', DEFAULT_KNOB_SNAP_THRESHOLD, options.onSnapThresholdChange);
	addReactive(s, 'weight', DEFAULT_KNOB_WEIGHT, options.onWeightChange);

	Object.freeze(s);

	// Helper values
	let isDragging = false,
		startX = 0,
		startY = 0,
		startValue = DEFAULT_KNOB_VALUE;

	// Methods
	const abort = new AbortController();

	function init() {
		container.addEventListener('dblclick', handleDblClick, { signal: abort.signal });
		container.addEventListener('keydown', handleKeyDown, { signal: abort.signal });
		container.addEventListener('mousedown', handleMouseDown, { signal: abort.signal });
		container.addEventListener('touchstart', handleTouchStart, { signal: abort.signal });
		container.addEventListener('wheel', handleWheel, { signal: abort.signal });

		window.addEventListener('mousemove', handleMouseMove, { signal: abort.signal });
		window.addEventListener('mouseup', handleMouseUp, { signal: abort.signal });
		window.addEventListener('touchend', handleMouseUp, { signal: abort.signal });
		window.addEventListener('touchmove', handleTouchMove, { signal: abort.signal });
	}

	function destroy() {
		abort.abort();
	}

	function snap(value: number, snapPoints?: Array<number>) {
		if (!snapPoints?.length) return value;
		for (const point of snapPoints) {
			const diff = Math.abs(point - value);
			if (diff < s.snapThreshold) {
				return point;
			}
		}

		return value;
	}

	function handleMouseDown(e: MouseEvent) {
		if (s.isDisabled) return;

		isDragging = true;
		startX = e.clientX;
		startY = e.clientY;

		startValue = s.value;

		return true;
	}

	let wasHorizontal = true;

	function handleMouseMove({ clientY, clientX, altKey }: MouseEvent) {
		if (s.isDisabled || !isDragging) return;
		shield.show();

		const dy = startY - clientY;
		const dx = -(startX - clientX);

		const isHorizontal = Math.abs(dx) > Math.abs(dy);

		if (isHorizontal !== wasHorizontal) {
			startX = clientX;
			startY = clientY;
			startValue = s.value;
		}

		wasHorizontal = isHorizontal;

		const delta = isHorizontal ? dx : dy;
		const deltaValue = delta / s.weight;

		if (!altKey && s.snapPoints) {
			s.value = clamp(snap(startValue + deltaValue, s.snapPoints));
		} else {
			s.value = clamp(startValue + deltaValue);
		}

		return true;
	}

	function handleWheel(e: WheelEvent) {
		if (s.isDisabled) return;
		e.preventDefault();

		const delta = (e.deltaY > 0 ? 1.0 : -1.0) * (s.invertWheel ? -1.0 : 1.0);

		s.value = clamp(snap(s.value + delta * s.step, s.snapPoints));
	}

	function handleMouseUp() {
		isDragging = false;
		shield.hide();
	}

	function handleDblClick() {
		if (s.isDisabled) return;
		if (s.defaultValue) s.value = s.defaultValue;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (s.isDisabled) return;
		if (e.key === 'Escape') {
			if (e?.currentTarget && 'blur' in e.currentTarget) {
				(e.currentTarget as HTMLElement)?.blur();
			}
		}

		const isPointingLeft = e.key === 'ArrowLeft' || e.key === 'ArrowDown';
		const isPointingRight = e.key === 'ArrowRight' || e.key === 'ArrowUp';

		if (isPointingLeft || isPointingRight) e.preventDefault();

		if (!e.altKey && s.snapPoints) {
			let next = s.snapPoints.findIndex((n) => n >= s.value);

			next += +isPointingRight;
			next -= +isPointingLeft;

			next = clamp(next, 0, s.snapPoints.length - 1);

			s.value = s.snapPoints[next];
		} else {
			s.value += +isPointingRight * s.step - +isPointingLeft * s.step;
		}

		s.value = clamp(s.value);
	}

	const handleTouchStart = toMobile(handleMouseDown);
	const handleTouchMove = toMobile(handleMouseMove);

	init();

	return {
		destroy,
		setValue: (v) => s.valueSilent(v),
		setDisabled: (v) => s.isDisabledSilent(v),
		setDefaultValue: (v) => s.defaultValueSilent(v),
		setInvertWheel: (v) => s.invertWheelSilent(v),
		setStep: (v) => s.stepSilent(v),
		setSnapPoints: (v) => s.snapPointsSilent(v),
		setSnapThreshold: (v) => s.snapThresholdSilent(v),
		setWeight: (v) => s.weightSilent(v)
	};
}

function createShield() {
	const shield = document.createElement('div');

	shield.style = 'position:fixed;inset:0;width:100vw;height:100vh;cursor:grab';

	return {
		show() {
			document.body.append(shield);
			document.body.style.userSelect = 'none';
		},
		hide() {
			document.body.style.userSelect = '';
			shield.remove();
		}
	};
}

function toMobile(handler: ({ clientY }: MouseEvent) => undefined | boolean) {
	return (event: TouchEvent) => {
		const touch = event.touches?.[0];
		if (!touch) return;
		const clientY = touch.clientY;
		const clientX = touch.clientX;

		handler({ clientY, clientX } as MouseEvent) && event.preventDefault();
	};
}
