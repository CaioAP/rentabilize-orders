export default class Coupon {
	approvedAt?: Date;
	motive?: string;
	stores?: string[];

	constructor(
		readonly companyId: string,
		readonly influencerId: string,
		readonly id: string,
		readonly name: string,
		readonly discount: number,
		readonly observation: string,
		readonly description: string,
		readonly expiration: Date,
		readonly createdAt: Date,
		readonly active: boolean = true,
		readonly approved: boolean = false,
	) {}

	setStores(ids: string[]): void {
		this.stores = ids;
	}

	setMotive(motive: string) {
		this.motive = motive;
	}

	setApprovedAt(approvedAt: Date) {
		this.approvedAt = approvedAt;
	}
}
