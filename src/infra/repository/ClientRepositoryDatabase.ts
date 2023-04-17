import Connection from '../database/Connection';
import ClientRepository from '../../application/repository/ClientRepository';
import Client from '../../domain/entity/Client';
import crypto from 'crypto';

export default class ClientRepositoryDatabase implements ClientRepository {
	constructor(readonly connection: Connection) {}

	async create(data: Client): Promise<Client> {
		const [person] = await this.connection.query(
			`
				INSERT INTO public."Pessoa" (id, "cpfCnpj", nome, email, instagram, sexo, "dataNascimento", "dataCadastro", "dataAlteracao")
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
				RETURNING *
			`,
			[
				crypto.randomUUID(),
				data.cpfCnpj.replace(/\D/g, ''),
				data.name,
				data.email,
				data.instagram,
				data.sex?.value,
				data.birthdate,
				new Date(),
				new Date(),
			],
		);
		const [client] = await this.connection.query(
			`
				INSERT INTO public."Cliente" (id, marketing, "pessoaId")
				VALUES ($1, $2, $3)
				RETURNING *
			`,
			[crypto.randomUUID(), true, person.id],
		);
		return new Client(
			person.id,
			client.id,
			person.cpfCnpj,
			person.nome,
			person.email,
			person.instagram,
			person.dataNascimento,
			person.sexo,
			client.marketing,
		);
	}

	async getByFilter(filter: Partial<Client>): Promise<Client | null> {
		let where = '';
		if (filter.email) where += ` AND p.email = '${filter.email}'`;
		if (filter.cpfCnpj)
			where += ` AND p."cpfCnpj" = '${filter.cpfCnpj.replace(/\D/g, '')}'`;
		const [result] = await this.connection.query(
			`
				SELECT c.id, c.marketing, c."pessoaId", p."cpfCnpj", p.nome, p.email, p.instagram, p."dataNascimento", p.sexo
				FROM public."Cliente" c
				INNER JOIN public."Pessoa" p ON p.id = c."pessoaId"
				WHERE 1=1 ${where};
			`,
			[],
		);
		if (!result) return null;
		return new Client(
			result.pessoaId,
			result.id,
			result.cpfCnpj,
			result.nome,
			result.email,
			result.instagram,
			result.dataNascimento,
			result.sexo,
			result.marketing,
		);
	}
}
