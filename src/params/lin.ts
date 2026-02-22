import { Param } from './base.js';

export class LinearParam extends Param<number> {
	constructor(
		public min: number = 0.0,
		public max: number = 1.0
	) {
		super();
	}

	public normalize(value: number): number {
		return (value - this.min) / (this.max - this.min);
	}

	public denormalize(value: number): number {
		return value * (this.max - this.min) + this.min;
	}
}
