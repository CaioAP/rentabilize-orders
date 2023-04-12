import Sinon from 'sinon';
import SaveOrders from '../../src/application/usecase/SaveOrders';
import Store from '../../src/domain/entity/Store';
import StoreGatewayHttp from '../../src/infra/gateway/StoreGatewayHttp';
import AxiosAdapter from '../../src/infra/http/AxiosAdapter';
import StoreData from '../data/StoreData';
import Connection from '../../src/infra/database/Connection';
import PgPromise from '../../src/infra/database/PgPromiseAdapter';
import ClientRepositoryDatabase from '../../src/infra/repository/ClientRepositoryDatabase';
import ClientRepository from '../../src/application/repository/ClientRepository';

let connection: Connection;
let saveOrders: SaveOrders;
let clientRepository: ClientRepository;
let store: Store;

beforeEach(async function () {
	store = new Store(
		'New Hair',
		'https://loja.newhairoficial.com.br',
		'skKeRUlClgTIwVf7RrgPOTKZcRgs4zxyecReWH4vijYJJzgTiKGir1hrYm2eaeHV4eyHFmWzKpKhpLeLOfM5za8xV5muOY33vrpLqXvaTXhOVg6gTJ4uJP7yQsbBWFlMQtapZ34AYxUD3sjATyrG0SGr1X3gB00Uz2K23k71vhLg3nIC2yigTPkf4QJFnECrI60JtJfZZ20VLpSWExeiedXTIbuIeyigpSQuWoJvpk4UkylIrHnIfPVToIIPe3IT',
		'Senha123'
	);
	connection = new PgPromise();
	const httpClient = new AxiosAdapter();
	const storeGateway = new StoreGatewayHttp(httpClient);
	clientRepository = new ClientRepositoryDatabase(connection);
	saveOrders = new SaveOrders(storeGateway, clientRepository);
});

afterEach(async function () {
	await connection.close();
});

test('Não deve buscar os pedidos da loja com a data maior que o dia atual', async function () {
	const date = new Date('2025-04-10');
	await expect(() => saveOrders.execute({ store, date })).rejects.toThrow(
		new Error('Invalid date')
	);
});

test('Deve salvar o cliente a aprtir do dado retornado da loja', async function () {
	const date = new Date('2023-04-10');
	const stubStoreGateway = Sinon.stub(
		StoreGatewayHttp.prototype,
		'getOrders'
	).resolves({
		objects: [
			{
				...StoreData,
			},
		],
	});
	const result = await saveOrders.execute({ store, date });
	console.log(result.clients);
	expect(result.clients).toHaveLength(1);
	expect(result.clients[0]).toBeTruthy();
	stubStoreGateway.restore();
});
