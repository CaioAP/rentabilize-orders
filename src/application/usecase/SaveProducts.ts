import Product from '../../domain/entity/Product';
import ProductRepository from '../repository/ProductRepository';
import Usecase from './Usecase';

export default class SaveProducts implements Usecase {
	constructor(readonly productRepository: ProductRepository) {}

	async execute(input: Input): Promise<Product[]> {
		const output: Product[] = [];
		for (const data of input.products) {
			const product = new Product(
				input.storeId,
				data.sku,
				data.name,
				data.price,
			);
			const productExists = await this.productRepository.findById(product.sku);
			if (!productExists) await this.productRepository.create(product);
			else await this.productRepository.update(product.sku, product);
			output.push(product);
		}
		return output;
	}
}

type Input = {
	storeId: string;
	products: {
		sku: string;
		name: string;
		price: number;
	}[];
};
