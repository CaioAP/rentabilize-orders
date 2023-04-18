import CommissionRepository from '../../application/repository/CommissionRepository';
import Commission from '../../domain/entity/Comission';
import Connection from '../database/Connection';

export default class CommissionRepositoryDatabase
	implements CommissionRepository
{
	constructor(readonly connection: Connection) {}

	async getByCompany(companyId: string): Promise<Commission[]> {
		const comissionsData = await this.connection.query(
			`
      SELECT * FROM public."EmpresaComissao"
      WHERE "empresaId" = $1
    `,
			[companyId],
		);
		const comissions: Commission[] = [];
		for (const data of comissionsData) {
			comissions.push(
				new Commission(data.empresaId, data.id, data.comissao, data.nivel),
			);
		}
		return comissions;
	}
}
