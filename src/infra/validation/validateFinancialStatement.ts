import DateObject from '../../domain/entity/Date';
import validateOrderStatusApproved from './validateOrderStatusApproved';

export default function validateFinancialStatement(
	statementId: string | null,
	date: Date,
	status: string,
) {
	return (
		!statementId &&
		new DateObject(date).isToday() &&
		validateOrderStatusApproved(status)
	);
}
