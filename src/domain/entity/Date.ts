import { format } from "date-fns";

export default class DateObject {
	constructor(readonly date: Date) {}

	format(pattern: string) {
		return format(this.date, pattern);
	}
}
