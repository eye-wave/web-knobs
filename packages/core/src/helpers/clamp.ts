export function clamp(value: number, min = 0.0, max = 1.0): number {
	return Math.max(min, Math.min(max, value));
}
