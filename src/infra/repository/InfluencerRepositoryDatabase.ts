import InfluencerRepository from '../../application/repository/InfluencerRepository';
import Influencer from '../../domain/entity/Influencer';
import Connection from '../database/Connection';

export default class InfluencerRepositoryDatabase
	implements InfluencerRepository
{
	constructor(readonly connection: Connection) {}

	async getByCoupon(coupon: string): Promise<Influencer | null> {
		const [result] = await this.connection.query(
			`
      SELECT p.*, p.id AS "pessoaId", u.id AS "usuarioId", u.usuario, u.foto, i.id, i.verificado, i.atualizado
      FROM public."Influenciador" i
      INNER JOIN public."Usuario" u ON u.id = i."usuarioId"
      INNER JOIN public."Pessoa" p ON p.id = u."pessoaId"
      INNER JOIN public."Cupom" c ON i.id = c."influenciadorId"
      WHERE lower(c.nome) LIKE lower($1);
    `,
			[coupon],
		);
		if (!result) return null;
		return new Influencer(
			result.pessoaId,
			result.usuarioId,
			result.id,
			result.cpfCnpj,
			result.nome,
			result.email,
			result.usuario,
			null,
			result.instagram,
			result.dataNascimento,
			result.sexo,
			result.verificado,
			result.atualizado,
		);
	}
}
