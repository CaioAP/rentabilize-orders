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
}
