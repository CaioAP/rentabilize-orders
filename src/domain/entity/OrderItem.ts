import Price from './Price';

export default class OrderItem {
	constructor(
		readonly productId: string,
		readonly id: string | undefined,
		readonly quantity: number,
		readonly ncm: number,
		readonly amount?: Price,
		readonly discount?: Price,
	) {}
}
