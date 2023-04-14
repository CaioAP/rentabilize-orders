import MarketplaceStatusRepository from '../../application/repository/MarketplaceStatusRepository';
import MarketplaceStatus from '../../domain/entity/MarketplaceStatus';
import Connection from '../database/Connection';

export default class MarketplaceStatusRepositoryDatabase
	implements MarketplaceStatusRepository
{
	constructor(readonly connection: Connection) {}

	async getByName(name: string): Promise<MarketplaceStatus> {
		const [result] = await this.connection.query(
			`SELECT * FROM public."MarketplaceStatus" WHERE lower(nome) like lower($1)`,
			[name],
		);
		return new MarketplaceStatus(result.id, result.nome);
	}
}
