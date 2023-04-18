import validateFinancialStatement from '../../src/infra/validation/validateFinancialStatement';

test('Deve verificar se o pedido está apto a criar extrato financeiro', function () {
	const input = {
		statementId: null,
		date: new Date(),
		status: 'Aprovado',
	};
	const isValidStatement = validateFinancialStatement(
		input.statementId,
		input.date,
		input.status,
	);
	expect(isValidStatement).toBeTruthy();
});

test('Deve verificar se o pedido não está apto a criar extrato financeiro', function () {
	const input = {
		statementId: '9184beee-cde8-4eed-b516-65035f99b567',
		date: new Date('2023-04-15'),
		status: 'Aguardando pagamento',
	};
	const isValidStatement = validateFinancialStatement(
		input.statementId,
		input.date,
		input.status,
	);
	expect(isValidStatement).toBeFalsy();
});
