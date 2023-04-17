import Usecase from './Usecase';
import OrderStatus from '../../domain/entity/OrderStatus';
import MarketplaceStatusRepository from '../repository/MarketplaceStatusRepository';
import OrderStatusMapRepository from '../repository/OrderStatusMapRepository';
import OrderStatusRepository from '../repository/OrderStatusRepository';

export default class GetOrderStatus implements Usecase {
	constructor(
		readonly orderStatusRepository: OrderStatusRepository,
		readonly orderStatusMapRepository: OrderStatusMapRepository,
		readonly marketplaceStatusRepository: MarketplaceStatusRepository,
	) {}

	async execute(input: Input): Promise<OrderStatus> {
		const marketplaceStatus = await this.marketplaceStatusRepository.getByName(
			input.status,
		);
		const orderStatusMap = await this.orderStatusMapRepository.getByMarketplace(
			marketplaceStatus.id,
		);
		return await this.orderStatusRepository.getById(orderStatusMap.orderStatus);
	}
}

type Input = {
	status: string;
};
