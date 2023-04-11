import { format, isAfter } from 'date-fns';

export default class DateObject {
	constructor(readonly date: Date) {}

	format(pattern: string) {
		return format(this.date, pattern);
	}

	isAfter(date: Date): boolean {
		return isAfter(this.date, date);
	}
}
