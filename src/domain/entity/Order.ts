import DateObject from './Date';
import OrderItem from './OrderItem';
import OrderStatus from './OrderStatus';
import PaymentType from './PaymentType';
import Price from './Price';

export default class Order {
	readonly items: OrderItem[];
	payment?: PaymentType;
	uuid?: string;

	constructor(
		readonly id: string,
		readonly amount: Price,
		readonly discount: Price,
		readonly created: DateObject,
		readonly modified: DateObject,
		readonly status: OrderStatus,
		readonly storeId: string,
	) {
		this.items = [];
	}
}
