import Balance from '../../src/domain/entity/Balance';
import Price from '../../src/domain/entity/Price';

test('Deve incrementar o saldo', function () {
	const balance = new Balance(undefined, new Price(0), new Price(0));
	balance.increment(new Price(10));
	expect(balance.amount).toEqual({ value: 10 });
});

test('Deve incrementar o saldo disponivel', function () {
	const balance = new Balance(undefined, new Price(0), new Price(0));
	balance.incrementAvailable(new Price(10));
	expect(balance.available).toEqual({ value: 10 });
});

test('Deve decrementar o saldo', function () {
	const balance = new Balance(undefined, new Price(100), new Price(100));
	balance.decrement(new Price(10));
	expect(balance.amount).toEqual({ value: 90 });
});

test('Deve decrementar o saldo disponivel', function () {
	const balance = new Balance(undefined, new Price(100), new Price(100));
	balance.decrementAvailable(new Price(10));
	expect(balance.available).toEqual({ value: 90 });
});
