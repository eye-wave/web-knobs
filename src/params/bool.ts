import { Param, type KnobProps } from './base.js';

export class BoolParam extends Param<boolean> {
	public readonly snapPoints: number[] = [0.0, 1.0] as const;
	public readonly snapThreshold: number = 0.5 as const;

	public get knobProps(): KnobProps {
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
