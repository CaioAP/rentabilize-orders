import Person from './Person';
import Price from './Price';

export default class Company extends Person {
	instagram?: string | null;
	cnae?: string | null;
	municipalRegistration?: string | null;
	stateRegistration?: string | null;
	logo?: string | null;

	constructor(
		readonly personId: string | undefined,
		readonly id: string | undefined,
		readonly cpfCnpj: string,
		readonly name: string,
		readonly email: string,
		readonly legalName: string,
		readonly transferLevel: number,
		readonly inviteValue: Price,
		instagram?: string | null,
		cnae?: string | null,
		municipalRegistration?: string | null,
		stateRegistration?: string | null,
		logo?: string | null,
	) {
		super(personId, cpfCnpj, name, email, instagram);
		this.instagram = instagram;
		this.cnae = cnae;
		this.municipalRegistration = municipalRegistration;
		this.stateRegistration = stateRegistration;
		this.logo = logo;
	}
}
