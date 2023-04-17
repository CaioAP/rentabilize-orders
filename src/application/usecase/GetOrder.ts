import Order from '../../domain/entity/Order';
import OrderRepository from '../repository/OrderRepository';
import Usecase from './Usecase';

export default class GetOrder implements Usecase {
	constructor(readonly orderRepository: OrderRepository) {}

	async execute(input: Input): Promise<Order | null> {
		return await this.orderRepository.getByIdExt(input.idExt);
	}
}

type Input = {
	idExt: string;
};
