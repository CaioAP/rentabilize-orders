import Balance from '../../domain/entity/Balance';

export default interface BalanceRepository {
	get(companyId: string, influencerId: string): Promise<Balance>;
	update(data: Balance): Promise<Balance>;
}
