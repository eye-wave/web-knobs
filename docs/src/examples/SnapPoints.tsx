import { useState } from 'react';
import { SvgKnob } from '@eyewave/web-knobs/react';

export default function SnapKnob() {
	const [value, setValue] = useState(0.0);

	return (
		<div>
			<SvgKnob value={value} onValueChange={setValue} snapPoints={[0.5]} />
			<span>{value.toFixed(2)}</span>
		</div>
	);
}
