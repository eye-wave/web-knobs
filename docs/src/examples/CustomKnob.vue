<template>
	<KnobDraggable v-model="value">
		<div class="knob">
			<div
				class="glow"
				:style="{
					filter: `blur(${value * 5}px)`,
					transform: `scale(${value})`
				}"
			></div>
			<div
				class="thumb"
				:style="{
					transform: `rotate(${angle}deg) translateY(-10px)`
				}"
			></div>
			<span>{{ value.toFixed(2) }}</span>
		</div>
	</KnobDraggable>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Draggable as KnobDraggable } from '@eyewave/web-knobs/vue';
import { valueToAngle } from '@eyewave/web-knobs/core/helpers';

const value = ref(0.5);
const angle = computed(() => valueToAngle(value.value, -135, 135));
</script>

<style scoped>
.knob {
	z-index: 0;
	user-select: none;
	width: 60px;
	height: 60px;
	border-radius: 100px;
	background: #000;
	position: relative;
	display: grid;
	place-items: center;
}

.glow,
.thumb {
	z-index: -1;
	position: absolute;
	background: red;
	border-radius: 30px;
}

.glow {
	width: 30px;
	height: 30px;
}

.thumb {
	width: 10px;
	height: 20px;
}
</style>
