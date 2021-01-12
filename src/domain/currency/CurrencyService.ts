import CurrencyConstants from "./CurrencyConstants";

export default class CurrencyService {

	static convert(value: number, from: string, to: string): number {
		const exchangeRate = CurrencyService.exchangeRate(from, to);
		const iofValue = CurrencyService.iofValue(value);
		const fxValue = CurrencyService.fxValue(value);

		return (value - iofValue - fxValue) * exchangeRate;
	}

	static exchangeRate(from: string, to: string) {
		return CurrencyConstants.exchangeRates[from][to];
	}

	static iofValue(value: number): number {
		return (CurrencyConstants.IOF_PERCENT * value) / 100.0;
	}

	static fxValue(value: number): number {
		return (CurrencyConstants.FX_PERCENT * value) / 100.0;
	}
}