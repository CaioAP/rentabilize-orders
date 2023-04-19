import DateObject from './Date';
import OrderStatus, { StatusName } from './OrderStatus';
import Price from './Price';

export default class FinancialStatement {
	saleId?: string;
	userId?: string;

	constructor(
		readonly companyId: string,
		readonly influencerId: string,
		readonly id: string | undefined,
		readonly comission: number,
		readonly amount: Price,
		readonly date: Date,
		readonly type: 'CREDITO' | 'DEBITO',
		readonly available: boolean = false,
		saleId?: string,
		userId?: string,
	) {
		this.saleId = saleId;
		this.userId = userId;
	}

	isValidToCreate(status: StatusName): boolean {
		return (
			!!this.id &&
			new DateObject(this.date).isToday() &&
			new OrderStatus(undefined, status).isApproved()
		);
	}
}
