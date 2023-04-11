import { compareAsc, format } from 'date-fns';

export default class DateObject {
	constructor(readonly date: Date) {}

	format(pattern: string) {
		return format(this.date, pattern);
	}

	isGreaterThan(date: Date): boolean {
		const compared = compareAsc(this.date, date);
		return compared === 1;
	}
}
