import Person from './Person';
import Sex from './Sex';

export default class Client extends Person {
	id?: string;
	personId?: string;

	constructor(
		readonly cpfCnpj: string,
		readonly name: string,
		readonly email: string,
		readonly instagram?: string | null,
		readonly birthdate?: Date | null,
		readonly sex?: Sex | null,
		readonly marketing = true,
	) {
		super(cpfCnpj, name, email, instagram, birthdate, sex);
	}

	setId(id: string): void {
		this.id = id;
	}

	setPersonId(id: string): void {
		this.personId = id;
	}
}
