import PaymentType from '../../domain/entity/PaymentType';
import PaymentFactory from '../../domain/factory/PaymentFactory';
import PaymentTypeRepository from '../repository/PaymentTypeRepository';

export default class GetPaymentTypeFromMarketplace {
	constructor(readonly paymentTypeRepository: PaymentTypeRepository) {}

	async execute(input: Input): Promise<PaymentType> {
		const paymentFactory = new PaymentFactory();
		const payment = paymentFactory.getPayment(input.payment);
		return await this.paymentTypeRepository.getByName(payment);
	}
}

type Input = {
	payment: string;
};
