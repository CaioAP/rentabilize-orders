import Connection from '../database/Connection';
import ClientRepository from '../../application/repository/ClientRepository';
import Client from '../../domain/entity/Client';

export default class ClientRepositoryDatabase implements ClientRepository {
	constructor(readonly connection: Connection) {}

	async create(client: Client): Promise<void> {
		await this.connection.transaction(async (t: any) => {
			const person = await t.one(
				`
						INSERT INTO public."Pessoa" (id, "cpfCnpj", nome, email, instagram, sexo, "dataNascimento", "dataCadastro", "dataAlteracao")
						VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8)
						RETURNING id
					`,
				[
					client.cpfCnpj,
					client.name,
					client.email,
					client.instagram,
					client.sex,
					client.birthdate,
					new Date(),
					new Date(),
				],
			);
			await t.none(
				`
						INSERT INTO "Cliente" (id, marketing, "pessoaId")
						VALUES (uuid_generate_v4(), $1, $2)
					`,
				[true, person.id],
			);
		});
	}
}
