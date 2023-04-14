import Usecase from './Usecase';
import Coupon from '../../domain/entity/Coupon';
import CouponRepository from '../repository/CouponRepository';

export default class GetCouponFromMarketplace implements Usecase {
	constructor(readonly couponRepository: CouponRepository) {}

	async execute(input: Input): Promise<Coupon | null> {
		return await this.couponRepository.getByName(input.coupon);
	}
}

type Input = {
	coupon: string;
};
