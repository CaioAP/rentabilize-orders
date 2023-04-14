import Price from './Price';

export default class OrderItem {
	constructor(
		readonly productId: string,
		readonly id: string,
		readonly amount: Price,
		readonly quantity: number,
		readonly ncm: number,
	) {}
}
