import Person from './Person';
import Sex from './Sex';

export default class Client extends Person {
	constructor(
		readonly cpfCnpj: string,
		readonly name: string,
		readonly email: string,
		readonly instagram: string,
		readonly birthdate?: Date,
		readonly sex?: Sex,
		readonly marketing = true
	) {
		super(cpfCnpj, name, email, instagram, birthdate, sex);
	}
}
