import FinancialStatement from '../../src/domain/entity/FinancialStatement';
import Price from '../../src/domain/entity/Price';
import crypto from 'crypto';

test('Deve testar se o extrato financeiro está valido para ser salvo', function () {
	const financialStatement = new FinancialStatement(
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
	expect(financialStatement.isValidToCreate('Aprovado')).toBeTruthy();
});

test('Deve testar se o extrato financeiro não está valido para ser salvo', function () {
	const financialStatement = new FinancialStatement(
		'c975f02c-cee8-4630-9fa8-239cc590dfe1',
		'9ce732da-34a9-4adb-89c1-557693638420',
		crypto.randomUUID(),
		8,
		new Price(8),
		new Date(),
		'CREDITO',
		false,
		'eef9e6b6-1311-4d5f-968f-3926fb39afa7',
	);
	expect(
		financialStatement.isValidToCreate('Aguardando pagamento'),
	).toBeFalsy();
});
