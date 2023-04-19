import BalanceRepository from '../../src/application/repository/BalanceRepository';
import SaveBalance from '../../src/application/usecase/SaveBalance';
import Connection from '../../src/infra/database/Connection';
import PgPromise from '../../src/infra/database/PgPromiseAdapter';
import BalanceRepositoryDatabase from '../../src/infra/repository/BalanceRepositoryDatabase';

let connection: Connection;
let balanceRepository: BalanceRepository;
let saveBalance: SaveBalance;

beforeEach(function () {
	connection = new PgPromise();
	balanceRepository = new BalanceRepositoryDatabase(connection);
	saveBalance = new SaveBalance(balanceRepository);
});

afterEach(async function () {
	await connection.close();
});

test('Deve buscar o saldo do influenciador por empresa', async function () {
	const input = {
		influencerId: '9ce732da-34a9-4adb-89c1-557693638420',
		companyId: 'c975f02c-cee8-4630-9fa8-239cc590dfe1',
	};
	const balance = await balanceRepository.get(
		input.companyId,
		input.influencerId,
	);
	expect(balance).toHaveProperty('amount', { value: 0 });
});

test('Deve incrementar o saldo do influenciador por empresa', async function () {
	const input = {
		amount: 8,
		influencerId: '9ce732da-34a9-4adb-89c1-557693638420',
		companyId: 'c975f02c-cee8-4630-9fa8-239cc590dfe1',
		increment: true,
	};
	const balance = await saveBalance.execute(input);
	expect(balance.amount).toEqual({ value: 8 });
});

test('Deve decrementar o saldo do influenciador por empresa', async function () {
	const input = {
		amount: 8,
		influencerId: '9ce732da-34a9-4adb-89c1-557693638420',
		companyId: 'c975f02c-cee8-4630-9fa8-239cc590dfe1',
		increment: false,
	};
	const balance = await saveBalance.execute(input);
	expect(balance.amount).toEqual({ value: 0 });
});
