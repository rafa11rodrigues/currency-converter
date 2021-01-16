import CurrencyConstants from "@/domain/currency/CurrencyConstants";

export default class CurrencyInputOptions {
	
	static get(currency: string, precision?: number) {
		return {
			currency: {
				prefix: CurrencyConstants.symbols[currency]
			},
			precision,
			allowNegative: false,
			distractionFree: false,
			autoDecimalMode: true,
			valueRange: {
				min: 0
			}
		};
	}
}
