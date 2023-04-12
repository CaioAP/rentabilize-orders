import Product from '../../domain/entity/Product';
import Connection from '../database/Connection';

export default class ProductRepositoryDatabase {
	constructor(readonly connection: Connection) {}

	async create(data: Product): Promise<Product> {
		const result = await this.connection.query(
			`
      INSERT INTO public."Produto" (sku, nome, valor)
      VALUES ($1, $2, $3)
			RETURNING *
    `,
			[data.sku, data.name, data.price],
		);
		return new Product(result[0].sku, result[0].nome, result[0].valor);
	}
}
