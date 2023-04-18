import Company from '../../domain/entity/Company';
import CompanyRepository from '../repository/CompanyRepository';
import Usecase from './Usecase';

export default class GetCompany implements Usecase {
	constructor(readonly companyRepository: CompanyRepository) {}

	async execute(input: Input): Promise<Company | null> {
		return await this.companyRepository.getByStore(input.storeId);
	}
}

type Input = {
	storeId: string;
};
