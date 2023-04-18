import validateOrderStatusApproved from '../../src/infra/validation/validateOrderStatusApproved';

test('Deve validar o status do pedido como aprovado', function () {
	const isApproved = validateOrderStatusApproved('Aprovado');
	expect(isApproved).toBeTruthy();
});

test('Não deve validar o status do pedido como aprovado', function () {
	const isApproved = validateOrderStatusApproved('Aguardando pagamento');
	expect(isApproved).toBeFalsy();
});
