import Sex from './Sex';

export default class Person {
	constructor(
		readonly id: string | undefined,
		readonly cpfCnpj: string,
		readonly name: string,
		readonly email: string,
		readonly instagram?: string | null,
		readonly birthdate?: Date | null,
		readonly sex?: Sex | null,
	) {}
}
