<script lang="ts">
	import { LinearParam, LogParam } from '@eyewave/web-knobs/core/params';
	import { SvgKnob } from '@eyewave/web-knobs/svelte';

	let value = $state(0.0);

	const freqParam = new LogParam(20, 20_000, 10);
	const linParam = new LinearParam(0, 100);
</script>

<section>
	<div>
		<SvgKnob bind:value />
		<span>{freqParam.denormalize(value) | 0}hz</span>
	</div>

	<div>
		<SvgKnob bind:value />
		<span>{linParam.denormalize(value) | 0}%</span>
	</div>
</section>

<style>
	section {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
</style>
