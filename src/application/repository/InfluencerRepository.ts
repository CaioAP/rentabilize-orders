import Influencer from '../../domain/entity/Influencer';

export default interface InfluencerRepository {
	getByCoupon(coupon: string): Promise<Influencer | null>;
	getInviter(inviterId: string, companyId: string): Promise<Influencer | null>;
}
