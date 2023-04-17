import ProductRepository from '../../application/repository/ProductRepository';
import Product from '../../domain/entity/Product';
import Connection from '../database/Connection';

export default class ProductRepositoryDatabase implements ProductRepository {
	constructor(readonly connection: Connection) {}

	async create(data: Product): Promise<Product> {
		const [product] = await this.connection.query(
			`
      INSERT INTO public."Produto" (sku, nome, valor, "lojaId")
      VALUES ($1, $2, $3, $4)
			RETURNING *
    `,
			[data.sku, data.name, data.price, data.storeId],
		);
		return new Product(
			product.lojaId,
			product.sku,
			product.nome,
			product.valor,
		);
	}

	async update(id: string, data: Product): Promise<Product> {
		const [product] = await this.connection.query(
			`
      UPDATE public."Produto" SET
      	nome = $2,
				valor = $3
			WHERE sku = $1
			RETURNING *
    `,
			[id, data.name, data.price],
		);
		if (!product) throw new Error('Product not found');
		return new Product(
			product.lojaId,
			product.sku,
			product.nome,
			product.valor,
		);
	}

	async findById(id: string): Promise<Product | null> {
		const [product] = await this.connection.query(
			`SELECT * FROM public."Produto" WHERE sku = $1`,
			[id],
		);
		if (!product) return null;
		return new Product(
			product.lojaId,
			product.sku,
			product.nome,
			product.valor,
		);
	}
}
