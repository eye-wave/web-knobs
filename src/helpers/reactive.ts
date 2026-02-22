export function addReactive<T>(
	// biome-ignore lint/suspicious/noExplicitAny: this 'any' is required because astro doesn't have a Component type
	api: any,
	fieldName: string,
	init: T,
	callback?: (v: T) => void,
	instantCall = true
): void {
	let value = init;

	Object.defineProperty(api, fieldName, {
		get() {
			return value;
		},
		set(v: T) {
			if (value !== v) callback?.(v);
			value = v;
		},
		configurable: false,
		enumerable: false
	});

	instantCall && callback?.(init);
}

type Defined<T> = T extends undefined ? never : T;

export type PropsToApi<T, State extends string> = {
	[K in keyof Required<T> as K extends string ? `set${Capitalize<K>}` : never]-?: (
		v: Defined<Required<T>[K]>
	) => void;
} & {
	readonly [K in `__state${State}`]: Required<T>;
};

export type PropsToOptions<T> = {
	[K in keyof T as K extends string ? `on${Capitalize<K>}Change` : never]: (
		v: Defined<T[K]>
	) => void;
} & T;
