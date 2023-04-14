import { format, isAfter, isDate, isValid } from 'date-fns';

export default class DateObject {
	readonly value: Date;

	constructor(value: Date | string) {
		value = new Date(value);
		if (!isValid(value)) throw new Error('Invalid date');
		this.value = value;
	}

	format(pattern: string) {
		return format(this.value, pattern);
	}

	isAfter(date: Date): boolean {
		return isAfter(this.value, date);
	}
}
