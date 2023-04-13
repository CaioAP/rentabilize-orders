import Client from '../../domain/entity/Client';
import DateObject from '../../domain/entity/Date';
import Store from '../../domain/entity/Store';
import formatStoreData from '../formatter/FormatStoreData';
import StoreGateway from '../gateway/StoreGateway';
import ClientRepository from '../repository/ClientRepository';
import Usecase from './Usecase';

export default class SaveClients implements Usecase {
	constructor(
		readonly storeGateway: StoreGateway,
		readonly clientRepository: ClientRepository,
	) {}

	async execute(input: Input): Promise<Output> {
		if (new DateObject(input.date).isAfter(new Date()))
			throw new Error('Invalid date');
		const { objects } = await this.storeGateway.getOrders(
			input.store,
			input.date,
		);
		const output: Output = [];
		for (const data of objects) {
			const dataFormatted = formatStoreData(data);
			const client = new Client(
				dataFormatted.client.cpfCnpj.replace(/\D/g, ''),
				dataFormatted.client.name,
				dataFormatted.client.email,
				null,
				dataFormatted.client.birthdate || null,
				dataFormatted.client.sex || null,
			);
			let result: Client = client;
			const clientExists = await this.clientRepository.findOneByFilter(client);
			if (!clientExists) result = await this.clientRepository.create(client);
			output.push(result);
		}
		return output;
	}
}

type Input = {
	store: Store;
	date: Date;
};

type Output = Client[];