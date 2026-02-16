<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		component: () => Promise<{ default: unknown }>;
	};

	const { component }: Props = $props();

	onMount(() => component().then(console.log));
</script>

hello
