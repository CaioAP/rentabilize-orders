import FinancialStatementRepository from '../../src/application/repository/FinancialStatementRepository';
import InfluencerRepository from '../../src/application/repository/InfluencerRepository';
import GetInfluencerByCoupon from '../../src/application/usecase/GetInfluencerByCoupon';
import Connection from '../../src/infra/database/Connection';
import PgPromise from '../../src/infra/database/PgPromiseAdapter';
import FinancialStatementRepositoryDatabase from '../../src/infra/repository/FinancialStatementRepositoryDatabase';
import InfluencerRepositoryDatabase from '../../src/infra/repository/InfluencerRepositoryDatabase';

let connection: Connection;
let getInfluencerByCoupon: GetInfluencerByCoupon;
let influencerRepository: InfluencerRepository;
let financialStatementRepository: FinancialStatementRepository;

beforeEach(async function () {
	connection = new PgPromise();
	influencerRepository = new InfluencerRepositoryDatabase(connection);
	financialStatementRepository = new FinancialStatementRepositoryDatabase(
		connection,
	);
	getInfluencerByCoupon = new GetInfluencerByCoupon(influencerRepository);
});

afterEach(async function () {
	await connection.close();
});

test('Deve buscar o influenciador do marketplace', async function () {
	const input = {
		coupon: 'cabeluda',
	};
	const coupon = await getInfluencerByCoupon.execute(input);
	expect(coupon).toHaveProperty('id', '9ce732da-34a9-4adb-89c1-557693638420');
});

test('Não deve buscar o influenciador caso o cupom não exista', async function () {
	const input = {
		coupon: 'cabeludao',
	};
	const coupon = await getInfluencerByCoupon.execute(input);
	expect(coupon).toBe(null);
});

test('Não deve buscar extrato financeiro inexistente', async function () {
	const input = {
		saleId: '12345',
		companyId: 'c975f02c-cee8-4630-9fa8-239cc590dfe1',
		influencerId: '9ce732da-34a9-4adb-89c1-557693638420',
	};
	const statement = await financialStatementRepository.getByFilter(
		input.saleId,
		input.companyId,
		input.influencerId,
	);
	expect(statement).toBe(null);
});
