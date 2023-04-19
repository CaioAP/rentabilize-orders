import BalanceInvite from '../../domain/entity/BalanceInvite';
import Price from '../../domain/entity/Price';
import BalanceInviteRepository from '../repository/BalanceInviteRepository';
import Usecase from './Usecase';

export default class SaveBalanceInvite implements Usecase {
	constructor(readonly balanceInviteRepository: BalanceInviteRepository) {}

	async execute(input: Input): Promise<BalanceInvite> {
		const balance = await this.balanceInviteRepository.get(
			input.companyId,
			input.influencerId,
		);
		if (input.increment) balance.increment(new Price(input.amount));
		else balance.decrement(new Price(input.amount));
		return await this.balanceInviteRepository.update(balance);
	}
}

type Input = {
	amount: number;
	influencerId: string;
	companyId: string;
	increment: boolean;
};
