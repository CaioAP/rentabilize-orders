import Company from '../../domain/entity/Company';

export default interface CompanyRepository {
	getByStore(storeId: string): Promise<Company | null>;
}
