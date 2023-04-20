import FinancialStatement from '../../domain/entity/FinancialStatement';

export default interface FinancialStatementRepository {
	create(data: FinancialStatement): Promise<FinancialStatement>;
	getByFilter(
		saleId: string,
		companyId: string,
		influencerId: string,
	): Promise<FinancialStatement | null>;
	getNotAvailableOnDate(date: Date): Promise<FinancialStatement[]>;
}
