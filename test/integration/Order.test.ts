import OrderRepository from '../../src/application/repository/OrderRepository';
import GetOrder from '../../src/application/usecase/GetOrder';
import Store from '../../src/domain/entity/Store';
import Connection from '../../src/infra/database/Connection';
import PgPromise from '../../src/infra/database/PgPromiseAdapter';
import OrderRepositoryDatabase from '../../src/infra/repository/OrderRepositoryDatabase';

let connection: Connection;
// let saveOrders: SaveOrders;
let getOrder: GetOrder;
let orderRepository: OrderRepository;
let store: Store;

beforeEach(async function () {
	store = new Store(
		'New Hair',
		'https://loja.newhairoficial.com.br',
		'skKeRUlClgTIwVf7RrgPOTKZcRgs4zxyecReWH4vijYJJzgTiKGir1hrYm2eaeHV4eyHFmWzKpKhpLeLOfM5za8xV5muOY33vrpLqXvaTXhOVg6gTJ4uJP7yQsbBWFlMQtapZ34AYxUD3sjATyrG0SGr1X3gB00Uz2K23k71vhLg3nIC2yigTPkf4QJFnECrI60JtJfZZ20VLpSWExeiedXTIbuIeyigpSQuWoJvpk4UkylIrHnIfPVToIIPe3IT',
		'Senha123',
	);
	connection = new PgPromise();
	// const httpClient = new AxiosAdapter();
	// const storeGateway = new StoreGatewayHttp(httpClient);
	orderRepository = new OrderRepositoryDatabase(connection);
	// saveOrders = new SaveOrders(storeGateway, orderRepository);
	getOrder = new GetOrder(orderRepository);
});

afterEach(async function () {
	await connection.close();
});

test('Deve buscar um pedido não existente', async function () {
	const input = {
		idExt: '12345',
	};
	const order = await getOrder.execute(input);
	expect(order).toBe(null);
});

// test('Deve salvar os pedidos a partir dos dados buscados da loja', async function () {
// 	const date = new Date('2023-04-10');
// 	const stubStoreGateway = Sinon.stub(
// 		StoreGatewayHttp.prototype,
// 		'getOrders',
// 	).resolves({
// 		objects: [
// 			{
// 				...StoreData,
// 			},
// 		],
// 	});
// 	const [result] = await saveOrders.execute({ store, date });
// 	expect(result).toHaveProperty('idExt', '58123');
// 	stubStoreGateway.restore();
// });

// test.skip('Deve atualizar os pedidos a partir dos dados buscados da loja', async function () {
// 	const date = new Date('2023-04-10');
// 	const stubStoreGateway = Sinon.stub(
// 		StoreGatewayHttp.prototype,
// 		'getOrders',
// 	).resolves({
// 		objects: [
// 			{
// 				...StoreData,
// 			},
// 		],
// 	});
// 	const result = await saveOrders.execute({ store, date });
// 	expect(result).toHaveLength(1);
// 	expect(result[0]).toHaveProperty('idExt', '58123');
// 	stubStoreGateway.restore();
// });
