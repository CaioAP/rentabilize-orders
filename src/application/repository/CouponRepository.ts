import Coupon from '../../domain/entity/Coupon';

export default interface CouponRepository {
	getByName(name: string): Promise<Coupon | null>;
}
