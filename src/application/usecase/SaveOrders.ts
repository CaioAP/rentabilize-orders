import Usecase from './Usecase';
import Order from '../../domain/entity/Order';
import Store from '../../domain/entity/Store';
import formatStoreData from '../../infra/formatter/FormatStoreData';
import OrderRepository from '../repository/OrderRepository';
import SearchOrders from './SearchOrders';
import GetOrderStatus from './GetOrderStatus';
import SaveClient from './SaveClient';
import Client from '../../domain/entity/Client';

export default class SaveOrders implements Usecase {
	constructor(
		readonly searchOrders: SearchOrders,
		readonly getOrderStatus: GetOrderStatus,
		readonly saveClient: SaveClient,
		readonly orderRepository: OrderRepository,
	) {}

	async execute(input: Input): Promise<Output> {
		const { objects } = await this.searchOrders.execute(input);
		const output: Output = [];
		for (const data of objects) {
			const dataFormatted = formatStoreData(data);

			const client = await this.saveClient.execute({
				cpfCnpj: dataFormatted.client.cpfCnpj,
				name: dataFormatted.client.name,
				email: dataFormatted.client.email,
				birthdate: dataFormatted.client.birthdate,
				sex: dataFormatted.client.sex,
			});
			const status = await this.getOrderStatus.execute({
				status: dataFormatted.status,
			});
		}
		return output;
	}
}

type Input = {
	store: Store;
	date: Date;
};

type Output = Order[];
