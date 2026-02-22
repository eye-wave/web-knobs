import { useState } from 'react';
import { SvgKnob } from '@eyewave/web-knobs/react';
import { LinearParam, LogParam } from '@eyewave/web-knobs/core/params';

export default function () {
	const [value, setValue] = useState(0.0);

	const freqParam = new LogParam(20, 20_000, 10);
	const linParam = new LinearParam(0, 100);

	return (
		<section style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
			<div>
				<SvgKnob value={value} onValueChange={setValue} />
				<span>{Math.floor(freqParam.denormalize(value))}hz</span>
			</div>

			<div>
				<SvgKnob value={value} onValueChange={setValue} />
				<span>{Math.floor(linParam.denormalize(value))}%</span>
			</div>
		</section>
	);
}
