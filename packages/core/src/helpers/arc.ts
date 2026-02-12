import { clamp } from './clamp';

export function polarToCartesian(
	cx: number,
	cy: number,
	radius: number,
	angleInDegrees: number
): [number, number] {
	const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
	return [cx + radius * Math.cos(angleInRadians), cy + radius * Math.sin(angleInRadians)];
}

export function describeArc(
	cx: number,
	cy: number,
	radius: number,
	value: number,
	minAngle = -135,
	maxAngle = 135
): string {
	const endAngle = valueToAngle(value, minAngle, maxAngle);

	const [sx, sy] = polarToCartesian(cx, cy, radius, endAngle);
	const [ex, ey] = polarToCartesian(cx, cy, radius, minAngle);
	const largeArcFlag = endAngle - minAngle <= 180 ? '0' : '1';
	return ['M', sx, sy, 'A', radius, radius, 0, largeArcFlag, 0, ex, ey].join(' ');
}

export function valueToAngle(value: number, minAngle: number, maxAngle: number): number {
	return (maxAngle - minAngle) * clamp(value) + minAngle;
}
