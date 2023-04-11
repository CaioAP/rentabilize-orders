import DateObject from '../../domain/entity/Date';
import Store from '../../domain/entity/Store';
import StoreGateway from '../gateway/StoreGateway';

export default class SearchOrders {
	constructor(readonly storeGateway: StoreGateway) {}

	async execute(input: Input): Promise<any> {
		if (new DateObject(input.date).isGreaterThan(new Date()))
			throw new Error('Invalid date');
		return await this.storeGateway.getOrders(input.store, input.date);
	}
}

type Input = {
	store: Store;
	date: Date;
};
