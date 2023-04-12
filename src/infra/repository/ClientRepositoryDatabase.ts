import Connection from '../database/Connection';
import ClientRepository from '../../application/repository/ClientRepository';
import Client from '../../domain/entity/Client';

export default class ClientRepositoryDatabase implements ClientRepository {
	constructor(readonly connection: Connection) {}

	async create(data: Client): Promise<Client> {
		const [person] = await this.connection.query(
			`
				INSERT INTO public."Pessoa" (id, "cpfCnpj", nome, email, instagram, sexo, "dataNascimento", "dataCadastro", "dataAlteracao")
				VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8)
				RETURNING *
			`,
			[
				data.cpfCnpj,
				data.name,
				data.email,
				data.instagram,
				data.sex,
				data.birthdate,
				new Date(),
				new Date(),
			],
		);
		const [client] = await this.connection.query(
			`
				INSERT INTO "Cliente" (id, marketing, "pessoaId")
				VALUES (uuid_generate_v4(), $1, $2)
				RETURNING *
			`,
			[true, person.id],
		);
		return new Client(
			person.cpfCnpj,
			person.nome,
			person.email,
			person.instagram,
			person.dataNascimento,
			person.sexo,
			client.marketing,
		);
	}

	async findOneByFilter(filter: Partial<Client>): Promise<Client | null> {
		let where = '';
		if (filter.email) where += ` AND p.email = '${filter.email}'`;
		if (filter.cpfCnpj) where += ` AND p."cpfCnpj" = '${filter.cpfCnpj}'`;
		const [result] = await this.connection.query(
			`
				SELECT c.id, c.marketing, c."pessoaId", p."cpfCnpj", p.nome, p.email, p.instagram, p."dataNascimento", p.sexo
				FROM "Cliente" c
				INNER JOIN "Pessoa" p ON p.id = c."pessoaId"
				WHERE 1=1 ${where};
			`,
			[],
		);
		if (result) {
			const client = new Client(
				result.cpfCnpj,
				result.nome,
				result.email,
				result.instagram,
				result.dataNascimento,
				result.sexo,
				result.marketing,
			);
			client.setId(result.id);
			client.setPersonId(result.pessoaId);
			return client;
		}
		return null;
	}
}
