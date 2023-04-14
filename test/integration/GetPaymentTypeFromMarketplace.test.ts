import PaymentTypeRepository from '../../src/application/repository/PaymentTypeRepository';
import GetPaymentTypeFromMarketplace from '../../src/application/usecase/GetPaymentTypeFromMarketplace';
import Connection from '../../src/infra/database/Connection';
import PgPromise from '../../src/infra/database/PgPromiseAdapter';
import PaymentTypeRepositoryDatabase from '../../src/infra/repository/PaymentTypeRepositoryDatabase';

let connection: Connection;
let paymentTypeRepository: PaymentTypeRepository;
let getPaymentTypeFromMarketplace: GetPaymentTypeFromMarketplace;

beforeEach(async function () {
	connection = new PgPromise();
	paymentTypeRepository = new PaymentTypeRepositoryDatabase(connection);
	getPaymentTypeFromMarketplace = new GetPaymentTypeFromMarketplace(
		paymentTypeRepository,
	);
});

afterEach(async function () {
	await connection.close();
});

test('Deve buscar o tipo de pagamento do pedido do marketplace', async function () {
	const input = {
		payment: 'pagarme_cartao',
	};
	const paymentType = await getPaymentTypeFromMarketplace.execute(input);
	expect(paymentType).toHaveProperty('name', 'Cartão de crédito');
});
