export abstract class Param<T> {
	constructor() {}
	public abstract normalize(value: T): number;
	public abstract denormalize(value: number): T;
}
