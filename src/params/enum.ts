import { clamp } from '../helpers.js';
import type { KnobProps } from './base.js';
import { Param } from './base.js';

export type VariantsOf<T> = T extends EnumParam<infer U> ? U[number] : never;
export class EnumParam<T extends readonly string[]> extends Param<T[number]> {
	#variants: T;
	#dictionary: Record<T[number], number>;
	#dictSize: number;

	public get snapPoints(): number[] {
		return this.#variants.map<number>((v) => this.normalize(v));
	}

	public get snapThreshold(): number {
		return 1.0 / (this.#variants.length - 1.0);
	}

	public get knobProps(): KnobProps {
		return {
			snapPoints: this.snapPoints,
			snapThreshold: this.snapThreshold
		};
	}

	constructor(variants: T) {
		super();

		this.#variants = variants;
		this.#dictionary = {} as Record<T[number], number>;
		this.#dictSize = variants.length;

		for (let i = 0; i < variants.length; i++) {
			// biome-ignore lint/style/noNonNullAssertion: this is guaranteed to work
			const name: T[number] = variants[i]!;

			this.#dictionary[name] = i;
		}
	}

	public normalize(value: T[number]): number {
		const index = this.#dictionary[value];
		if (index === undefined) throw new Error(`Value "${value}" is not a valid variant.`);

		return index / (this.#dictSize - 1);
	}

	public denormalize(value: number): T[number] {
		const clampedValue = clamp(value, 0.0, 1.0);
		const index = Math.round(clampedValue * (this.#dictSize - 1));

		// biome-ignore lint/style/noNonNullAssertion: this is guaranteed to work
		return this.#variants[index]!;
	}
}
