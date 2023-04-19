import Price from './Price';

export default class Balance {
	amount: Price;
	available: Price;
	companyId?: string | undefined;
	influencerId?: string | undefined;

	constructor(
		readonly id: string | undefined,
		amount: Price,
		available: Price,
		companyId?: string | undefined,
		influencerId?: string | undefined,
	) {
		this.amount = amount;
		this.available = available;
		this.companyId = companyId;
		this.influencerId = influencerId;
	}

	increment(amount: Price) {
		this.amount.value += amount.value;
	}

	decrement(amount: Price) {
		this.amount.value -= amount.value;
	}
}
