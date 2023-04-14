import OrderStatusMap from '../../domain/entity/OrderStatusMap';

export default interface OrderStatusMapRepository {
	getByMarketplace(id: string): Promise<OrderStatusMap>;
}
