import Connection from '../../src/infra/database/Connection';
import PgPromise from '../../src/infra/database/PgPromiseAdapter';
import GetOrderStatus from '../../src/application/usecase/GetOrderStatus';
import OrderStatusRepository from '../../src/application/repository/OrderStatusRepository';
import OrderStatusRepositoryDatabase from '../../src/infra/repository/OrderStatusRepositoryDatabase';
import OrderStatusMapRepository from '../../src/application/repository/OrderStatusMapRepository';
import OrderStatusMapRepositoryDatabase from '../../src/infra/repository/OrderStatusMapRepositoryDatabse';
import MarketplaceStatusRepository from '../../src/application/repository/MarketplaceStatusRepository';
import MarketplaceStatusRepositoryDatabase from '../../src/infra/repository/MarketplaceStatusRepositoryDatabase';

let connection: Connection;
let orderStatusRepository: OrderStatusRepository;
let orderStatusMapRepository: OrderStatusMapRepository;
let marketplaceStatusRepository: MarketplaceStatusRepository;
let getOrderStatus: GetOrderStatus;

beforeEach(async function () {
	connection = new PgPromise();
	orderStatusRepository = new OrderStatusRepositoryDatabase(connection);
	orderStatusMapRepository = new OrderStatusMapRepositoryDatabase(connection);
	marketplaceStatusRepository = new MarketplaceStatusRepositoryDatabase(
		connection,
	);
	getOrderStatus = new GetOrderStatus(
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
	const orderStatus = await getOrderStatus.execute(input);
	expect(orderStatus).toHaveProperty('name', 'Aprovado');
});
