import Client from '../../domain/entity/Client';

export default interface ClientRepository {
	create(client: Client): Promise<Client>;
	getByFilter(client: Partial<Client>): Promise<Client | null>;
}
