import OrderStatus from '../../domain/entity/OrderStatus';

export default interface OrderStatusRepository {
	getById(id: string): Promise<OrderStatus>;
}
