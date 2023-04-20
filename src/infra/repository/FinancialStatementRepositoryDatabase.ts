import FinancialStatementRepository from '../../application/repository/FinancialStatementRepository';
import DateObject from '../../domain/entity/Date';
import FinancialStatement from '../../domain/entity/FinancialStatement';
import Price from '../../domain/entity/Price';
import Connection from '../database/Connection';
import crypto from 'crypto';

export default class FinancialStatementRepositoryDatabase
	implements FinancialStatementRepository
{
	constructor(readonly connection: Connection) {}

	async create(data: FinancialStatement): Promise<FinancialStatement> {
		const [financialStatementData] = await this.connection.query(
			`
			INSERT INTO public."Financeiro" (id, comissao, valor, "dataLancamento", tipo, disponivel, "pedidoId", "influenciadorId", "empresaId", "usuarioId")
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
			RETURNING *
		`,
			[
				crypto.randomUUID(),
				data.comission,
				data.amount.value,
				data.date,
				data.type,
				data.available,
				data.saleId,
				data.influencerId,
				data.companyId,
				data.userId,
			],
		);
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

	async updateAvailability(
		id: string,
		available: boolean,
	): Promise<FinancialStatement> {
		const [financialStatement] = await this.connection.query(
			`
			UPDATE public."Financeiro" SET
				disponivel = $1
			WHERE id = $2
			RETURNING *
		`,
			[available, id],
		);
		if (!financialStatement) throw new Error('Financial statement not found');
		return new FinancialStatement(
			financialStatement.empresaId,
			financialStatement.influenciadorId,
			financialStatement.id,
			financialStatement.comissao,
			new Price(financialStatement.valor),
			financialStatement.dataLancamento,
			financialStatement.tipo,
			financialStatement.disponivel,
			financialStatement.pedidoId,
			financialStatement.usuarioId,
		);
	}

	async getByFilter(
		saleId: string,
		companyId: string,
		influencerId: string,
	): Promise<FinancialStatement | null> {
		const [financialStatementData] = await this.connection.query(
			`
      SELECT f.* FROM public."Financeiro" f
			INNER JOIN public."Pedido" p ON p.id = f."pedidoId"
      WHERE p.id = $1
        AND f."empresaId" = $2
        AND f."influenciadorId" = $3;
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

	async getNotAvailableOnDate(date: Date): Promise<FinancialStatement[]> {
		const startOfDate = new DateObject(date).getStartOfDate();
		const endOfDate = new DateObject(date).getEndOfDate();
		const data = await this.connection.query(
			`
			SELECT f1.* FROM public."Financeiro" f1
			INNER JOIN public."Pedido" p ON p.id = f1."pedidoId"
			INNER JOIN public."StatusPedido" sp ON sp.id = p."statusPedidoId"
			WHERE f1."dataLancamento" >= $1
				AND f1."dataLancamento" <= $2
				AND f1."pedidoId" IS NOT NULL
				AND f1.tipo = 'CREDITO'
				AND f1.disponivel = false
				AND NOT EXISTS (
					SELECT 1 FROM public."Financeiro" f2
					WHERE f2."dataLancamento" = f1."dataLancamento"
						AND f2."pedidoId" = f1."pedidoId"
						AND f2.tipo = 'DEBITO'
				)
				AND sp.nome IN ($3, $4, $5, $6)
		`,
			[
				startOfDate,
				endOfDate,
				'Aprovado',
				'Em separação',
				'Enviado',
				'Entregue',
			],
		);
		const output: FinancialStatement[] = [];
		for (const item of data) {
			output.push(
				new FinancialStatement(
					item.empresaId,
					item.influenciadorId,
					item.id,
					item.comissao,
					new Price(item.valor),
					item.dataLancamento,
					item.tipo,
					item.disponivel,
					item.pedidoId,
					item.usuarioId,
				),
			);
		}
		return output;
	}
}
