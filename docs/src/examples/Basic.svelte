<script lang="ts">
	import { SvgKnob } from '@eyewave/web-knobs/svelte';

	let value = $state(0.5);
</script>

<SvgKnob bind:value />
