<script lang="ts">
	import { BoolParam, EnumParam } from '@eyewave/web-knobs/core/params';
	import { SvgKnob } from '@eyewave/web-knobs/svelte';

	let value = $state(0);

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
</script>

<SvgKnob bind:value snapPoints={fruitParam.snapPoints} snapThreshold={fruitParam.snapThreshold} />
<p>{fruitParam.denormalize(value)}</p>

<SvgKnob bind:value {...filterTypeParam.knobProps} />
<p>{filterTypeParam.denormalize(value)}</p>

<SvgKnob bind:value {...booleanParam.knobProps} />
<p>{booleanParam.denormalize(value)}</p>
