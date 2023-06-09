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
import SaveProducts from '../../src/application/usecase/SaveProducts';
import ProductRepository from '../../src/application/repository/ProductRepository';
import ProductRepositoryDatabase from '../../src/infra/repository/ProductRepositoryDatabase';
import GetCoupon from '../../src/application/usecase/GetCoupon';
import GetInfluencerByCoupon from '../../src/application/usecase/GetInfluencerByCoupon';
import InfluencerRepository from '../../src/application/repository/InfluencerRepository';
import InfluencerRepositoryDatabase from '../../src/infra/repository/InfluencerRepositoryDatabase';
import GetPaymentType from '../../src/application/usecase/GetPaymentType';
import FinancialStatementRepositoryDatabase from '../../src/infra/repository/FinancialStatementRepositoryDatabase';
import FinancialStatementRepository from '../../src/application/repository/FinancialStatementRepository';
import SaveFinancialStatement from '../../src/application/usecase/SaveFinancialStatement';
import GetCompany from '../../src/application/usecase/GetCompany';
import CompanyRepository from '../../src/application/repository/CompanyRepository';
import CompanyRepositoryDatabase from '../../src/infra/repository/CompanyRepositoryDatabase';
import GetCommissions from '../../src/application/usecase/GetComissions';
import CommissionRepository from '../../src/application/repository/CommissionRepository';
import CommissionRepositoryDatabase from '../../src/infra/repository/CommissionRepositoryDatabase';
import GetInfluencerInviter from '../../src/application/usecase/GetInfluencerInviter';
import SaveBalance from '../../src/application/usecase/SaveBalance';
import SaveBalanceInvite from '../../src/application/usecase/SaveBalanceInvite';
import BalanceRepository from '../../src/application/repository/BalanceRepository';
import BalanceInviteRepository from '../../src/application/repository/BalanceInviteRepository';
import BalanceRepositoryDatabase from '../../src/infra/repository/BalanceRepositoryDatabase';
import BalanceInviteRepositoryDatabase from '../../src/infra/repository/BalanceInviteRepositoryDatabase';

let connection: Connection;
let searchOrders: SearchOrders;
let saveOrders: SaveOrders;
let saveBalance: SaveBalance;
let saveBalanceInvite: SaveBalanceInvite;
let saveClient: SaveClient;
let saveProducts: SaveProducts;
let saveFinancialStatement: SaveFinancialStatement;
let getOrder: GetOrder;
let getOrderStatus: GetOrderStatus;
let getPaymentType: GetPaymentType;
let getCoupon: GetCoupon;
let getCompany: GetCompany;
let getCommissions: GetCommissions;
let getInfluencerByCoupon: GetInfluencerByCoupon;
let getInfluencerInviter: GetInfluencerInviter;
let orderRepository: OrderRepository;
let orderStatusRepository: OrderStatusRepository;
let orderStatusMapRepository: OrderStatusMapRepository;
let marketplaceStatusRepository: MarketplaceStatusRepository;
let paymentTypeRepository: PaymentTypeRepository;
let companyRepository: CompanyRepository;
let commissionRepository: CommissionRepository;
let couponRepository: CouponRepository;
let clientRepository: ClientRepository;
let productRepository: ProductRepository;
let influencerRepository: InfluencerRepository;
let financialStatementRepository: FinancialStatementRepository;
let balanceRepository: BalanceRepository;
let balanceInviteRepository: BalanceInviteRepository;
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
	companyRepository = new CompanyRepositoryDatabase(connection);
	commissionRepository = new CommissionRepositoryDatabase(connection);
	couponRepository = new CouponRepositoryDatabase(connection);
	clientRepository = new ClientRepositoryDatabase(connection);
	productRepository = new ProductRepositoryDatabase(connection);
	influencerRepository = new InfluencerRepositoryDatabase(connection);
	financialStatementRepository = new FinancialStatementRepositoryDatabase(
		connection,
	);
	balanceRepository = new BalanceRepositoryDatabase(connection);
	balanceInviteRepository = new BalanceInviteRepositoryDatabase(connection);
	searchOrders = new SearchOrders(storeGateway);
	getOrder = new GetOrder(orderRepository);
	getOrderStatus = new GetOrderStatus(
		orderStatusRepository,
		orderStatusMapRepository,
		marketplaceStatusRepository,
	);
	getPaymentType = new GetPaymentType(paymentTypeRepository);
	getCoupon = new GetCoupon(couponRepository);
	getCompany = new GetCompany(companyRepository);
	getCommissions = new GetCommissions(commissionRepository);
	getInfluencerByCoupon = new GetInfluencerByCoupon(influencerRepository);
	getInfluencerInviter = new GetInfluencerInviter(influencerRepository);
	saveClient = new SaveClient(clientRepository);
	saveProducts = new SaveProducts(productRepository);
	saveBalance = new SaveBalance(balanceRepository);
	saveBalanceInvite = new SaveBalanceInvite(balanceInviteRepository);
	saveFinancialStatement = new SaveFinancialStatement(
		getCompany,
		getCommissions,
		getInfluencerByCoupon,
		getInfluencerInviter,
		saveBalance,
		saveBalanceInvite,
		financialStatementRepository,
	);
	saveOrders = new SaveOrders(
		searchOrders,
		getOrderStatus,
		getPaymentType,
		getCoupon,
		saveClient,
		saveProducts,
		saveFinancialStatement,
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

test('Deve buscar os status do pedido do marketplace', async function () {
	const input = {
		status: 'Pagamento aprovado',
	};
	const orderStatus = await getOrderStatus.execute(input);
	expect(orderStatus).toHaveProperty('name', 'Aprovado');
});

test('Deve buscar o tipo de pagamento do pedido do marketplace', async function () {
	const input = {
		payment: 'pagarme_cartao',
	};
	const paymentType = await getPaymentType.execute(input);
	expect(paymentType).toHaveProperty('name', 'Cartão de crédito');
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

test('Deve buscar o cupom do marketplace', async function () {
	const input = {
		coupon: 'cabeluda',
	};
	const coupon = await getCoupon.execute(input);
	expect(coupon).toHaveProperty('name', 'CABELUDA');
});

test('Não deve buscar o cupom caso o pedido não tenha cupom', async function () {
	const input = {
		coupon: '',
	};
	const coupon = await getCoupon.execute(input);
	expect(coupon).toBe(null);
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
