export type DraggableProps = {
	/**
	 * Normalized value of the component.
	 */
	value?: number;

	/**
	 * Readonly smoothed value
	 */
	valueSmoothed?: number;

	weight?: number;

	/**
	 * The increment or decrement value for keyboard interactions.
	 * Defaults to `0.05` if not specified.
	 */
	step?: number;

	/**
	 * Optional: specific values the knob will snap to.
	 */
	snapPoints?: Array<number>;

	snapThreshold?: number;

	invertWheel?: boolean;

	/**
	 * Initial value for the component.
	 */
	defaultValue?: number;

	/**
	 * Disables all interactivity for the component.
	 * When set to `true`, the component will be non-interactive,
	 */
	disabled?: boolean;
};

type Events = {
	onDragStart: void;
	onValueChange: number;
	onPropChange: DraggableProps;
};

type EventName = keyof Events;
type Listener<T> = (payload: T) => void;

const SHIELD_STYLES = 'position:fixed;inset:0;width:100vw;height:100vh;cursor:grab';

export class Draggable {
	private listeners: {
		[K in keyof Events]?: Listener<Events[K]>[];
	} = {};

	// private value = $bindable(0.5);
	// private valueSmoothed = $bindable(0.5);
	private isDisabled = false;
	private invertWheel = false;
	private step = 0.05;
	private snapThreshold = 0.08;
	private weight = 200;
	private defaultValue = 0.5;
	private snapPoints = [0.0, 1.0];

	private isDragging = false;
	// private isShieldOn = $state(false);
	private startX: number = 0;
	private startY: number = 0;
	private startValue: number = 0;

	constructor() {}

	public on(event: EventName, fn: Listener<Events[EventName]>) {
		(this.listeners[event] ??= []).push(fn);
	}

	public off(event: EventName, fn: Listener<Events[EventName]>): void {
		const arr = this.listeners[event];
		if (!arr) return;

		// @ts-ignore
		this.listeners[event] = arr.filter((l) => l !== fn);
	}

	private emit(event: EventName, payload: Events[EventName]): void {
		const arr = this.listeners[event];
		if (!arr) return;

		// @ts-ignore
		for (const fn of arr) fn(payload);
	}

	public handleDblClick() {}
	public handleKeyDown() {}
	public handleMouseDown() {}
	public handleTouchStart() {}
	public handleWheel() {}
}

function toMobile(handler: ({ clientY }: MouseEvent) => void | boolean) {
	return (event: TouchEvent) => {
		const touch = event.touches?.[0];
		if (!touch) return;
		const clientY = touch.clientY;
		const clientX = touch.clientX;
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		handler({ clientY, clientX } as MouseEvent) && event.preventDefault();
	};
}
