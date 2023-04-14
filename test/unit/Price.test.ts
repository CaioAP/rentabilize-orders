import Price from '../../src/domain/entity/Price';

test('Não deve criar um preço invalido', function () {
	const notNumeric = 'abc123';
	expect(() => new Price(notNumeric)).toThrow(new Error('Invalid number'));
});

test('Deve criar um preço', function () {
	const price = new Price('123.45');
	expect(price.value).toBe(123.45);
});

test('Deve criar um preço e formatar', function () {
	const price = new Price('123.45');
	expect(price.format().replace(/\s/g, ' ')).toBe('R$ 123,45');
});
