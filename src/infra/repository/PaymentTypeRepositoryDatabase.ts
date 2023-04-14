import PaymentTypeRepository from '../../application/repository/PaymentTypeRepository';
import PaymentType from '../../domain/entity/PaymentType';
import Connection from '../database/Connection';

export default class PaymentTypeRepositoryDatabase
	implements PaymentTypeRepository
{
	constructor(readonly connection: Connection) {}

	async getByName(name: string): Promise<PaymentType> {
		const [result] = await this.connection.query(
			`SELECT * FROM public."PagamentoTipo" WHERE lower(nome) LIKE lower($1)`,
			[name],
		);
		return new PaymentType(result.id, result.nome);
	}
}
