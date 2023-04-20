import BalanceInviteRepository from '../../src/application/repository/BalanceInviteRepository';
import BalanceRepository from '../../src/application/repository/BalanceRepository';
import CommissionRepository from '../../src/application/repository/CommissionRepository';
import CompanyRepository from '../../src/application/repository/CompanyRepository';
import FinancialStatementRepository from '../../src/application/repository/FinancialStatementRepository';
import InfluencerRepository from '../../src/application/repository/InfluencerRepository';
import GetCommissions from '../../src/application/usecase/GetComissions';
import GetCompany from '../../src/application/usecase/GetCompany';
import GetInfluencerByCoupon from '../../src/application/usecase/GetInfluencerByCoupon';
import GetInfluencerInviter from '../../src/application/usecase/GetInfluencerInviter';
import SaveBalance from '../../src/application/usecase/SaveBalance';
import SaveBalanceInvite from '../../src/application/usecase/SaveBalanceInvite';
import SaveFinancialStatement from '../../src/application/usecase/SaveFinancialStatement';
import { StatusName } from '../../src/domain/entity/OrderStatus';
import Store from '../../src/domain/entity/Store';
import Connection from '../../src/infra/database/Connection';
import PgPromise from '../../src/infra/database/PgPromiseAdapter';
import BalanceInviteRepositoryDatabase from '../../src/infra/repository/BalanceInviteRepositoryDatabase';
import BalanceRepositoryDatabase from '../../src/infra/repository/BalanceRepositoryDatabase';
import CommissionRepositoryDatabase from '../../src/infra/repository/CommissionRepositoryDatabase';
import CompanyRepositoryDatabase from '../../src/infra/repository/CompanyRepositoryDatabase';
import FinancialStatementRepositoryDatabase from '../../src/infra/repository/FinancialStatementRepositoryDatabase';
import InfluencerRepositoryDatabase from '../../src/infra/repository/InfluencerRepositoryDatabase';

let store: Store;
let connection: Connection;
let getCompany: GetCompany;
let getCommissions: GetCommissions;
let getInfluencerByCoupon: GetInfluencerByCoupon;
let getInfluencerInviter: GetInfluencerInviter;
let saveFinancialStatement: SaveFinancialStatement;
let saveBalance: SaveBalance;
let saveBalanceInvite: SaveBalanceInvite;
let companyRepository: CompanyRepository;
let commissionRepository: CommissionRepository;
let influencerRepository: InfluencerRepository;
let financialStatementRepository: FinancialStatementRepository;
let balanceRepository: BalanceRepository;
let balanceInviteRepository: BalanceInviteRepository;

beforeEach(async function () {
	store = new Store(
		'2f01c15a-e882-44ac-aedf-5f2754f24404',
		'New Hair',
		'https://loja.newhairoficial.com.br',
		'skKeRUlClgTIwVf7RrgPOTKZcRgs4zxyecReWH4vijYJJzgTiKGir1hrYm2eaeHV4eyHFmWzKpKhpLeLOfM5za8xV5muOY33vrpLqXvaTXhOVg6gTJ4uJP7yQsbBWFlMQtapZ34AYxUD3sjATyrG0SGr1X3gB00Uz2K23k71vhLg3nIC2yigTPkf4QJFnECrI60JtJfZZ20VLpSWExeiedXTIbuIeyigpSQuWoJvpk4UkylIrHnIfPVToIIPe3IT',
		'Senha123',
	);
	connection = new PgPromise();
	companyRepository = new CompanyRepositoryDatabase(connection);
	commissionRepository = new CommissionRepositoryDatabase(connection);
	influencerRepository = new InfluencerRepositoryDatabase(connection);
	financialStatementRepository = new FinancialStatementRepositoryDatabase(
		connection,
	);
	balanceRepository = new BalanceRepositoryDatabase(connection);
	balanceInviteRepository = new BalanceInviteRepositoryDatabase(connection);
	getCompany = new GetCompany(companyRepository);
	getCommissions = new GetCommissions(commissionRepository);
	getInfluencerByCoupon = new GetInfluencerByCoupon(influencerRepository);
	getInfluencerInviter = new GetInfluencerInviter(influencerRepository);
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
});

afterEach(async function () {
	await connection.close();
});

test('Deve buscar o influenciador do marketplace', async function () {
	const input = {
		coupon: 'cabeluda',
	};
	const coupon = await getInfluencerByCoupon.execute(input);
	expect(coupon).toHaveProperty('id', '9ce732da-34a9-4adb-89c1-557693638420');
});

test('Não deve buscar o influenciador caso o cupom não exista', async function () {
	const input = {
		coupon: 'cabeludao',
	};
	const coupon = await getInfluencerByCoupon.execute(input);
	expect(coupon).toBe(null);
});

test('Deve buscar o influenciador que convidou', async function () {
	const input = {
		influencerId: '150c98aa-4ea1-4329-91e1-fb5ff1b6701e',
		companyId: 'c975f02c-cee8-4630-9fa8-239cc590dfe1',
	};
	const influencer = await getInfluencerInviter.execute(input);
	expect(influencer).toHaveProperty(
		'id',
		'9ce732da-34a9-4adb-89c1-557693638420',
	);
});

