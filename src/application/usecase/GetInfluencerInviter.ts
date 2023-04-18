import Influencer from '../../domain/entity/Influencer';
import InfluencerRepository from '../repository/InfluencerRepository';
import Usecase from './Usecase';

export default class GetInfluencerInviter implements Usecase {
	constructor(readonly influencerRepository: InfluencerRepository) {}

	async execute(input: Input): Promise<Influencer | null> {
		return await this.influencerRepository.getInviter(
			input.influencerId,
			input.companyId,
		);
	}
}

type Input = {
	influencerId: string;
	companyId: string;
};
