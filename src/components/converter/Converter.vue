<template>
	<div class="converter">
		<ConversionInput :precision="precision"
			@valueChanged="valueChanged($event)"
			@convertFromChanged="convertFromChanged($event)"
			@convertToChanged="convertToChanged($event)" />

		<div class="converted-value">
			<ConversionOutput
				:convertedValue="convertedValue"
				:convertedTo="convertTo"
				:precision="precision" />
		</div>

		<ConversionDetails
			:valueToBeConverted="valueToBeConverted"
			:convertedValue="convertedValue"
			:convertFrom="convertFrom"
			:convertTo="convertTo"
			:precision="precision" />
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import CurrencyService from '@/domain/currency/CurrencyService';
import ConversionInput from './ConversionInput.vue';
import ConversionOutput from './ConversionOutput.vue';
import ConversionDetails from './ConversionDetails.vue';
import CurrencyConstants from '@/domain/currency/CurrencyConstants';

@Component({
	components: {
		ConversionInput,
		ConversionOutput,
		ConversionDetails
	},
})
export default class Converter extends Vue {

	precision = 4;

	valueToBeConverted = 0;
	convertedValue = 0;

	convertFrom = CurrencyConstants.availableCurrencies[0].code;
	convertTo = CurrencyConstants.availableCurrencies[1].code;

	valueChanged(newValueToBeConverted: number) {
		if (this.valueToBeConverted !== newValueToBeConverted) {
			this.valueToBeConverted = newValueToBeConverted;
			this.convert();
		}
	}

	convertFromChanged(newConvertFrom: string) {
		this.convertFrom = newConvertFrom;
		if (this.convertFrom !== newConvertFrom && newConvertFrom !== this.convertTo) {
			this.convert();
		}
	}

	convertToChanged(newConvertTo: string) {
		this.convertTo = newConvertTo;
		this.convert();
	}

	convert() {
		this.convertedValue = CurrencyService.convert(this.valueToBeConverted, this.convertFrom, this.convertTo);
	}
}
</script>

<style lang="scss" scoped>
.converter {
	.converted-value {
		max-width: calc(100% - 40px - 12px); // to align with value to be converted (subtract button width and margin)
		margin: 20px 0;
	}
}
</style>