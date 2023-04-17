import Client from '../../domain/entity/Client';
import ClientRepository from '../repository/ClientRepository';
import Usecase from './Usecase';

export default class GetClientFromMarketplace implements Usecase {
	constructor(readonly clientRepository: ClientRepository) {}

	async execute(input: Input): Promise<Client> {
		const result = await this.clientRepository.findOneByFilter(input);
		if (!result) throw new Error('Client not found');
		return result;
	}
}

type Input = {
	cpfCnpj?: string;
	email?: string;
};
