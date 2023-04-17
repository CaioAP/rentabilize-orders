import Price from './Price';

export default class OrderItem {
	amount?: Price;
	discount?: number;

	constructor(
		readonly productId: string,
		readonly id: string,
		readonly quantity: number,
		readonly ncm: number,
		amount?: Price,
		discount?: number,
	) {
		this.amount = amount;
		this.discount = discount;
	}
}
