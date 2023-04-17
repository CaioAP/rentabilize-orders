import InfluencerRepository from '../../src/application/repository/InfluencerRepository';
import GetInfluencerByCouponFromMarketplace from '../../src/application/usecase/GetInfluencerByCouponFromMarketplace';
import Connection from '../../src/infra/database/Connection';
import PgPromise from '../../src/infra/database/PgPromiseAdapter';
import InfluencerRepositoryDatabase from '../../src/infra/repository/InfluencerRepositoryDatabase';

let connection: Connection;
let influencerRepository: InfluencerRepository;
let getInfluencerByCouponFromMarketplace: GetInfluencerByCouponFromMarketplace;

beforeEach(async function () {
	connection = new PgPromise();
	influencerRepository = new InfluencerRepositoryDatabase(connection);
	getInfluencerByCouponFromMarketplace =
		new GetInfluencerByCouponFromMarketplace(influencerRepository);
});

afterEach(async function () {
	await connection.close();
});

test('Deve buscar o influenciador do pedido do marketplace', async function () {
	const input = {
		coupon: 'cabeluda',
	};
	const coupon = await getInfluencerByCouponFromMarketplace.execute(input);
	expect(coupon).toHaveProperty('id', '9ce732da-34a9-4adb-89c1-557693638420');
});

test('Não deve buscar o influenciador caso o pedido não tenha cupom', async function () {
	const input = {
		coupon: '',
	};
	const coupon = await getInfluencerByCouponFromMarketplace.execute(input);
	expect(coupon).toBe(null);
});
