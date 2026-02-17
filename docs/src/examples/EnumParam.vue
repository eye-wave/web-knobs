<template>
	<SvgKnob
		v-model="value"
		:snapPoints="fruitParam.snapPoints"
		:snapThreshold="fruitParam.snapThreshold"
	/>
	<p>{{ fruitParam.denormalize(value) }}</p>

	<SvgKnob v-model="value" v-bind="filterTypeParam.knobProps" />
	<p>{{ filterTypeParam.denormalize(value) }}</p>

	<SvgKnob v-model="value" v-bind="booleanParam.knobProps" />
	<p>{{ booleanParam.denormalize(value) }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BoolParam, EnumParam } from '@eyewave/web-knobs/core/params';
import { SvgKnob } from '@eyewave/web-knobs/vue';

const value = ref(0);

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