test('Não deve buscar o influenciador que convidou caso seja o lider do time', async function () {
	const input = {
		influencerId: '9ce732da-34a9-4adb-89c1-557693638420',
		companyId: 'c975f02c-cee8-4630-9fa8-239cc590dfe1',
	};
	const influencer = await getInfluencerInviter.execute(input);
	expect(influencer).toBe(null);
});

test('Deve buscar a empresa da loja', async function () {
	const input = {
		storeId: store.id,
	};
	const company = await getCompany.execute(input);
	expect(company).toHaveProperty('id', 'c975f02c-cee8-4630-9fa8-239cc590dfe1');
});

test('Não deve buscar a empresa se a loja nao existir', async function () {
	const store = new Store(
		'2f01c15a-e882-44ac',
		'New Hair',
		'https://loja.newhairoficial.com.br',
		'skKeRUlClgTIwVf7RrgPOTKZcRgs4zxyecReWH4vijYJJzgTiKGir1hrYm2eaeHV4eyHFmWzKpKhpLeLOfM5za8xV5muOY33vrpLqXvaTXhOVg6gTJ4uJP7yQsbBWFlMQtapZ34AYxUD3sjATyrG0SGr1X3gB00Uz2K23k71vhLg3nIC2yigTPkf4QJFnECrI60JtJfZZ20VLpSWExeiedXTIbuIeyigpSQuWoJvpk4UkylIrHnIfPVToIIPe3IT',
		'Senha123',
	);
	const input = {
		storeId: store.id,
	};
	const company = await getCompany.execute(input);
	expect(company).toBe(null);
});

test('Deve buscar as comissoes da empresa', async function () {
	const input = {
		companyId: 'c975f02c-cee8-4630-9fa8-239cc590dfe1',
	};
	const comissions = await getCommissions.execute(input);
	expect(comissions).toHaveLength(2);
});

test('Não deve buscar extrato financeiro inexistente', async function () {
	const input = {
		saleId: '12345',
		companyId: 'c975f02c-cee8-4630-9fa8-239cc590dfe1',
		influencerId: '9ce732da-34a9-4adb-89c1-557693638420',
	};
	const financialStatement = await financialStatementRepository.getByFilter(
		input.saleId,
		input.companyId,
		input.influencerId,
	);
	expect(financialStatement).toBe(null);
});

test('Deve salvar o extrato financeiro do pedido', async function () {
	const status: StatusName = 'Aprovado';
	const input = {
		saleId: 'eef9e6b6-1311-4d5f-968f-3926fb39afa7',
		status,
		store,
		price: 100,
		coupon: 'cabeluda2',
		date: new Date(),
	};
	const financialStatement = await saveFinancialStatement.execute(input);
	expect(financialStatement).toHaveLength(2);
	expect(financialStatement[0]).toHaveProperty(
		'saleId',
		'eef9e6b6-1311-4d5f-968f-3926fb39afa7',
	);
	expect(financialStatement[0]).toHaveProperty('type', 'CREDITO');
	expect(financialStatement[0].amount).toEqual({ value: 8 });
	expect(financialStatement[1].amount).toEqual({ value: 2 });
});

test('Não deve salvar o extrato financeiro do pedido repetido', async function () {
	const status: StatusName = 'Aprovado';
	const input = {
		saleId: 'eef9e6b6-1311-4d5f-968f-3926fb39afa7',
		status,
		store,
		price: 100,
		coupon: 'cabeluda2',
		date: new Date(),
	};
	const financialStatement = await saveFinancialStatement.execute(input);
	expect(financialStatement).toHaveLength(0);
});

test('Deve buscar extrato financeiro pelo pedido, empresa e influenciador', async function () {
	const input = {
		saleId: 'eef9e6b6-1311-4d5f-968f-3926fb39afa7',
		companyId: 'c975f02c-cee8-4630-9fa8-239cc590dfe1',
		influencerId: '9ce732da-34a9-4adb-89c1-557693638420',
	};
	const financialStatement = await financialStatementRepository.getByFilter(
		input.saleId,
		input.companyId,
		input.influencerId,
	);
	expect(financialStatement).toHaveProperty(
		'saleId',
		'eef9e6b6-1311-4d5f-968f-3926fb39afa7',
	);
	expect(financialStatement).toHaveProperty(
		'influencerId',
		'9ce732da-34a9-4adb-89c1-557693638420',
	);
	expect(financialStatement).toHaveProperty(
		'companyId',
		'c975f02c-cee8-4630-9fa8-239cc590dfe1',
	);
});

test('Deve salvar o extrato financeiro do pedido como estornado', async function () {
	const status: StatusName = 'Estornado';
	const input = {
		saleId: 'eef9e6b6-1311-4d5f-968f-3926fb39afa7',
		status,
		store,
		price: 100,
		coupon: 'cabeluda2',
		date: new Date(),
	};
	const financialStatement = await saveFinancialStatement.execute(input);
	expect(financialStatement).toHaveLength(2);
	expect(financialStatement[0]).toHaveProperty(
		'saleId',
		'eef9e6b6-1311-4d5f-968f-3926fb39afa7',
	);
	expect(financialStatement[0]).toHaveProperty('type', 'DEBITO');
	expect(financialStatement[0].amount).toEqual({ value: 8 });
	expect(financialStatement[1].amount).toEqual({ value: 2 });
});
