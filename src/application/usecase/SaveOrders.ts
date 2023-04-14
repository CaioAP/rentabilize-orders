import Usecase from './Usecase';
import DateObject from '../../domain/entity/Date';
import Order from '../../domain/entity/Order';
import Price from '../../domain/entity/Price';
import Store from '../../domain/entity/Store';
import formatStoreData from '../../infra/formatter/FormatStoreData';
import OrderRepository from '../repository/OrderRepository';
import SearchOrders from './SearchOrders';
import GetOrderStatusFromMarketplace from './GetOrderStatusFromMarketplace';

export default class SaveOrders implements Usecase {
	constructor(
		readonly searchOrders: SearchOrders,
		readonly getOrderStatusFromMarketplace: GetOrderStatusFromMarketplace,
		readonly orderRepository: OrderRepository,
	) {}

	async execute(input: Input): Promise<Output> {
		const { objects } = await this.searchOrders.execute(input);
		const output: Output = [];
		for (const data of objects) {
			const dataFormatted = formatStoreData(data);
			// const orderStatus = this.getOrderStatusFromMarketplace.execute(dataFormatted.status);
			// const order = new Order(
			//   dataFormatted.saleId,
			//   new Price(dataFormatted.price),
			//   new Price(dataFormatted.discount),
			//   new DateObject(new Date(dataFormatted.dateAdded)),
			//   new DateObject(new Date(dataFormatted.dateModified)),
			//   new OrderStatus()
			// );
		}
		return output;
	}
}

type Input = {
	store: Store;
	date: Date;
};

type Output = Order[];
