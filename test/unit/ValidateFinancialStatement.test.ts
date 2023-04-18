import validateFinancialStatement from '../../src/infra/validation/validateFinancialStatement';

test('Deve verificar se o pedido está apto a criar extrato financeiro', function () {
	const isValidStatement = validateFinancialStatement(
		null,
		new Date(),
		'Aprovado',
	);
	expect(isValidStatement).toBeTruthy();
});

test('Deve verificar se o pedido não está apto a criar extrato financeiro', function () {
	const isValidStatement = validateFinancialStatement(
		'9184beee-cde8-4eed-b516-65035f99b567',
		new Date('2023-04-15'),
		'Aguardando pagamento',
	);
	expect(isValidStatement).toBeFalsy();
});
