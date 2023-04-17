import CouponRepository from '../../application/repository/CouponRepository';
import Coupon from '../../domain/entity/Coupon';
import Connection from '../database/Connection';

export default class CouponRepositoryDatabase implements CouponRepository {
	constructor(readonly connection: Connection) {}

	async getByName(name: string): Promise<Coupon | null> {
		const [result] = await this.connection.query(
			`SELECT * FROM public."Cupom" WHERE lower(nome) LIKE lower($1)`,
			[name],
		);
		if (!result) return null;
		const coupon = new Coupon(
			result.empresaId,
			result.influenciadorId,
			result.id,
			result.nome,
			result.desconto,
			result.observacao,
			result.descricao,
			new Date(result.validade),
			new Date(result.dataCadastro),
			result.ativo,
			result.aprovado,
		);
		if (result.motivo) coupon.setMotive(result.motivo);
		if (result.dataAprovacao)
			coupon.setApprovedAt(new Date(result.dataAprovacao));
		return coupon;
	}
}
