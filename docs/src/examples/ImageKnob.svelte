<script lang="ts">
	import { ImageKnob } from '@eyewave/web-knobs/svelte';

	let value = $state(0.0);
</script>

<ImageKnob bind:value src="/PurpleKnob2.webp" width={90} height={90} />
