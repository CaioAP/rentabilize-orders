import Influencer from '../../domain/entity/Influencer';
import InfluencerRepository from '../repository/InfluencerRepository';
import Usecase from './Usecase';

export default class GetInfluencerByCoupon implements Usecase {
	constructor(readonly influencerRepository: InfluencerRepository) {}

	async execute(input: Input): Promise<Influencer | null> {
		return await this.influencerRepository.getByCoupon(input.coupon);
	}
}

type Input = {
	coupon: string;
};
