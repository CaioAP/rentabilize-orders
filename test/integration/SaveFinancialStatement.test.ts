import CommissionRepository from '../../src/application/repository/CommissionRepository';
import CompanyRepository from '../../src/application/repository/CompanyRepository';
import FinancialStatementRepository from '../../src/application/repository/FinancialStatementRepository';
import InfluencerRepository from '../../src/application/repository/InfluencerRepository';
import GetCommissions from '../../src/application/usecase/GetComissions';
import GetCompany from '../../src/application/usecase/GetCompany';
import GetInfluencerByCoupon from '../../src/application/usecase/GetInfluencerByCoupon';
import GetInfluencerInviter from '../../src/application/usecase/GetInfluencerInviter';
import FinancialStatement from '../../src/domain/entity/FinancialStatement';
import Price from '../../src/domain/entity/Price';
import Store from '../../src/domain/entity/Store';
import Connection from '../../src/infra/database/Connection';
import PgPromise from '../../src/infra/database/PgPromiseAdapter';
import CommissionRepositoryDatabase from '../../src/infra/repository/CommissionRepositoryDatabase';
import CompanyRepositoryDatabase from '../../src/infra/repository/CompanyRepositoryDatabase';
import FinancialStatementRepositoryDatabase from '../../src/infra/repository/FinancialStatementRepositoryDatabase';
import InfluencerRepositoryDatabase from '../../src/infra/repository/InfluencerRepositoryDatabase';

let connection: Connection;
let getCompany: GetCompany;
let getCommissions: GetCommissions;
let getInfluencerByCoupon: GetInfluencerByCoupon;
let getInfluencerInviter: GetInfluencerInviter;
let companyRepository: CompanyRepository;
let commissionRepository: CommissionRepository;
let influencerRepository: InfluencerRepository;
let financialStatementRepository: FinancialStatementRepository;

beforeEach(async function () {
	connection = new PgPromise();
	companyRepository = new CompanyRepositoryDatabase(connection);
	commissionRepository = new CommissionRepositoryDatabase(connection);
	influencerRepository = new InfluencerRepositoryDatabase(connection);
	financialStatementRepository = new FinancialStatementRepositoryDatabase(
		connection,
	);
	getCompany = new GetCompany(companyRepository);
	getCommissions = new GetCommissions(commissionRepository);
	getInfluencerByCoupon = new GetInfluencerByCoupon(influencerRepository);
	getInfluencerInviter = new GetInfluencerInviter(influencerRepository);
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
	const store = new Store(
		'2f01c15a-e882-44ac-aedf-5f2754f24404',
		'New Hair',
		'https://loja.newhairoficial.com.br',
		'skKeRUlClgTIwVf7RrgPOTKZcRgs4zxyecReWH4vijYJJzgTiKGir1hrYm2eaeHV4eyHFmWzKpKhpLeLOfM5za8xV5muOY33vrpLqXvaTXhOVg6gTJ4uJP7yQsbBWFlMQtapZ34AYxUD3sjATyrG0SGr1X3gB00Uz2K23k71vhLg3nIC2yigTPkf4QJFnECrI60JtJfZZ20VLpSWExeiedXTIbuIeyigpSQuWoJvpk4UkylIrHnIfPVToIIPe3IT',
		'Senha123',
	);
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
	const statement = await financialStatementRepository.getByFilter(
		input.saleId,
		input.companyId,
		input.influencerId,
	);
	expect(statement).toBe(null);
});

test('Deve criar o extrato financeiro do pedido', async function () {
	const financialStatementData = new FinancialStatement(
		'c975f02c-cee8-4630-9fa8-239cc590dfe1',
		'9ce732da-34a9-4adb-89c1-557693638420',
		undefined,
		8,
		new Price(8),
		new Date(),
		'CREDITO',
		false,
		'eef9e6b6-1311-4d5f-968f-3926fb39afa7',
	);
	const financialStatement = await financialStatementRepository.create(
		financialStatementData,
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

test('Deve buscar extrato financeiro pelo pedido, empresa e influenciador', async function () {
	const input = {
		saleId: '59123',
		companyId: 'c975f02c-cee8-4630-9fa8-239cc590dfe1',
		influencerId: '9ce732da-34a9-4adb-89c1-557693638420',
	};
	const statement = await financialStatementRepository.getByFilter(
		input.saleId,
		input.companyId,
		input.influencerId,
	);
	expect(statement).toHaveProperty(
		'saleId',
		'eef9e6b6-1311-4d5f-968f-3926fb39afa7',
	);
});

test.todo(
	'Deve salvar o extrato financeiro do pedido',
	// async function () {
	// 	const input = {
	// 		saleId: '58123',
	// 		status: 'Aprovado',
	// 		store: 'New Hair',
	// 		price: 156,
	// 		discount: 0,
	// 		coupon: 'cabeluda',
	// 		payment: 'erederest5',
	// 		dateAdded: new Date('2023-04-18T12:00:00-03:00'),
	// 		dateModified: new Date('2023-04-18T15:00:00-03:00'),
	// 		observation: '',
	// 		client: {
	// 			cpfCnpj: '11144477735',
	// 			name: 'Joao da Silva',
	// 			email: 'joaodasilva@hotmail.com',
	// 			sex: null,
	// 			birthdate: null,
	// 		},
	// 		items: [],
	// };
	// const financialStatement = await saveFinancialStatement.execute(input);
	// expect(financialStatement).toHaveProperty('amount', )
	// }
);
