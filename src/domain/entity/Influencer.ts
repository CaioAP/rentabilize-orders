import { Role } from '../enum/Role';
import Sex from './Sex';
import User from './User';

export default class Influencer extends User {
	readonly role = Role.INFLUENCIADOR;

	constructor(
		readonly personId: string | undefined,
		readonly userId: string | undefined,
		readonly id: string | undefined,
		readonly cpfCnpj: string,
		readonly name: string,
		readonly email: string,
		readonly username: string,
		password?: string | null,
		instagram?: string | null,
		birthdate?: Date | null,
		sex?: Sex | null,
		readonly verified: boolean = false,
		readonly updated: boolean = false,
	) {
		super(
			personId,
			userId,
			cpfCnpj,
			name,
			email,
			username,
			Role.INFLUENCIADOR,
			password,
			instagram,
			birthdate,
			sex,
		);
	}
}
