import Balance from '../../domain/entity/Balance';
import Price from '../../domain/entity/Price';
import BalanceRepository from '../repository/BalanceRepository';
import Usecase from './Usecase';

export default class SaveBalance implements Usecase {
	constructor(readonly balanceRepository: BalanceRepository) {}

	async execute(input: Input): Promise<Balance> {
		const balance = await this.balanceRepository.get(
			input.companyId,
			input.influencerId,
		);
		if (input.increment) balance.increment(new Price(input.amount));
		else balance.decrement(new Price(input.amount));
		return await this.balanceRepository.update(balance);
	}
}

type Input = {
	amount: number;
	influencerId: string;
	companyId: string;
	increment: boolean;
};
