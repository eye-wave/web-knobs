<template>
	<div>
		<SvgKnob v-model="value" />
		<span>{{ value.toFixed(2) }}</span>

		<SvgKnob v-model="value" :disabled="true" />
	</div>
</template>

<script>
import { ref } from 'vue';
import SvgKnob from '@eyewave/web-knobs/vue';

export default {
	components: { SvgKnob },
	setup() {
		const value = ref(0.0);
		return { value };
	}
};
</script>

<style scoped>
div {
	color: #22bfee;
}
</style>
