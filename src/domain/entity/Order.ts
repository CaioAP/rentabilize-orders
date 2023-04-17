import Coupon from './Coupon';
import DateObject from './Date';
import OrderItem from './OrderItem';
import OrderStatus from './OrderStatus';
import PaymentType from './PaymentType';
import Price from './Price';

export default class Order {
	readonly items: OrderItem[];

	constructor(
		readonly id: string,
		readonly idExt: string,
		readonly amount: Price,
		readonly discount: Price,
		readonly createdAt: DateObject,
		readonly modifiedAt: DateObject,
		readonly status: OrderStatus,
		readonly payment: PaymentType,
		readonly storeId: string,
		readonly clientId: string,
		readonly couponId?: string | null,
		readonly observation?: string | null,
	) {
		this.items = [];
	}
}
