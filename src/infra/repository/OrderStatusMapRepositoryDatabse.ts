import OrderStatusMapRepository from '../../application/repository/OrderStatusMapRepository';
import OrderStatusMap from '../../domain/entity/OrderStatusMap';
import Connection from '../database/Connection';

export default class OrderStatusMapRepositoryDatabase
	implements OrderStatusMapRepository
{
	constructor(readonly connection: Connection) {}

	async getByMarketplace(id: string): Promise<OrderStatusMap> {
		const [result] = await this.connection.query(
			`SELECT * FROM public."StatusPedidoMapa" WHERE "marketPlaceStatusId" = $1`,
			[id],
		);
		return new OrderStatusMap(
			result.statusPedidoId,
			result.marketPlaceStatusId,
		);
	}
}
