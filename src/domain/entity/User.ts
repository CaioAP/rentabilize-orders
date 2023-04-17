import { Role } from '../enum/Role';
import Person from './Person';
import Sex from './Sex';

export default class User extends Person {
	password?: string | null;
	photo?: string | null;
	companies?: string[];

	constructor(
		readonly personId: string | undefined,
		readonly id: string | undefined,
		readonly cpfCnpj: string,
		readonly name: string,
		readonly email: string,
		readonly username: string,
		readonly role: Role,
		password?: string | null,
		instagram?: string | null,
		birthdate?: Date | null,
		sex?: Sex | null,
		photo?: string | null,
	) {
		super(personId, cpfCnpj, name, email, instagram, birthdate, sex);
		this.password = password;
		this.photo = photo;
	}
}
