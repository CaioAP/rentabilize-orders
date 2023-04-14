import Connection from '../../src/infra/database/Connection';
import PgPromise from '../../src/infra/database/PgPromiseAdapter';
import GetOrderStatusFromMarketplace from '../../src/application/usecase/GetOrderStatusFromMarketplace';
import OrderStatusRepository from '../../src/application/repository/OrderStatusRepository';
import OrderSstatusRepositoryDatabase from '../../src/infra/repository/OrderStatusRepositoryDatabase';
import OrderStatusMapRepository from '../../src/application/repository/OrderStatusMapRepository';
import OrderStatusMapRepositoryDatabase from '../../src/infra/repository/OrderStatusMapRepositoryDatabse';
import MarketplaceStatusRepository from '../../src/application/repository/MarketplaceStatusRepository';
import MarketplaceStatusRepositoryDatabase from '../../src/infra/repository/MarketplaceStatusRepositoryDatabase';

let connection: Connection;
let orderStatusRepository: OrderStatusRepository;
let orderStatusMapRepository: OrderStatusMapRepository;
let marketplaceStatusRepository: MarketplaceStatusRepository;
let getOrderStatusFromMarketplace: GetOrderStatusFromMarketplace;

beforeEach(async function () {
	connection = new PgPromise();
	orderStatusRepository = new OrderSstatusRepositoryDatabase(connection);
	orderStatusMapRepository = new OrderStatusMapRepositoryDatabase(connection);
	marketplaceStatusRepository = new MarketplaceStatusRepositoryDatabase(
		connection,
	);
	getOrderStatusFromMarketplace = new GetOrderStatusFromMarketplace(
		orderStatusRepository,
		orderStatusMapRepository,
		marketplaceStatusRepository,
	);
});

afterEach(async function () {
	await connection.close();
});

test('Deve buscar os status do pedido do marketplace', async function () {
	const input = {
		status: 'Pagamento aprovado',
	};
	const orderStatus = await getOrderStatusFromMarketplace.execute(input);
	expect(orderStatus).toHaveProperty('name', 'Aprovado');
});
