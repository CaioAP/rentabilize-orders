import Product from '../../domain/entity/Product';

export default interface ProductRepository {
	create(product: Product): Promise<Product>;
	update(id: string, product: Product): Promise<Product>;
	findById(id: string): Promise<Product | null>;
}
