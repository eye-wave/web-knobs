import { useState } from 'react';
import { SvgKnob } from '@eyewave/web-knobs/react';

export default function () {
	const [value, setValue] = useState(0.0);

	return (
		<div style={{ color: '#22bfee' }}>
			<SvgKnob value={value} onValueChange={setValue} />
			<span>{value.toFixed(2)}</span>

			<SvgKnob value={value} disabled />
		</div>
	);
}
