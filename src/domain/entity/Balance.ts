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

	increment(amount: Price): void {
		this.amount.value += amount.value;
	}

	incrementAvailable(amount: Price): void {
		this.available.value += amount.value;
	}

	decrement(amount: Price): void {
		this.amount.value -= amount.value;
	}

	decrementAvailable(amount: Price): void {
		this.available.value -= amount.value;
	}
}
