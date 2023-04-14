import Order from '../../domain/entity/Order';

export default interface OrderRepository {
	create(order: Order): Promise<Order>;
}
