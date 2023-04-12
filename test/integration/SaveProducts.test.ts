import Sinon from 'sinon';
import SaveOrders from '../../src/application/usecase/SearchOrders';
import Store from '../../src/domain/entity/Store';
import StoreGatewayHttp from '../../src/infra/gateway/StoreGatewayHttp';
import AxiosAdapter from '../../src/infra/http/AxiosAdapter';
import StoreData from '../data/StoreData';
import Connection from '../../src/infra/database/Connection';
import PgPromise from '../../src/infra/database/PgPromiseAdapter';
import ProductRepository from '../../src/application/repository/ProductRepository';
import ProductRepositoryDatabase from '../../src/infra/repository/ProductRepositoryDatabase';
import SaveProducts from '../../src/application/usecase/SaveProducts';

let connection: Connection;
let saveProducts: SaveProducts;
let productRepository: ProductRepository;
let store: Store;

beforeEach(async function () {
	store = new Store(
		'New Hair',
		'https://loja.newhairoficial.com.br',
		'skKeRUlClgTIwVf7RrgPOTKZcRgs4zxyecReWH4vijYJJzgTiKGir1hrYm2eaeHV4eyHFmWzKpKhpLeLOfM5za8xV5muOY33vrpLqXvaTXhOVg6gTJ4uJP7yQsbBWFlMQtapZ34AYxUD3sjATyrG0SGr1X3gB00Uz2K23k71vhLg3nIC2yigTPkf4QJFnECrI60JtJfZZ20VLpSWExeiedXTIbuIeyigpSQuWoJvpk4UkylIrHnIfPVToIIPe3IT',
		'Senha123',
	);
	connection = new PgPromise();
	const httpClient = new AxiosAdapter();
	const storeGateway = new StoreGatewayHttp(httpClient);
	productRepository = new ProductRepositoryDatabase(connection);
	saveProducts = new SaveProducts(storeGateway, productRepository);
});

afterEach(async function () {
	await connection.close();
});

test('Deve salvar os produtos a partir dos dados buscados da loja', async function () {
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
	const [result] = await saveProducts.execute({ store, date });
	expect(result).toHaveProperty('sku', '13542');
	stubStoreGateway.restore();
});

test('Deve alterar os produtos a partir dos dados buscados da loja', async function () {
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
	const [result] = await saveProducts.execute({ store, date });
	expect(result).toHaveProperty('sku', '13542');
	stubStoreGateway.restore();
});
