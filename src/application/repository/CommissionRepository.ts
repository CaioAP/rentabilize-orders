import Commission from '../../domain/entity/Comission';

export default interface CommissionRepository {
	getByCompany(companyId: string): Promise<Commission[]>;
}
