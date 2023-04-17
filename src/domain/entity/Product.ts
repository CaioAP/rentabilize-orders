export default class Product {
	constructor(
		readonly storeId: string,
		readonly sku: string,
		readonly name: string,
		readonly price: number,
	) {}
}
