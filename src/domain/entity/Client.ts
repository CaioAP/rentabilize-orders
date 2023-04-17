import Sex from './Sex';
import Person from './Person';

export default class Client extends Person {
	constructor(
		readonly personId: string | undefined,
		readonly id: string | undefined,
		readonly cpfCnpj: string,
		readonly name: string,
		readonly email: string,
		readonly instagram?: string | null,
		birthdate?: Date | null,
		sex?: Sex | null,
		readonly marketing = true,
	) {
		super(personId, cpfCnpj, name, email, instagram, birthdate, sex);
	}
}
