import { Param } from './base';

export class LinearParam extends Param<number> {
	constructor(
		public min = 0.0,
		public max = 1.0
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
