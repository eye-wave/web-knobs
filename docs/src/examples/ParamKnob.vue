<template>
	<section>
		<div>
			<SvgKnob v-model="value" />
			<span>{{ Math.floor(freqParam.denormalize(value)) }} Hz</span>
		</div>

		<div>
			<SvgKnob v-model="value" />
			<span>{{ Math.floor(linParam.denormalize(value)) }}%</span>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { LinearParam, LogParam } from '@eyewave/web-knobs/core/params';
import { SvgKnob } from '@eyewave/web-knobs/vue';

const value = ref(0.0);

const freqParam = new LogParam(20, 20000, 10);
const linParam = new LinearParam(0, 100);
</script>

<style scoped>
section {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
}
</style>
