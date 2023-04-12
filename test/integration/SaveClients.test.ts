import Sinon from 'sinon';
import ClientRepository from '../../src/application/repository/ClientRepository';
import Store from '../../src/domain/entity/Store';
import Connection from '../../src/infra/database/Connection';
import PgPromise from '../../src/infra/database/PgPromiseAdapter';
import StoreGatewayHttp from '../../src/infra/gateway/StoreGatewayHttp';
import AxiosAdapter from '../../src/infra/http/AxiosAdapter';
import ClientRepositoryDatabase from '../../src/infra/repository/ClientRepositoryDatabase';
import StoreData from '../data/StoreData';
import SaveClients from '../../src/application/usecase/SaveClients';

let connection: Connection;
let saveClients: SaveClients;
let clientRepository: ClientRepository;
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
	clientRepository = new ClientRepositoryDatabase(connection);
	saveClients = new SaveClients(storeGateway, clientRepository);
});

afterEach(async function () {
	await connection.close();
});

test('Deve salvar os clientes a partir dos dados buscados da loja', async function () {
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
	const [result] = await saveClients.execute({ store, date });
	expect(result).toHaveProperty('name', 'Joao da Silva');
	stubStoreGateway.restore();
});

test('Deve atualizar os clientes a partir dos dados buscados da loja', async function () {
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
	const result = await saveClients.execute({ store, date });
	expect(result).toHaveLength(1);
	expect(result[0]).toHaveProperty('name', 'Joao da Silva');
	stubStoreGateway.restore();
});
