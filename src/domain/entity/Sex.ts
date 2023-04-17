export default class Sex {
	value: string = 'MASCULINO';

	constructor(value: 'MASCULINO' | 'FEMININO') {
		if (value === 'FEMININO') this.value = 'FEMININO';
	}
}
