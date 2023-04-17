import Usecase from './Usecase';
import Client from '../../domain/entity/Client';
import ClientRepository from '../repository/ClientRepository';
import Sex from '../../domain/entity/Sex';
import { isValid } from 'date-fns';

export default class SaveClient implements Usecase {
	constructor(readonly clientRepository: ClientRepository) {}

	async execute(input: Input): Promise<Client> {
		let sex: Sex | null = null;
		if (input.sex?.toUpperCase() === 'MASCULINO') sex = new Sex('MASCULINO');
		else if (input.sex?.toUpperCase() === 'FEMININO') sex = new Sex('FEMININO');
		let birthdate: Date | null = null;
		if (input.birthdate && isValid(input.birthdate))
			birthdate = new Date(input.birthdate);
		const client = new Client(
			undefined,
			undefined,
			input.cpfCnpj,
			input.name,
			input.email,
			null,
			birthdate,
			sex,
		);
		const clientExists = await this.clientRepository.getByFilter(client);
		if (!clientExists) return await this.clientRepository.create(client);
		else return clientExists;
	}
}

type Input = {
	cpfCnpj: string;
	name: string;
	email: string;
	birthdate?: string | Date | null;
	sex?: string | null;
};
