export default class Product {
	readonly storeId?: string;

	constructor(
		readonly sku: string,
		readonly name: string,
		readonly price: number,
	) {}
}
