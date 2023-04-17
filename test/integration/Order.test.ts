import Sinon from 'sinon';
import ClientRepository from '../../src/application/repository/ClientRepository';
import CouponRepository from '../../src/application/repository/CouponRepository';
import MarketplaceStatusRepository from '../../src/application/repository/MarketplaceStatusRepository';
import OrderRepository from '../../src/application/repository/OrderRepository';
import OrderStatusMapRepository from '../../src/application/repository/OrderStatusMapRepository';
import OrderStatusRepository from '../../src/application/repository/OrderStatusRepository';
import PaymentTypeRepository from '../../src/application/repository/PaymentTypeRepository';
import GetOrder from '../../src/application/usecase/GetOrder';
import GetOrderStatus from '../../src/application/usecase/GetOrderStatus';
import SaveOrders from '../../src/application/usecase/SaveOrders';
import SearchOrders from '../../src/application/usecase/SearchOrders';
import Store from '../../src/domain/entity/Store';
import Connection from '../../src/infra/database/Connection';
import PgPromise from '../../src/infra/database/PgPromiseAdapter';
import StoreGatewayHttp from '../../src/infra/gateway/StoreGatewayHttp';
import AxiosAdapter from '../../src/infra/http/AxiosAdapter';
import ClientRepositoryDatabase from '../../src/infra/repository/ClientRepositoryDatabase';
import CouponRepositoryDatabase from '../../src/infra/repository/CouponRepositoryDatabase';
import MarketplaceStatusRepositoryDatabase from '../../src/infra/repository/MarketplaceStatusRepositoryDatabase';
import OrderRepositoryDatabase from '../../src/infra/repository/OrderRepositoryDatabase';
import OrderStatusMapRepositoryDatabase from '../../src/infra/repository/OrderStatusMapRepositoryDatabse';
import OrderStatusRepositoryDatabase from '../../src/infra/repository/OrderStatusRepositoryDatabase';
import PaymentTypeRepositoryDatabase from '../../src/infra/repository/PaymentTypeRepositoryDatabase';
import StoreData from '../data/StoreData';
import SaveClient from '../../src/application/usecase/SaveClient';
import Client from '../../src/domain/entity/Client';
import SaveProducts from '../../src/application/usecase/SaveProducts';
import ProductRepository from '../../src/application/repository/ProductRepository';
import ProductRepositoryDatabase from '../../src/infra/repository/ProductRepositoryDatabase';

let connection: Connection;
let searchOrders: SearchOrders;
let saveOrders: SaveOrders;
let getOrder: GetOrder;
let getOrderStatus: GetOrderStatus;
let saveClient: SaveClient;
let saveProducts: SaveProducts;
let orderRepository: OrderRepository;
let orderStatusRepository: OrderStatusRepository;
let orderStatusMapRepository: OrderStatusMapRepository;
let marketplaceStatusRepository: MarketplaceStatusRepository;
let paymentTypeRepository: PaymentTypeRepository;
let couponRepository: CouponRepository;
let clientRepository: ClientRepository;
let productRepository: ProductRepository;
let store: Store;

beforeEach(async function () {
	store = new Store(
		'2f01c15a-e882-44ac-aedf-5f2754f24404',
		'New Hair',
		'https://loja.newhairoficial.com.br',
		'skKeRUlClgTIwVf7RrgPOTKZcRgs4zxyecReWH4vijYJJzgTiKGir1hrYm2eaeHV4eyHFmWzKpKhpLeLOfM5za8xV5muOY33vrpLqXvaTXhOVg6gTJ4uJP7yQsbBWFlMQtapZ34AYxUD3sjATyrG0SGr1X3gB00Uz2K23k71vhLg3nIC2yigTPkf4QJFnECrI60JtJfZZ20VLpSWExeiedXTIbuIeyigpSQuWoJvpk4UkylIrHnIfPVToIIPe3IT',
		'Senha123',
	);
	connection = new PgPromise();
	const httpClient = new AxiosAdapter();
	const storeGateway = new StoreGatewayHttp(httpClient);
	orderRepository = new OrderRepositoryDatabase(connection);
	orderStatusRepository = new OrderStatusRepositoryDatabase(connection);
	orderStatusMapRepository = new OrderStatusMapRepositoryDatabase(connection);
	marketplaceStatusRepository = new MarketplaceStatusRepositoryDatabase(
		connection,
	);
	paymentTypeRepository = new PaymentTypeRepositoryDatabase(connection);
	couponRepository = new CouponRepositoryDatabase(connection);
	clientRepository = new ClientRepositoryDatabase(connection);
	productRepository = new ProductRepositoryDatabase(connection);
	searchOrders = new SearchOrders(storeGateway);
	getOrder = new GetOrder(orderRepository);
	getOrderStatus = new GetOrderStatus(
		orderStatusRepository,
		orderStatusMapRepository,
		marketplaceStatusRepository,
	);
	saveClient = new SaveClient(clientRepository);
	saveProducts = new SaveProducts(productRepository);
	saveOrders = new SaveOrders(
		searchOrders,
		getOrderStatus,
		saveClient,
		orderRepository,
	);
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

test('Deve salvar um cliente do marketplace', async function () {
	const client = await saveClient.execute({
		cpfCnpj: '111.444.777-35',
		name: 'Joao da Silva',
		email: 'joaodasilva@hotmail.com',
		birthdate: '1996-05-25',
		sex: 'masculino',
	});
	expect(client).toHaveProperty('email', 'joaodasilva@hotmail.com');
});

test('Deve salvar os produtos do marketplace', async function () {
	const input = {
		storeId: store.id,
		products: [
			{
				sku: '13542',
				name: 'mascara de cabelo',
				price: 156,
			},
		],
	};
	const [product] = await saveProducts.execute(input);
	expect(product).toHaveProperty('sku', '13542');
});

test('Deve alterar os produtos do marketplace', async function () {
	const input = {
		storeId: store.id,
		products: [
			{
				sku: '13542',
				name: 'mascara de cabelo',
				price: 156,
			},
		],
	};
	const [result] = await saveProducts.execute(input);
	expect(result).toHaveProperty('sku', '13542');
});

test('Deve salvar um pedido do marketplace', async function () {
	const date = new Date('2023-04-10');
	const stubStoreGateway = Sinon.stub(
		StoreGatewayHttp.prototype,
		'getOrders',
	).resolves({
		objects: [
			{
				...StoreData,
			},
		],
	});
	const [order] = await saveOrders.execute({ store, date });
	expect(order).toHaveProperty('idExt', '58123');
	stubStoreGateway.restore();
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
