<template>
	<md-field>
		<label>Converted value</label>
		<md-input v-model="fieldValue" readonly
			v-currency="fieldConfig"
			ref="field" />
	</md-field>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { CurrencyDirective, setValue } from 'vue-currency-input';
import CurrencyFieldOptions from './CurrencyFieldOptions';

@Component({
	directives: {
		currency: CurrencyDirective
	}
})
export default class ConversionOutput extends Vue {

	@Prop({ required: false, default: 2 })
	precision?: number;

	@Prop({ required: true })
	convertedValue!: number;

	@Prop({ required: true })
	convertedTo!: string;


	field: any;
	fieldValue = '0';

	mounted() {
		this.field = this.$refs['field'];
		this.updateField();
	}

	get fieldConfig() {
		return CurrencyFieldOptions.get(this.convertedTo, this.precision);
	}

	@Watch('convertedValue')
	updateField() {
		setValue(this.field, this.convertedValue);
	}
}
</script>