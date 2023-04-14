import MarketplaceStatus from '../../domain/entity/MarketplaceStatus';

export default interface MarketplaceStatusRepository {
	getByName(name: string): Promise<MarketplaceStatus>;
}
