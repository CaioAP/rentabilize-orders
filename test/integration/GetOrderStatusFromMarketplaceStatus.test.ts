import Connection from '../../src/infra/database/Connection';
import PgPromise from '../../src/infra/database/PgPromiseAdapter';
import GetOrderStatusFromMarketplaceStatus from '../../src/application/usecase/GetOrderStatusFromMarketplaceStatus';
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
let getOrderStatusFromMarketplaceStatus: GetOrderStatusFromMarketplaceStatus;

beforeEach(async function () {
	connection = new PgPromise();
	orderStatusRepository = new OrderSstatusRepositoryDatabase(connection);
	orderStatusMapRepository = new OrderStatusMapRepositoryDatabase(connection);
	marketplaceStatusRepository = new MarketplaceStatusRepositoryDatabase(
		connection,
	);
	getOrderStatusFromMarketplaceStatus = new GetOrderStatusFromMarketplaceStatus(
		orderStatusRepository,
		orderStatusMapRepository,
		marketplaceStatusRepository,
	);
});

afterEach(async function () {
	await connection.close();
});

test('Deve buscar os status de pedido pelo status do marketplace', async function () {
	const input = {
		status: 'Pagamento aprovado',
	};
	const orderStatus = await getOrderStatusFromMarketplaceStatus.execute(input);
	expect(orderStatus).toHaveProperty('name', 'Aprovado');
});
