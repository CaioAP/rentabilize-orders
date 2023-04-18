import Commission from '../../src/domain/entity/Comission';
import Price from '../../src/domain/entity/Price';

test('Deve calcular o valor da comissao a partir do valor do pedido', function () {
	const commission = new Commission(undefined, undefined, 8, 1);
	const commissionAmount = commission.calculate(new Price(100));
	expect(commissionAmount).toBe(8);
});
