import OrderStatus from '../../src/domain/entity/OrderStatus';

test('Deve validar o status do pedido como aprovado', function () {
	const orderStatus = new OrderStatus(undefined, 'Aprovado');
	expect(orderStatus.isApproved()).toBeTruthy();
});

test('Não deve validar o status do pedido como aprovado', function () {
	const orderStatus = new OrderStatus(undefined, 'Aguardando pagamento');
	expect(orderStatus.isApproved()).toBeFalsy();
});

test('Deve validar o status do pedido como estornado', function () {
	const orderStatus = new OrderStatus(undefined, 'Estornado');
	expect(orderStatus.isRefunded()).toBeTruthy();
});

test('Não deve validar o status do pedido como estornado', function () {
	const orderStatus = new OrderStatus(undefined, 'Aguardando pagamento');
	expect(orderStatus.isRefunded()).toBeFalsy();
});
