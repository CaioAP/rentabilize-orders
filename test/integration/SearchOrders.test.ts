import Sinon from 'sinon';
import SearchOrders from '../../src/application/usecase/SearchOrders';
import Store from '../../src/domain/entity/Store';
import StoreGatewayHttp from '../../src/infra/gateway/StoreGatewayHttp';
import AxiosAdapter from '../../src/infra/http/AxiosAdapter';
import SearchOrdersStoreData from '../data/SearchOrdersStoreData';

let searchOrders: SearchOrders;

beforeEach(async function () {
	const httpClient = new AxiosAdapter();
	const storeGateway = new StoreGatewayHttp(httpClient);
	searchOrders = new SearchOrders(storeGateway);
});

test('Deve buscar os pedidos da loja', async function () {
	const date = new Date('2023-04-10');
	const store = new Store(
		'New Hair',
		'https://loja.newhairoficial.com.br',
		'skKeRUlClgTIwVf7RrgPOTKZcRgs4zxyecReWH4vijYJJzgTiKGir1hrYm2eaeHV4eyHFmWzKpKhpLeLOfM5za8xV5muOY33vrpLqXvaTXhOVg6gTJ4uJP7yQsbBWFlMQtapZ34AYxUD3sjATyrG0SGr1X3gB00Uz2K23k71vhLg3nIC2yigTPkf4QJFnECrI60JtJfZZ20VLpSWExeiedXTIbuIeyigpSQuWoJvpk4UkylIrHnIfPVToIIPe3IT',
		'Senha123'
	);
	const stubStoreGateway = Sinon.stub(
		StoreGatewayHttp.prototype,
		'getOrders'
	).resolves({
		objects: [
			{
				...SearchOrdersStoreData,
			},
		],
	});
	const orders = await searchOrders.execute({ store, date });
	console.log(orders);
	expect(orders).toHaveProperty('objects');
	expect(orders.objects).toHaveLength(1);
	stubStoreGateway.restore();
});
