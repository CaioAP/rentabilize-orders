import FinancialStatementRepository from '../../application/repository/FinancialStatementRepository';
import FinancialStatement from '../../domain/entity/FinancialStatement';
import Price from '../../domain/entity/Price';
import Connection from '../database/Connection';

export default class FinancialStatementRepositoryDatabase
	implements FinancialStatementRepository
{
	constructor(readonly connection: Connection) {}

	async getByFilter(
		saleId: string,
		companyId: string,
		influencerId: string,
	): Promise<FinancialStatement | null> {
		const [financialStatementData] = await this.connection.query(
			`
      SELECT * FROM public."Financeiro"
      WHERE "pedidoId" = $1
        AND "empresaId" = $2
        AND "influenciadorId" = $3;
    `,
			[saleId, companyId, influencerId],
		);
		if (!financialStatementData) return null;
		return new FinancialStatement(
			financialStatementData.empresaId,
			financialStatementData.influenciadorId,
			financialStatementData.id,
			financialStatementData.comissao,
			new Price(financialStatementData.valor),
			financialStatementData.dataLancamento,
			financialStatementData.tipo,
			financialStatementData.disponivel,
			financialStatementData.pedidoId,
			financialStatementData.usuarioId,
		);
	}
}
