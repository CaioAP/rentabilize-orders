import DateObject from './Date';
import OrderStatus, { StatusName } from './OrderStatus';
import Price from './Price';

export default class FinancialStatement {
	type: 'CREDITO' | 'DEBITO';
	available: boolean;
	saleId?: string;
	userId?: string;

	constructor(
		readonly companyId: string,
		readonly influencerId: string,
		readonly id: string | undefined,
		readonly comission: number,
		readonly amount: Price,
		readonly date: Date,
		type: 'CREDITO' | 'DEBITO',
		available: boolean = false,
		saleId?: string,
		userId?: string,
	) {
		this.type = type;
		this.available = available;
		this.saleId = saleId;
		this.userId = userId;
	}

	isValidToCreate(status: StatusName): boolean {
		return (
			!this.id &&
			new DateObject(this.date).isToday() &&
			new OrderStatus(undefined, status).isApproved()
		);
	}
}
