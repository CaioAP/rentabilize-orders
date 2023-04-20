import Usecase from './Usecase';

export default class SaveBalanceAvailable implements Usecase {
	constructor() {}

	async execute(input: Input): Promise<void> {}
}

type Input = {
	date: Date;
};
