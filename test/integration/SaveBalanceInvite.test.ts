import BalanceInviteRepository from '../../src/application/repository/BalanceInviteRepository';
import SaveBalanceInvite from '../../src/application/usecase/SaveBalanceInvite';
import Connection from '../../src/infra/database/Connection';
import PgPromise from '../../src/infra/database/PgPromiseAdapter';
import BalanceInviteRepositoryDatabase from '../../src/infra/repository/BalanceInviteRepositoryDatabase';

let connection: Connection;
let balanceInviteRepository: BalanceInviteRepository;
let saveBalanceInvite: SaveBalanceInvite;

beforeEach(function () {
	connection = new PgPromise();
	balanceInviteRepository = new BalanceInviteRepositoryDatabase(connection);
	saveBalanceInvite = new SaveBalanceInvite(balanceInviteRepository);
});

afterEach(async function () {
	await connection.close();
});

test('Deve buscar o saldo do influenciador por empresa', async function () {
	const input = {
		influencerId: '9ce732da-34a9-4adb-89c1-557693638420',
		companyId: 'c975f02c-cee8-4630-9fa8-239cc590dfe1',
	};
	const balance = await balanceInviteRepository.get(
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
	const balance = await saveBalanceInvite.execute(input);
	expect(balance.amount).toEqual({ value: 8 });
});

test('Deve decrementar o saldo do influenciador por empresa', async function () {
	const input = {
		amount: 8,
		influencerId: '9ce732da-34a9-4adb-89c1-557693638420',
		companyId: 'c975f02c-cee8-4630-9fa8-239cc590dfe1',
		increment: false,
	};
	const balance = await saveBalanceInvite.execute(input);
	expect(balance.amount).toEqual({ value: 0 });
});
