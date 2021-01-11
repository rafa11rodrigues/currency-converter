<template>
	<div class="buttons-panel">
		<md-button class="md-icon-button md-dense md-raised md-primary button" v-for="n of digits" :key="n">
			{{ n }}
		</md-button>
		<md-button class="md-icon-button md-dense md-raised md-primary button">
			<md-icon>keyboard_backspace</md-icon>
		</md-button>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class ButtonsPanel extends Vue {

	digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
}
</script>

<style lang="scss" scoped>
@import '@/colors.scss';

$button-size: 35px;
$button-margin: 5px;

.buttons-panel {
	display: flex;
	flex-wrap: wrap;
	width: calc( #{ 3 * ($button-size + 2*$button-margin) } + 2px + 10px );
	padding: 5px;
	border: 0.5px solid $accent;

	.button {
		width: $button-size !important;
		height: 1.1emem;
		line-height: 1.1em;
		margin: $button-margin;
		border-radius: 0;
		font-size: 1.5em;

		&:nth-child(10) {
			width: calc( #{ 2*($button-size + $button-margin )} ) !important;
		}
	}
}
</style>