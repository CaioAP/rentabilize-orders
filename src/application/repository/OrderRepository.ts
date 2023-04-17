import Order from '../../domain/entity/Order';

export default interface OrderRepository {
	create(order: Order): Promise<Order>;
	update(order: Partial<Order>): Promise<Order>;
	getByIdExt(id: string): Promise<Order | null>;
}
