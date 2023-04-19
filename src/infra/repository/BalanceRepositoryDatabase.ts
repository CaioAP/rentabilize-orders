import BalanceRepository from '../../application/repository/BalanceRepository';
import Balance from '../../domain/entity/Balance';
import Price from '../../domain/entity/Price';
import Connection from '../database/Connection';

export default class BalanceRepositoryDatabase implements BalanceRepository {
	constructor(readonly connection: Connection) {}

	async get(companyId: string, influencerId: string): Promise<Balance> {
		const [balanceData] = await this.connection.query(
			`
      SELECT * FROM public."Saldo" WHERE "influenciadorId" = $1 AND "empresaId" = $2;
    `,
			[influencerId, companyId],
		);
		if (!balanceData) throw new Error('Balance not found');
		return new Balance(
			balanceData.id,
			new Price(balanceData.valor),
			new Price(balanceData.disponivel),
			balanceData.empresaId,
			balanceData.influenciadorId,
		);
	}

	async update(data: Balance): Promise<Balance> {
		const [balanceData] = await this.connection.query(
			`
      UPDATE public."Saldo" SET
        valor = $1,
        disponivel = $2
      WHERE "influenciadorId" = $3 AND "empresaId" = $4
      RETURNING *;
    `,
			[
				data.amount.value,
				data.available.value,
				data.influencerId,
				data.companyId,
			],
		);
		if (!balanceData) throw new Error('Balance not found');
		return new Balance(
			balanceData.id,
			new Price(balanceData.valor),
			new Price(balanceData.disponivel),
			balanceData.empresaId,
			balanceData.influenciadorId,
		);
	}
}
