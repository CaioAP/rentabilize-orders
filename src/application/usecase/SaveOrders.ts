import Client from '../../domain/entity/Client';
import DateObject from '../../domain/entity/Date';
import Store from '../../domain/entity/Store';
import formatStoreData from '../formatter/FormatStoreData';
import StoreGateway from '../gateway/StoreGateway';
import ClientRepository from '../repository/ClientRepository';
import Usecase from './Usecase';

export default class SaveOrders implements Usecase {
	constructor(
		readonly storeGateway: StoreGateway,
		readonly clientRepository: ClientRepository,
	) {}

	async execute(input: Input): Promise<any> {
		if (new DateObject(input.date).isAfter(new Date()))
			throw new Error('Invalid date');
		const output: Output = {
			clients: [],
		};
		const { objects } = await this.storeGateway.getOrders(
			input.store,
			input.date,
		);
		for (const data of objects) {
			const dataFormatted = formatStoreData(data);
			await this.saveClient(dataFormatted.client);
			output.clients.push(true);
		}
		return output;
	}

	async saveClient(data: any) {
		const client = new Client(
			data.cpfCnpj.replace(/\D/g, ''),
			data.name,
			data.email,
			data.instagram || null,
			data.birthdate || null,
			data.sex || null,
		);
		await this.clientRepository.create(client);
	}
}

type Input = {
	store: Store;
	date: Date;
};

type Output = {
	clients: any[];
};
