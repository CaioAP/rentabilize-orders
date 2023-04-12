import Product from '../../domain/entity/Product';

export default interface ProductRepository {
	create(product: Product): Promise<Product>;
	// createMany(product: Product[]): Promise<void>;
}
