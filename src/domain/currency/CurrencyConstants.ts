export default class CurrencyConstants {

	static readonly availableCurrencies = [
		{ code: 'BRL', description: 'Reais brasileiros', symbol: 'R$' },
		{ code: 'USD', description: 'American dolars', symbol: 'US$' },
		{ code: 'EUR', description: 'Euros', symbol: '€' },
	];

	static readonly exchangeRates = {
		'USD': {
			'BRL': 5.2164,
			'EUR': 1/1.2206,
		},
		'EUR': {
			'USD': 1.2206,
			'BRL': 6.3970
		},
		'BRL': {
			'USD': 1/5.2164,
			'EUR': 1/6.3970
		}
	};

	static readonly IOF_PERCENT = 1.1;
	static readonly FX_PERCENT = 1;

	
	static get symbols() {
		const symbols = {};
		CurrencyConstants.availableCurrencies.forEach(currency => {
			symbols[currency.code] = `${currency.symbol} `;
		});
		return symbols;
	}
}
