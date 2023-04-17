import CouponRepository from '../../src/application/repository/CouponRepository';
import GetCouponFromMarketplace from '../../src/application/usecase/GetCouponFromMarketplace';
import Connection from '../../src/infra/database/Connection';
import PgPromise from '../../src/infra/database/PgPromiseAdapter';
import CouponRepositoryDatabase from '../../src/infra/repository/CouponRepositoryDatabase';

let connection: Connection;
let couponRepository: CouponRepository;
let getCouponFromMarketplace: GetCouponFromMarketplace;

beforeEach(async function () {
	connection = new PgPromise();
	couponRepository = new CouponRepositoryDatabase(connection);
	getCouponFromMarketplace = new GetCouponFromMarketplace(couponRepository);
});

afterEach(async function () {
	await connection.close();
});

test('Deve buscar o cupom do pedido do marketplace', async function () {
	const input = {
		coupon: 'cabeluda',
	};
	const coupon = await getCouponFromMarketplace.execute(input);
	expect(coupon).toHaveProperty('name', 'CABELUDA');
});

test('Não deve buscar o cupom caso o pedido não tenha', async function () {
	const input = {
		coupon: '',
	};
	const coupon = await getCouponFromMarketplace.execute(input);
	expect(coupon).toBe(null);
});
