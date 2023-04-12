import ProductRepository from '../../application/repository/ProductRepository';
import Product from '../../domain/entity/Product';
import Connection from '../database/Connection';

export default class ProductRepositoryDatabase implements ProductRepository {
	constructor(readonly connection: Connection) {}

	async create(data: Product): Promise<Product> {
		const [result] = await this.connection.query(
			`
      INSERT INTO public."Produto" (sku, nome, valor)
      VALUES ($1, $2, $3)
			RETURNING *
    `,
			[data.sku, data.name, data.price],
		);
		return new Product(result.sku, result.nome, result.valor);
	}

	async update(id: string, data: Product): Promise<Product> {
		const [result] = await this.connection.query(
			`
      UPDATE public."Produto" SET
      	nome = $2,
				valor = $3
			WHERE sku = $1
			RETURNING *
    `,
			[id, data.name, data.price],
		);
		if (!result) throw new Error('Product not found');
		return new Product(result.sku, result.nome, result.valor);
	}

	async findById(id: string): Promise<Product | null> {
		const [result] = await this.connection.query(
			`SELECT * FROM public."Produto" WHERE sku = $1`,
			[id],
		);
		if (!result) return null;
		return new Product(result.sku, result.nome, result.valor);
	}
}
