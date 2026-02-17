<template>
	<div>
		<SvgKnob v-model="value" :snapPoints="[0.5]" />
		<span>{{ value.toFixed(2) }}</span>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SvgKnob } from '@eyewave/web-knobs/vue';

const value = ref(0.0);
</script>
