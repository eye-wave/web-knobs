import React, { useState } from 'react';
import { ImageKnob } from '@eyewave/web-knobs/react';

export default function () {
	const [value, setValue] = useState(0.0);

	return (
		<ImageKnob
			value={value}
			onValueChange={setValue}
			src="/web-knobs/PurpleKnob2.webp"
			width={90}
			height={90}
		/>
	);
}
