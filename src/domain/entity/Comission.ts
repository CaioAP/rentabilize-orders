import Price from './Price';

export default class Commission {
	constructor(
		readonly companyId: string | undefined,
		readonly id: string | undefined,
		readonly value: number,
		readonly level: number,
	) {}

	calculate(amount: Price) {
		const commissionValue = amount.value * (this.value / 100);
		return Math.round(commissionValue * 100) / 100;
	}
}
