import FinancialStatementRepository from '../../src/application/repository/FinancialStatementRepository';
import Connection from '../../src/infra/database/Connection';
import PgPromise from '../../src/infra/database/PgPromiseAdapter';
import FinancialStatementRepositoryDatabase from '../../src/infra/repository/FinancialStatementRepositoryDatabase';

let connection: Connection;
let financialStatementRepository: FinancialStatementRepository;

beforeEach(function () {
	connection = new PgPromise();
	financialStatementRepository = new FinancialStatementRepositoryDatabase(
		connection,
	);
});

afterEach(async function () {
	await connection.close();
});

test('Deve buscar os extratos financeiros não disponiveis dos pedidos de uma data', async function () {
	const financialStatements =
		await financialStatementRepository.getNotAvailableOnDate(
			new Date('2023-04-13T12:00:00'),
		);
	expect(financialStatements).toHaveLength(2);
	expect(financialStatements[0]).toHaveProperty('available', false);
	expect(financialStatements[1]).toHaveProperty('available', false);
});

test('Deve atualizar o extrato financeiro como disponivel', async function () {
	const financialStatement =
		await financialStatementRepository.updateAvailability(
			'2f0ff08a-4ed3-4b69-a157-4ef0a392cb91',
			true,
		);
	expect(financialStatement.id).toBe('2f0ff08a-4ed3-4b69-a157-4ef0a392cb91');
	expect(financialStatement.available).toBe(true);
});
