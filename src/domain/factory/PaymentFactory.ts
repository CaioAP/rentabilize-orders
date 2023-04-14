export default class PaymentFactory {
	readonly paymentObject: { [key: string]: string } = {
		pagarme_pix: 'PIX',
		pagarme_boleto: 'Boleto',
		pagarme_cartao: 'Cartão de crédito',
		erederest5: 'Cartão de crédito',
	};

	getPayment(type: string): string {
		return this.paymentObject[type];
	}
}
