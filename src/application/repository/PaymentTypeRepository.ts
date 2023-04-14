import PaymentType from '../../domain/entity/PaymentType';

export default interface PaymentTypeRepository {
	getByName(name: string): Promise<PaymentType>;
}
