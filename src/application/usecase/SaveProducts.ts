import DateObject from '../../domain/entity/Date';
import Product from '../../domain/entity/Product';
import Store from '../../domain/entity/Store';
import formatStoreData from '../formatter/FormatStoreData';
import StoreGateway from '../gateway/StoreGateway';
import ProductRepository from '../repository/ProductRepository';
import Usecase from './Usecase';

export default class SaveProducts implements Usecase {
	constructor(
		readonly storeGateway: StoreGateway,
		readonly productRepository: ProductRepository,
	) {}

	async execute(input: Input): Promise<Output> {
		if (new DateObject(input.date).isAfter(new Date()))
			throw new Error('Invalid date');
		const { objects } = await this.storeGateway.getOrders(
			input.store,
			input.date,
		);
		const output: Output = [];
		for (const data of objects) {
			const dataFormatted = formatStoreData(data);
			for (const item of dataFormatted.items) {
				const product = new Product(item.sku, item.name, item.price);
				const productExists = await this.productRepository.findById(
					product.sku,
				);
				let result: Product;
				if (!productExists)
					result = await this.productRepository.create(product);
				else result = await this.productRepository.update(product.sku, product);
				output.push(result);
			}
		}
		return output;
	}
}

type Input = {
	store: Store;
	date: Date;
};

type Output = Product[];
