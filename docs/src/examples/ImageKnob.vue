<template>
	<ImageKnob v-model="value" src="/web-knobs/PurpleKnob2.webp" :width="90" :height="90" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ImageKnob } from '@eyewave/web-knobs/vue';

const value = ref(0.0);
</script>
