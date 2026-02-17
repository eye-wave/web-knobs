import { SvgKnob } from '@eyewave/web-knobs/react';
import { useState } from 'react';

export function Basic() {
	let [value, setValue] = useState(0.0);

	return (
		<div>
			<SvgKnob value={value} onValueChange={setValue} />
			<span>{value.toFixed(2)}</span>

			<SvgKnob value={value} onValueChange={setValue} disabled />
		</div>
	);
}
