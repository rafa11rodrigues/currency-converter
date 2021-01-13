<template>
	<div class="conversor">
		<div class="source-value">
			<md-field class="input">
				<label>Value to be converted</label>
				<md-input v-model="valueToBeConverted"
					v-currency="inputConfig"
					@input="updateInputField()"
					@keydown="clearWithEsc($event)"
					ref="inputField" />
			</md-field>
			<md-button class="md-icon-button md-accent" aria-label="clear"
				@click="clear()">
				<md-icon role="img" aria-label="clear">close</md-icon>
				<md-tooltip md-direction="bottom">Clear</md-tooltip>
			</md-button>
		</div>

		<div class="from-to">
			<div class="from">
				<span>Convert from</span>
				<md-field class="input">
					<md-select v-model="convertFrom" aria-label="convert from"
						@md-selected="changeFrom()">
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
					<md-select v-model="convertTo" aria-label="convert to"
						@md-selected="changeTo()">
						<md-option v-for="currency of availableTargetCurrencies" :key="currency.code"
							:value="currency.code">
							{{ currency.description }} - {{ currency.code }}
						</md-option>
					</md-select>
				</md-field>
			</div>

			<md-button class="md-icon-button md-accent swap" aria-label="swap source and target"
				@click="swapFromTo()">
				<md-icon role="img" aria-label="swap source and target">swap_horiz</md-icon>
				<md-tooltip md-direction="bottom">swap source and target</md-tooltip>
			</md-button>
		</div>

		<div class="buttons-panel">
			<ButtonsPanel
				@numberInput="numberInput($event)"
				@backspace="backspace()" />
		</div>

		<div class="converted-value">
			<md-field>
				<label>Converted value</label>
				<md-input v-model="convertedValue" readonly
					v-currency="convertedConfig"
					ref="outputField" />
			</md-field>
		</div>

		<div class="details">
			<p>
				Exchange rate:
				<strong>{{ exchangeRate.toFixed(4) }}</strong>
			</p>
			<p>
				IOF (1.1% of value to be converted):
				<strong>{{ iof.toFixed(2) }}</strong>
			</p>
			<p>
				FX (1% of value to be converted):
				<strong>{{ fx.toFixed(2) }}</strong>
			</p>
		</div>

		<div class="calculation">
			<p>
				convertedValue = (valueToBeConverted - iof - fx) * exchangeRate
			</p>
			<p class="result">
				{{ parsedOutput.toFixed(4) }} = ({{ parsedInput.toFixed(2) }} - {{ iof.toFixed(2) }} - {{ fx.toFixed(2) }}) * {{ exchangeRate.toFixed(4) }}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ButtonsPanel from './ButtonsPanel.vue'
import { CurrencyDirective, setValue, parse } from 'vue-currency-input';
import CurrencyConstants from '@/domain/currency/CurrencyConstants';
import CurrencyService from '@/domain/currency/CurrencyService';

@Component({
	components: {
		ButtonsPanel
	},
	directives: {
		currency: CurrencyDirective
	}
})
export default class Conversor extends Vue {

	availableCurrencies = CurrencyConstants.availableCurrencies;

	convertFrom = this.availableCurrencies[0].code;
	convertTo = this.availableCurrencies[1].code;

	valueToBeConverted = "0";
	convertedValue = "0";

	parsedInput = 0;
	parsedOutput = 0;

	get availableTargetCurrencies() {
		return this.availableCurrencies.filter(currency => currency.code !== this.convertFrom);
	}

	get exchangeRate() {
		return CurrencyService.exchangeRate(this.convertFrom, this.convertTo) || 0;
	}

	get iof() {
		return CurrencyService.iofValue(this.parsedInput);
	}

	get fx() {
		return CurrencyService.fxValue(this.parsedInput);
	}

	get inputConfig() {
		return {
			currency: {
				prefix: CurrencyConstants.symbols[this.convertFrom]
			},
			precision: 2,
			allowNegative: false,
			distractionFree: false,
			autoDecimalMode: true,
			valueRange: {
				min: 0
			}
		};
	}

	get convertedConfig() {
		return {
			...this.inputConfig,
			currency: {
				prefix: CurrencyConstants.symbols[this.convertTo]
			},
		};
	}


	convert() {
		this.parsedOutput = CurrencyService.convert(this.parsedInput, this.convertFrom, this.convertTo);
		this.updateOutputField();
	}

	updateInputField() {
		if (!this.valueToBeConverted) {
			this.clear();
		}
		
		const value = parse(this.valueToBeConverted, this.inputConfig) as number;
		if (this.parsedInput !== value) {
			this.parsedInput = value;
			this.convert();
		}
	}

	updateOutputField() {
		const field = this.$refs['outputField'] as any;
		if (field) {
			setValue(field, this.parsedOutput);
		}
	}

	changeFrom() {
		if (this.convertFrom === this.convertTo) {
			this.convertTo = this.availableTargetCurrencies[0].code;
		} else {
			this.convert();
		}
	}

	changeTo() {
		this.convert();
	}

	swapFromTo() {
		const convertFrom = this.convertFrom;
		this.convertFrom = this.convertTo;
		setTimeout(() => {
			this.convertTo = convertFrom;
		}, 10);
	}

	clear() {
		const inputField = this.$refs['inputField'] as any;
		if (inputField) {
			setValue(inputField, 0);
			inputField.$el.focus();
		}
	}

	clearWithEsc(evt: KeyboardEvent) {
		if (evt.key === 'Escape') {
			evt.preventDefault();
			evt.stopPropagation();
			this.clear();
		}
	}

	numberInput(n: number) {
		const newValue = (this.parsedInput * 10) + n/100;
		this.updateInputThroughButtonPanel(newValue);
	}

	backspace() {
		const inputAsString = this.parsedInput.toFixed(2);
		const lastNumberErased = inputAsString.slice(0, inputAsString.length - 1);
		const newValue = parseFloat(lastNumberErased) / 10;
		this.updateInputThroughButtonPanel(newValue);
	}

	updateInputThroughButtonPanel(newValue: number) {
		const inputField = this.$refs['inputField'] as any;
		setValue(inputField, newValue);
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