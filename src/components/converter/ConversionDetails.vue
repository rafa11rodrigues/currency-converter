<template>
	<div>
		<div class="details">
			<p>
				Exchange rate:
				<strong>{{ exchangeRate }}</strong>
			</p>
			<p>
				IOF (1.1% of value to be converted):
				<strong>{{ iof }}</strong>
			</p>
			<p>
				FX (1% of value to be converted):
				<strong>{{ fx }}</strong>
			</p>
		</div>

		<div class="calculation">
			<p>
				convertedValue = (valueToBeConverted - iof - fx) * exchangeRate
			</p>
			<p class="result">
				{{ result }} = ({{ value }} - {{ iof }} - {{ fx }}) * {{ exchangeRate }}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import CurrencyService from '@/domain/currency/CurrencyService';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ConversionDetails extends Vue {

	@Prop({ required: false, default: 2 })
	precision?: number;

	@Prop({ required: true })
	valueToBeConverted!: number;

	@Prop({ required: true })
	convertedValue!: number;

	@Prop({ required: true })
	convertFrom!: string;

	@Prop({ required: true })
	convertTo!: string;


	get exchangeRate() {
		return (CurrencyService.exchangeRate(this.convertFrom, this.convertTo) || 0).toFixed(this.precision);
	}

	get iof() {
		return CurrencyService.iofValue(this.valueToBeConverted).toFixed(this.precision);
	}

	get fx() {
		return CurrencyService.fxValue(this.valueToBeConverted).toFixed(this.precision);
	}

	get value() {
		return this.valueToBeConverted.toFixed(this.precision);
	}

	get result() {
		return this.convertedValue.toFixed(this.precision);
	}
}
</script>

<style lang="scss" scoped>
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
</style>