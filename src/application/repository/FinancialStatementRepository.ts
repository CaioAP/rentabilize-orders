import FinancialStatement from '../../domain/entity/FinancialStatement';

export default interface FinancialStatementRepository {
	getByFilter(
		saleId: string,
		companyId: string,
		influencerId: string,
	): Promise<FinancialStatement | null>;
}
