import Store from '../../domain/entity/Store';
import StoreGateway from '../gateway/StoreGateway';

export default class SearchOrders {
	constructor(readonly storeGateway: StoreGateway) {}

	async execute(input: Input): Promise<any> {
		return await this.storeGateway.getOrders(input.store, input.date);
	}
}

type Input = {
	store: Store;
	date: Date;
};
