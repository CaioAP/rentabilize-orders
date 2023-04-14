import DateObject from '../../src/domain/entity/Date';

test('Não deve criar uma data invalida', function () {
	expect(() => new DateObject(new Date(''))).toThrow(new Error('Invalid date'));
});

test('Deve criar uma data', function () {
	const date = new Date('1996-05-25');
	const dateObj = new DateObject(date);
	expect(dateObj.value.toISOString()).toBe(date.toISOString());
});

test('Deve criar uma data a partir de uma string', function () {
	const date = new Date('1996-05-25');
	const dateObj = new DateObject('1996-05-25');
	expect(dateObj.value.toISOString()).toBe(date.toISOString());
});

test('Deve criar uma data e formatar', function () {
	const date = new Date('1996-05-25T00:00:00.000-03:00');
	const dateFormatted = '25/05/1996';
	const dateObj = new DateObject(date);
	expect(dateObj.format('dd/MM/yyyy')).toBe(dateFormatted);
});

test('Deve testar se uma data vem depois de outra', function () {
	const date = new Date('1994-06-13T00:00:00.000-03:00');
	const dateObj = new DateObject('1996-05-25T00:00:00.000-03:00');
	expect(dateObj.isAfter(date)).toBeTruthy();
});
