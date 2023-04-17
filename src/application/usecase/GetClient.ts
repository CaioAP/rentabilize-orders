import Client from '../../domain/entity/Client';
import ClientRepository from '../repository/ClientRepository';
import Usecase from './Usecase';

export default class GetClient implements Usecase {
	constructor(readonly clientRepository: ClientRepository) {}

	async execute(input: Input): Promise<Client | null> {
		return await this.clientRepository.getByFilter(input);
	}
}

type Input = {
	cpfCnpj?: string;
	email?: string;
};
