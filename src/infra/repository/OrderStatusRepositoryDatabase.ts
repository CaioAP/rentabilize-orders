import OrderStatusRepository from '../../application/repository/OrderStatusRepository';
import OrderStatus from '../../domain/entity/OrderStatus';
import Connection from '../database/Connection';

export default class OrderSstatusRepositoryDatabase
	implements OrderStatusRepository
{
	constructor(readonly connection: Connection) {}

	async getById(id: string): Promise<OrderStatus> {
		const [result] = await this.connection.query(
			`SELECT * FROM public."StatusPedido" WHERE id = $1`,
			[id],
		);
		return new OrderStatus(result.id, result.nome);
	}
}
