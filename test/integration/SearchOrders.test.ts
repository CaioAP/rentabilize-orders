import Store from '../../src/domain/entity/Store';
import AxiosAdapter from '../../src/infra/http/AxiosAdapter';
import Connection from '../../src/infra/database/Connection';
import PgPromise from '../../src/infra/database/PgPromiseAdapter';
import StoreGatewayHttp from '../../src/infra/gateway/StoreGatewayHttp';
import SearchOrders from '../../src/application/usecase/SearchOrders';
import Sinon from 'sinon';
import StoreData from '../data/StoreData';

let connection: Connection;
let searchOrders: SearchOrders;
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
	searchOrders = new SearchOrders(storeGateway);
});

afterEach(async function () {
	await connection.close();
});

test('Não deve buscar os pedidos da loja com a data maior que o dia atual', async function () {
	const date = new Date('2025-04-10');
	await expect(() => searchOrders.execute({ store, date })).rejects.toThrow(
		new Error('Invalid date'),
	);
});

test('Deve buscar os pedidos da loja', async function () {
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
	const { objects } = await searchOrders.execute({ store, date });
	expect(objects).toHaveLength(1);
	expect(objects[0]).toHaveProperty('cliente', 'Joao da Silva');
	stubStoreGateway.restore();
});
