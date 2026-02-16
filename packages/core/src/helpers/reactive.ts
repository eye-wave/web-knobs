export type WithSilent<T> = T & {
	[K in keyof T as `${Extract<K, string>}Silent`]: (v: T[K]) => void;
};

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
			value = v;
			callback?.(v);
		},
		configurable: false,
		enumerable: false
	});

	api[fieldName + 'Silent'] = (v: T) => {
		value = v;
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	instantCall && callback?.(init);
}
