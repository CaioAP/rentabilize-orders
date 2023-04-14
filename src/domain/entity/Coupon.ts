import DateObject from './Date';

export default class Coupon {
	approvedAt?: DateObject;
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
		readonly expiration: DateObject,
		readonly createdAt: DateObject,
		readonly active: boolean = true,
		readonly approved: boolean = false,
	) {}

	setStores(ids: string[]): void {
		this.stores = ids;
	}

	setMotive(motive: string) {
		this.motive = motive;
	}

	setApprovedAt(approvedAt: DateObject) {
		this.approvedAt = approvedAt;
	}
}
