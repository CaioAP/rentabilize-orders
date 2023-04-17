export default class Store {
	constructor(
		readonly id: string,
		readonly name: string,
		readonly url: string,
		readonly key: string,
		readonly pwd: string,
		readonly active = true,
		readonly companyId?: string,
	) {}
}
