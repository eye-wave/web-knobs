export abstract class Param<T> {
	public abstract normalize(value: T): number;
	public abstract denormalize(value: number): T;
}

export type KnobProps = {
	snapPoints: number[];
	snapThreshold: number;
};
