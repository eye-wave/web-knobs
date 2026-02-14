export type WithSilent<T> = T & {
	[K in keyof T as `${Extract<K, string>}Silent`]: (v: T[K]) => void;
};

export function addReactive<T>(
	// biome-ignore lint/suspicious/noExplicitAny: this 'any' is safe, special types are overriding it later in the code
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

	instantCall && callback?.(init);
}
