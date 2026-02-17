import React, { useState } from 'react';
import { SvgKnob } from '@eyewave/web-knobs/react';
import { BoolParam, EnumParam } from '@eyewave/web-knobs/core/params';

export default function () {
	const [value, setValue] = useState(0);

	const fruitParam = new EnumParam(['🍍', '🍉', '🍌', '🍋', '🍇'] as const);
	const filterTypeParam = new EnumParam([
		'Low pass',
		'High pass',
		'Low shelf',
		'High shelf',
		'Bell',
		'Notch',
		'Allpass'
	] as const);

	const booleanParam = new BoolParam();

	return (
		<div>
			<SvgKnob
				value={value}
				onValueChange={setValue}
				snapPoints={fruitParam.snapPoints}
				snapThreshold={fruitParam.snapThreshold}
			/>
			<p>{fruitParam.denormalize(value)}</p>

			<SvgKnob value={value} onValueChange={setValue} {...filterTypeParam.knobProps} />
			<p>{filterTypeParam.denormalize(value)}</p>

			<SvgKnob value={value} onValueChange={setValue} {...booleanParam.knobProps} />
			<p>{booleanParam.denormalize(value)}</p>
		</div>
	);
}
