import BalanceInvite from '../../domain/entity/BalanceInvite';

export default interface BalanceInviteRepository {
	get(companyId: string, influencerId: string): Promise<BalanceInvite>;
	update(data: BalanceInvite): Promise<BalanceInvite>;
}
