import Store from '../../domain/entity/Store';
import GetCommissions from './GetComissions';
import GetCompany from './GetCompany';
import GetInfluencerByCoupon from './GetInfluencerByCoupon';
import GetInfluencerInviter from './GetInfluencerInviter';
import Usecase from './Usecase';

export default class SaveFinancialStatement implements Usecase {
	constructor(
		readonly getCompany: GetCompany,
		readonly getCommissions: GetCommissions,
		readonly getInfluencerByCoupon: GetInfluencerByCoupon,
		readonly getInfluencerInviter: GetInfluencerInviter,
	) {}

	async execute(input: Input): Promise<void> {
		let influencer = await this.getInfluencerByCoupon.execute({
			coupon: input.coupon,
		});
		if (!influencer) return;
		const company = await this.getCompany.execute({ storeId: input.store.id });
		if (!company) throw new Error('Company not found');
		const commissions = await this.getCommissions.execute({
			companyId: String(company.id),
		});
		if (!commissions.length) throw new Error('No commission found');
		for (const commission of commissions) {
			const nextInfluencer = await this.getInfluencerInviter.execute({
				influencerId: String(influencer.id),
				companyId: String(company.id),
			});
		}
	}
}

type Input = {
	saleId: string;
	status: string;
	store: Store;
	price: number;
	coupon: string;
};
