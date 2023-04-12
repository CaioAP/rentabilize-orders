import Sex from './Sex';

export default class Person {
	constructor(
		readonly cpfCnpj: string,
		readonly name: string,
		readonly email: string,
		readonly instagram: string,
		readonly birthdate?: Date,
		readonly sex?: Sex
	) {}
}
