import Sex from './Sex';

export default class Person {
	id?: string;

	constructor(
		readonly cpfCnpj: string,
		readonly name: string,
		readonly email: string,
		readonly instagram?: string | null,
		readonly birthdate?: Date | null,
		readonly sex?: Sex | null,
	) {}

	setId(id: string): void {
		this.id = id;
	}
}
