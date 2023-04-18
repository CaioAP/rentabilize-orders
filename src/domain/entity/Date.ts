import { format, isAfter, isDate, isToday, isValid, parse } from 'date-fns';

export default class DateObject {
	constructor(readonly value: Date | string) {}

	format(pattern: string) {
		return format(new Date(this.value), pattern);
	}

	parse(): Date {
		if (typeof this.value === 'string')
			return parse(this.value, 'yyyy-MM-dd', new Date());
		return this.value;
	}

	isValid(): boolean {
		return isValid(this.value);
	}

	isAfter(date: Date): boolean {
		return isAfter(new Date(this.value), date);
	}

	isToday(): boolean {
		return isToday(new Date(this.value));
	}
}
