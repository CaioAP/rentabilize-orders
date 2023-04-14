export default class Sex {
	value: SexType = SexType.MASCULINO;

	constructor(value: 'MASCULINO' | 'FEMININO') {
		if (value === 'FEMININO') this.value = SexType.FEMININO;
	}
}

enum SexType {
	MASCULINO,
	FEMININO,
}
