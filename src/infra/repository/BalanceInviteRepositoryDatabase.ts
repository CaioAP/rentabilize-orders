import BalanceInviteRepository from '../../application/repository/BalanceInviteRepository';
import BalanceInvite from '../../domain/entity/BalanceInvite';
import Price from '../../domain/entity/Price';
import Connection from '../database/Connection';

export default class BalanceInviteRepositoryDatabase
	implements BalanceInviteRepository
{
	constructor(readonly connection: Connection) {}

	async get(companyId: string, influencerId: string): Promise<BalanceInvite> {
		const [balanceData] = await this.connection.query(
			`
      SELECT * FROM public."ConviteSaldo" WHERE "influenciadorId" = $1 AND "empresaId" = $2;
    `,
			[influencerId, companyId],
		);
		if (!balanceData) throw new Error('Balance invite not found');
		return new BalanceInvite(
			balanceData.id,
			new Price(balanceData.saldo),
			balanceData.empresaId,
			balanceData.influenciadorId,
		);
	}

	async update(data: BalanceInvite): Promise<BalanceInvite> {
		const [balanceData] = await this.connection.query(
			`
      UPDATE public."ConviteSaldo" SET
        saldo = $1
      WHERE "influenciadorId" = $2 AND "empresaId" = $3
      RETURNING *;
    `,
			[data.amount.value, data.influencerId, data.companyId],
		);
		if (!balanceData) throw new Error('Balance invite not found');
		return new BalanceInvite(
			balanceData.id,
			new Price(balanceData.saldo),
			balanceData.empresaId,
			balanceData.influenciadorId,
		);
	}
}
