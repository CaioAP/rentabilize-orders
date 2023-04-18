import DateObject from '../../domain/entity/Date';
import OrderStatus, { StatusName } from '../../domain/entity/OrderStatus';

export default function validateFinancialStatement(
	statementId: string | null,
	date: Date,
	status: StatusName,
) {
	const orderStatus = new OrderStatus(undefined, status);
	return (
		!statementId && new DateObject(date).isToday() && orderStatus.isApproved()
	);
}
