export function addReactive<T>(
	// this 'any' is safe, special types are overriding it later in the code
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
			if (value != v) callback?.(v);
			value = v;
		},
		configurable: false,
		enumerable: false
	});

	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	instantCall && callback?.(init);
}

type Defined<T> = T extends undefined ? never : T;

export type PropsToApi<T, State extends string> = {
	[K in keyof T as K extends string ? `set${Capitalize<K>}` : never]: (v: Defined<T[K]>) => void;
} & { readonly [K in `__state${State}`]: Required<T> };

export type PropsToOptions<T> = {
	[K in keyof T as K extends string ? `on${Capitalize<K>}Change` : never]: (
		v: Defined<T[K]>
	) => void;
} & T;
