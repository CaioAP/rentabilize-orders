import Usecase from './Usecase';
import Order from '../../domain/entity/Order';
import Store from '../../domain/entity/Store';
import formatStoreData from '../../infra/formatter/FormatStoreData';
import OrderRepository from '../repository/OrderRepository';
import SearchOrders from './SearchOrders';
import GetOrderStatus from './GetOrderStatus';
import SaveClient from './SaveClient';
import SaveProducts from './SaveProducts';
import GetCoupon from './GetCoupon';
import GetPaymentType from './GetPaymentType';
import Price from '../../domain/entity/Price';
import OrderItem from '../../domain/entity/OrderItem';
import Product from '../../domain/entity/Product';
import SaveFinancialStatement from './SaveFinancialStatement';

export default class SaveOrders implements Usecase {
	constructor(
		readonly searchOrders: SearchOrders,
		readonly getOrderStatus: GetOrderStatus,
		readonly getPaymentType: GetPaymentType,
		readonly getCoupon: GetCoupon,
		readonly saveClient: SaveClient,
		readonly saveProducts: SaveProducts,
		readonly saveFinancialStatement: SaveFinancialStatement,
		readonly orderRepository: OrderRepository,
	) {}

	async execute(input: Input): Promise<Output> {
		const { objects } = await this.searchOrders.execute(input);
		const output: Output = [];
		for (const data of objects) {
			const dataFormatted = formatStoreData(data);
			const products = await this.saveProducts.execute({
				storeId: input.store.id,
				products: dataFormatted.items,
			});
			const status = await this.getOrderStatus.execute({
				status: dataFormatted.status,
			});
			const paymentType = await this.getPaymentType.execute({
				payment: dataFormatted.payment,
			});
			const client = await this.saveClient.execute({
				cpfCnpj: dataFormatted.client.cpfCnpj,
				name: dataFormatted.client.name,
				email: dataFormatted.client.email,
				birthdate: dataFormatted.client.birthdate,
				sex: dataFormatted.client.sex,
			});
			const coupon = await this.getCoupon.execute({
				coupon: dataFormatted.coupon,
			});
			const orderExists: Order | null = await this.orderRepository.getByIdExt(
				dataFormatted.saleId,
			);
			const orderData = new Order(
				undefined,
				dataFormatted.saleId,
				new Price(dataFormatted.price),
				new Price(dataFormatted.discount),
				dataFormatted.dateAdded,
				dataFormatted.dateModified,
				String(status.id),
				paymentType.id,
				input.store.id,
				String(client.id),
				coupon?.id,
				dataFormatted.observation,
			);
			for (const item of dataFormatted.items) {
				const product = products.find((p: Product) => p.sku === item.sku);
				if (product)
					orderData.items.push(
						new OrderItem(
							product.sku,
							undefined,
							item.quantity,
							item.ncm,
							new Price(item.price),
						),
					);
			}
			let order: Order;
			if (!orderExists) order = await this.orderRepository.create(orderData);
			else order = await this.orderRepository.update(orderData);
			output.push(order);
			if (coupon)
				await this.saveFinancialStatement.execute({
					saleId: String(order.id),
					status: status.name,
					store: input.store,
					price: dataFormatted.price,
					coupon: coupon.name,
					date: input.date,
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
