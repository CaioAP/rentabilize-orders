export default class Price {
	value: number;

	constructor(value: number | string) {
		value = Number(value);
		if (isNaN(value)) throw new Error('Invalid number');
		this.value = value;
	}

	format(): string {
		return Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(this.value);
	}
}
