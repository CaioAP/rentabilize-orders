import FinancialStatement from '../../domain/entity/FinancialStatement';
import OrderStatus, { StatusName } from '../../domain/entity/OrderStatus';
import Price from '../../domain/entity/Price';
import Store from '../../domain/entity/Store';
import FinancialStatementRepository from '../repository/FinancialStatementRepository';
import GetCommissions from './GetComissions';
import GetCompany from './GetCompany';
import GetInfluencerByCoupon from './GetInfluencerByCoupon';
import GetInfluencerInviter from './GetInfluencerInviter';
import SaveBalance from './SaveBalance';
import Usecase from './Usecase';

export default class SaveFinancialStatement implements Usecase {
	constructor(
		readonly getCompany: GetCompany,
		readonly getCommissions: GetCommissions,
		readonly getInfluencerByCoupon: GetInfluencerByCoupon,
		readonly getInfluencerInviter: GetInfluencerInviter,
		readonly saveBalance: SaveBalance,
		readonly financialStatementRepository: FinancialStatementRepository,
	) {}

	async execute(input: Input): Promise<FinancialStatement[]> {
		const company = await this.getCompany.execute({ storeId: input.store.id });
		if (!company) throw new Error('Company not found');
		const commissions = await this.getCommissions.execute({
			companyId: String(company.id),
		});
		if (!commissions.length) throw new Error('No commission found');
		let influencer = await this.getInfluencerByCoupon.execute({
			coupon: input.coupon,
		});
		const output: FinancialStatement[] = [];
		for (const commission of commissions) {
			if (!influencer) break;
			let financialStatement: FinancialStatement =
				(await this.financialStatementRepository.getByFilter(
					input.saleId,
					String(company.id),
					String(influencer.id),
				)) ||
				new FinancialStatement(
					String(company.id),
					String(influencer.id),
					undefined,
					commission.value,
					new Price(commission.calculate(new Price(input.price))),
					input.date,
					'CREDITO',
					false,
					input.saleId,
				);
			if (new OrderStatus(undefined, input.status).isRefunded()) {
				financialStatement.type = 'DEBITO';
				financialStatement = await this.financialStatementRepository.create(
					financialStatement,
				);
				await this.saveBalance.execute({
					amount: financialStatement.amount.value,
					influencerId: financialStatement.influencerId,
					companyId: financialStatement.companyId,
					increment: false,
				});
			}
			if (financialStatement.isValidToCreate(input.status)) {
				financialStatement = await this.financialStatementRepository.create(
					financialStatement,
				);
				await this.saveBalance.execute({
					amount: financialStatement.amount.value,
					influencerId: financialStatement.influencerId,
					companyId: financialStatement.companyId,
					increment: true,
				});
			}
			output.push(financialStatement);
			influencer = await this.getInfluencerInviter.execute({
				influencerId: String(influencer.id),
				companyId: String(company.id),
			});
		}
		return output;
	}
}

type Input = {
	saleId: string;
	status: StatusName;
	store: Store;
	price: number;
	coupon: string;
	date: Date;
};
