<template>
	<div>
		<div class="source-value">
			<md-field class="input">
				<label>Value to be converted</label>
				<md-input v-model="inputValue"
					v-currency="inputConfig"
					@input="valueChanged()"
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
						@md-selected="convertFromChanged()">
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
						@md-selected="convertToChanged()">
						<md-option v-for="currency of availableTargetCurrencies" :key="currency.code"
							:value="currency.code">
							{{ currency.description }} - {{ currency.code }}
						</md-option>
					</md-select>
				</md-field>
			</div>

			<md-button class="md-icon-button md-accent swap" aria-label="swap source and target"
				@click="swapConvertFromTo()">
				<md-icon role="img" aria-label="swap source and target">swap_horiz</md-icon>
				<md-tooltip md-direction="bottom">swap source and target</md-tooltip>
			</md-button>
		</div>

		<div class="buttons-panel">
			<ButtonsPanel
				@numberInput="numberInput($event)"
				@backspace="backspace()" />
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { CurrencyDirective, setValue, parse, getValue } from 'vue-currency-input';
import ButtonsPanel from './ButtonsPanel.vue';
import CurrencyFieldOptions from './CurrencyFieldOptions';
import CurrencyConstants from "@/domain/currency/CurrencyConstants";

@Component({
	components: {
		ButtonsPanel
	},
	directives: {
		currency: CurrencyDirective
	}
})
export default class ConversionInput extends Vue {

	@Prop({ required: false, default: 2 })
	precision?: number;


	convertFrom = CurrencyConstants.availableCurrencies[0].code;
	convertTo = CurrencyConstants.availableCurrencies[1].code;

	availableCurrencies = CurrencyConstants.availableCurrencies;

	get availableTargetCurrencies() {
		return CurrencyConstants.availableCurrencies.filter(currency => currency.code !== this.convertFrom);
	}


	inputField: any;
	inputValue = '0';
	valueToBeConverted = 0;
	
	get inputConfig() {
		return CurrencyFieldOptions.get(this.convertFrom, this.precision);
	}

	mounted() {
		this.inputField = this.$refs['inputField'];
	}

	valueChanged() {
		if (!this.inputValue) {
			this.clear();
		}
		
		const value = parse(this.inputValue, this.inputConfig) as number;
		if (this.valueToBeConverted !== value) {
			this.valueToBeConverted = value;
			this.$emit('valueChanged', this.valueToBeConverted);
		}
	}

	convertFromChanged() {
		if (this.convertFrom === this.convertTo) {
			this.convertTo = this.availableTargetCurrencies[0].code;
		}
		this.$emit('convertFromChanged', this.convertFrom);
	}

	convertToChanged() {
		this.$emit('convertToChanged', this.convertTo);
	}

	swapConvertFromTo() {
		const convertFrom = this.convertFrom;
		this.convertFrom = this.convertTo;
		setTimeout(() => {
			this.convertTo = convertFrom;
		}, 10);
	}

	clear() {
		setValue(this.inputField, 0);
		this.inputField.$el.focus();
	}

	clearWithEsc(evt: KeyboardEvent) {
		if (evt.key === 'Escape') {
			evt.preventDefault();
			evt.stopPropagation();
			this.clear();
		}
	}

	numberInput(n: number) {
		const newValue = (this.valueToBeConverted * 10) + n/Math.pow(10, this.precision || 2);
		this.updateInputThroughButtonPanel(newValue);
	}

	backspace() {
		const inputAsString = this.valueToBeConverted.toFixed(this.precision);
		const lastNumberErased = inputAsString.slice(0, inputAsString.length - 1);
		const newValue = parseFloat(lastNumberErased) / 10;
		this.updateInputThroughButtonPanel(newValue);
	}

	updateInputThroughButtonPanel(newValue: number) {
		setValue(this.inputField, newValue);
	}
}
</script>

<style lang="scss" scoped>
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

.buttons-panel {
	margin: 20px auto;
}
</style>