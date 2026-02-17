import React, { useState, useMemo } from 'react';
import { Draggable } from '@eyewave/web-knobs/react';
import { valueToAngle } from '@eyewave/web-knobs/core/helpers';
import styles from './CustomKnob.module.css';

export default function () {
	const [value, setValue] = useState(0.5);

	const angle = useMemo(() => valueToAngle(value, -135, 135), [value]);

	return (
		<Draggable value={value} onValueChange={setValue}>
			<div className={styles.knob}>
				<div
					className={styles.glow}
					style={{
						filter: `blur(${value * 5}px)`,
						transform: `scale(${value})`
					}}
				></div>
				<div
					className={styles.thumb}
					style={{
						transform: `rotate(${angle}deg) translateY(-10px)`
					}}
				></div>
				<span>{value.toFixed(2)}</span>
			</div>
		</Draggable>
	);
}
