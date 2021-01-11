<template>
	<div class="conversor">
		<div class="source-value">
			<md-field class="input">
				<label>Value to be converted</label>
				<md-input v-model="valueToBeConverted" type="number" min="0" step="0.01" />
			</md-field>
			<md-button class="md-icon-button md-accent" aria-label="clear">
				<md-icon role="img" aria-label="clear">close</md-icon>
				<md-tooltip md-direction="bottom">Clear</md-tooltip>
			</md-button>
		</div>

		<div class="from-to">
			<div class="from">
				<span>Convert from</span>
				<md-field class="input">
					<md-select v-model="convertFrom" aria-label="convert from">
						<md-option v-for="currency of availableCurrencies" :key="currency.code"
							:value="currency.code">
							{{ currency.description }} - {{ currency.code }}
						</md-option>
					</md-select>
				</md-field>
			</div>

			<div class="to">
				<span>to</span>
				<md-field class="input">
					<md-select v-model="convertTo" aria-label="convert to">
						<md-option v-for="currency of availableTargetCurrencies" :key="currency.code"
							:value="currency.code">
							{{ currency.description }} - {{ currency.code }}
						</md-option>
					</md-select>
				</md-field>
			</div>

			<md-button class="md-icon-button md-accent swap" aria-label="swap source and target">
				<md-icon role="img" aria-label="swap source and target">swap_horiz</md-icon>
				<md-tooltip md-direction="bottom">swap source and target</md-tooltip>
			</md-button>
		</div>

		<div class="buttons-panel">
			<ButtonsPanel />
		</div>

		<div class="converted-value">
			<md-field>
				<label>Converted value</label>
				<md-input :value="convertedValue" readonly />
			</md-field>
		</div>

		<div class="details">
			<p>
				Exchange rate:
				<strong>{{ 0 }}</strong>
			</p>
			<p>
				IOF (1.1% of value to be converted):
				<strong>{{ 0 }}</strong>
			</p>
			<p>
				FX (1% of value to be converted):
				<strong>{{ 0 }}</strong>
			</p>
		</div>

		<div class="calculation">
			<p>
				convertedValue = (valueToBeConverted - iof - fx) * exchangeRate
			</p>
			<p class="result">
				{{ convertedValue }} = ({{ valueToBeConverted }} - {{ iof }} - {{ fx }}) * {{ exchangeRate }}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ButtonsPanel from './ButtonsPanel.vue'

@Component({
	components: {
		ButtonsPanel
	}
})
export default class Conversor extends Vue {

	availableCurrencies = [
		{ code: 'BRL', description: 'Reais brasileiros', symbol: 'R$' },
		{ code: 'USD', description: 'American dolars', symbol: 'US$' },
		{ code: 'EUR', description: 'Euros', symbol: '€' },
	];

	convertFrom = this.availableCurrencies[0].code;
	convertTo = this.availableCurrencies[1].code;

	valueToBeConverted = 0.0;

	get availableTargetCurrencies() {
		return this.availableCurrencies.filter(currency => currency.code !== this.convertFrom);
	}

	get exchangeRate() {
		return 0.0;
	}
	get iof() {
		return 0.0;
	}

	get fx() {
		return 0.0;
	}

	get convertedValue() {
		return 0.0;
	}
}
</script>

<style lang="scss" scoped>
.conversor {
	.source-value {
		display: flex;
		align-items: center;

		.input {
			flex-grow: 1;
		}
	}

	.from-to {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: baseline;
		width: 100%;
		margin-top: -20px;
		margin-bottom: 20px;

		.from, .to {
			display: flex;
			align-items: baseline;
			
			span {
				text-align: right;
			}
		}

		.from .input, .to .input {
			width: 200px;
			margin: 0 15px;
			overflow-x: ellipsis;
		}

		.swap {
			margin: 0 -10px;
		}

		@media (max-width: 610px) {
			justify-content: flex-end;

			.from, .to {
				width: 100%;
				justify-content: flex-end;
			}

			.swap {
				margin: 0;
			}
		}
	}

	.converted-value {
		max-width: calc(100% - 40px - 12px); // to align with value to be converted (subtract button width and margin)
		margin: 20px 0;
	}

	.buttons-panel {
		margin: 20px auto;
	}

	.details {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		max-width: 800px;
		margin: 20px auto;

		p {
			margin: 5px 20px;
		}
	}

	.calculation {
		text-align: center;
		margin: 10px auto;

		.result {
			margin: 10px 0;
		}
	}
}
</style>