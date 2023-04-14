import PaymentTypeRepository from '../../src/application/repository/PaymentTypeRepository';
import GetPaymentTypeFromMarketplacePayment from '../../src/application/usecase/GetPaymentTypeFromMarketplacePayment';
import Connection from '../../src/infra/database/Connection';
import PgPromise from '../../src/infra/database/PgPromiseAdapter';
import PaymentTypeRepositoryDatabase from '../../src/infra/repository/PaymentTypeRepositoryDatabase';

let connection: Connection;
let paymentTypeRepository: PaymentTypeRepository;
let getPaymentTypeFromMarketplacePayment: GetPaymentTypeFromMarketplacePayment;

beforeEach(async function () {
	connection = new PgPromise();
	paymentTypeRepository = new PaymentTypeRepositoryDatabase(connection);
	getPaymentTypeFromMarketplacePayment =
		new GetPaymentTypeFromMarketplacePayment(paymentTypeRepository);
});

afterEach(async function () {
	await connection.close();
});

test('Deve buscar o tipo de pagamento de pedido pelo pagamento do marketplace', async function () {
	const input = {
		payment: 'pagarme_cartao',
	};
	const paymentType = await getPaymentTypeFromMarketplacePayment.execute(input);
	expect(paymentType).toHaveProperty('name', 'Cartão de crédito');
});
