import Store from "../../domain/entity/Store";

export default interface StoreGateway {
	getOrders(store: Store, date: Date): Promise<any>;
}
