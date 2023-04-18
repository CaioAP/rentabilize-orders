import Commission from '../../domain/entity/Comission';
import CommissionRepository from '../repository/CommissionRepository';
import Usecase from './Usecase';

export default class GetCommissions implements Usecase {
	constructor(readonly commissionRepository: CommissionRepository) {}

	async execute(input: Input): Promise<Commission[]> {
		return await this.commissionRepository.getByCompany(input.companyId);
	}
}

type Input = {
	companyId: string;
};
