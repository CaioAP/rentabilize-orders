import CompanyRepository from '../../application/repository/CompanyRepository';
import Company from '../../domain/entity/Company';
import Price from '../../domain/entity/Price';
import Connection from '../database/Connection';

export default class CompanyRepositoryDatabase implements CompanyRepository {
	constructor(readonly connection: Connection) {}

	async getByStore(storeId: string): Promise<Company | null> {
		const [companyData] = await this.connection.query(
			`
      SELECT p.*, e.*, p.id AS "pessoaId" FROM public."Empresa" e
      INNER JOIN public."Pessoa" p ON p.id = e."pessoaId"
      LEFT JOIN public."Loja" l ON e.id = l."empresaId"
      WHERE l.id = $1
    `,
			[storeId],
		);
		if (!companyData) return null;
		return new Company(
			companyData.pessoaId,
			companyData.id,
			companyData.cpfCnpj,
			companyData.nome,
			companyData.email,
			companyData.razaoSocial,
			companyData.nivelRepasse,
			new Price(companyData.conviteValor),
			companyData.instagram,
			companyData.cnae,
			companyData.inscricaoMunicipal,
			companyData.incricaoEstadual,
			companyData.logo,
		);
	}
}
