import Price from './Price';

export default class BalanceInvite {
	amount: Price;
	companyId?: string;
	influencerId?: string;

	constructor(
		readonly id: string | undefined,
		amount: Price,
		companyId?: string,
		influencerId?: string,
	) {
		this.amount = amount;
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
