import Usecase from './Usecase';
import Client from '../../domain/entity/Client';
import ClientRepository from '../repository/ClientRepository';
import crypto from 'crypto';
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
			crypto.randomUUID(),
			crypto.randomUUID(),
			input.cpfCnpj,
			input.name,
			input.email,
			null,
			birthdate,
			sex,
		);
		const clientExists = await this.clientRepository.getByFilter(client);
		if (!clientExists) await this.clientRepository.create(client);
		return client;
	}
}

type Input = {
	cpfCnpj: string;
	name: string;
	email: string;
	birthdate?: string | Date | null;
	sex?: string | null;
};
