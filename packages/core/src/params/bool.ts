import { Param } from './base';

export class BoolParam extends Param<boolean> {
	constructor() {
		super();
	}

	public readonly snapPoints = [0.0, 1.0];
	public readonly snapThreshold = 0.5;

	public get knobProps() {
		return {
			snapPoints: this.snapPoints,
			snapThreshold: this.snapThreshold
		};
	}

	public normalize(value: boolean): number {
		return value ? 1.0 : 0.0;
	}

	public denormalize(value: number): boolean {
		return value > 0.5;
	}
}
