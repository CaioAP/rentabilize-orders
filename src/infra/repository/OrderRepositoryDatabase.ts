import OrderRepository from '../../application/repository/OrderRepository';
import Order from '../../domain/entity/Order';
import OrderItem from '../../domain/entity/OrderItem';
import Price from '../../domain/entity/Price';
import Connection from '../database/Connection';
import crypto from 'crypto';

export default class OrderRepositoryDatabase implements OrderRepository {
	constructor(readonly connection: Connection) {}

	async create(data: Order): Promise<Order> {
		const [orderData] = await this.connection.query(
			`
      INSERT INTO public."Pedido" (id, "idExt", valor, descontos, "dataPedido", "dataAlteracao", observacao, "statusPedidoId", "pagamentoTipoId", "clienteId", "cupomId", "lojaId")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `,
			[
				crypto.randomUUID(),
				data.idExt,
				data.amount.value,
				data.discount.value,
				data.createdAt,
				data.modifiedAt,
				data.observation,
				data.statusId,
				data.paymentId,
				data.clientId,
				data.couponId,
				data.storeId,
			],
		);
		const order = new Order(
			orderData.id,
			orderData.idExt,
			new Price(orderData.valor),
			orderData.descontos,
			new Date(orderData.dataPedido),
			new Date(orderData.dataAlteracao),
			orderData.statusPedidoId,
			orderData.pagamentoTipoId,
			orderData.lojaId,
			orderData.clienteId,
			orderData.couponId,
			orderData.observacao,
		);
		for (const orderItem of data.items) {
			const [itemData] = await this.connection.query(
				`
        INSERT INTO public."PedidoItem" (id, valor, descontos, quantidade, ncm, "pedidoId", "produtoId")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING * 
      `,
				[
					crypto.randomUUID(),
					orderItem.amount?.value,
					orderItem.discount?.value,
					orderItem.quantity,
					orderItem.ncm,
					orderData.id,
					orderItem.productId,
				],
			);
			order.items.push(
				new OrderItem(
					itemData.produtoId,
					itemData.id,
					itemData.quantidade,
					itemData.ncm,
					new Price(itemData.valor),
					new Price(itemData.descontos),
				),
			);
		}
		return order;
	}

	async update(data: Partial<Order>): Promise<Order> {
		const [orderData] = await this.connection.query(
			`
      UPDATE public."Pedido" SET 
				"dataAlteracao" = $1, 
				observacao = $2, 
				"statusPedidoId" = $3
      RETURNING *;
    `,
			[data.modifiedAt, data.observation, data.statusId],
		);
		const order = new Order(
			orderData.id,
			orderData.idExt,
			new Price(orderData.valor),
			orderData.descontos,
			new Date(orderData.dataPedido),
			new Date(orderData.dataAlteracao),
			orderData.statusPedidoId,
			orderData.pagamentoTipoId,
			orderData.lojaId,
			orderData.clienteId,
			orderData.couponId,
			orderData.observacao,
		);
		const itemsData = await this.connection.query(
			`
			SELECT * FROM public."PedidoItem"
			WHERE "pedidoId" = $1
		`,
			[orderData.id],
		);
		itemsData.forEach((itemData: any) =>
			order.items.push(
				new OrderItem(
					itemData.produtoId,
					itemData.id,
					itemData.quantidade,
					itemData.ncm,
					new Price(itemData.valor),
					new Price(itemData.descontos),
				),
			),
		);
		return order;
	}

	async getByIdExt(id: string): Promise<Order | null> {
		const [orderData] = await this.connection.query(
			`
        SELECT p.*
        FROM public."Pedido" p
        WHERE p."idExt" = $1
      `,
			[id],
		);
		if (!orderData) return null;
		const order = new Order(
			orderData.id,
			orderData.idExt,
			new Price(orderData.valor),
			orderData.descontos,
			new Date(orderData.dataPedido),
			new Date(orderData.dataAlteracao),
			orderData.statusPedidoId,
			orderData.pagamentoTipoId,
			orderData.lojaId,
			orderData.clienteId,
			orderData.cupomId,
			orderData.observacao,
		);
		const itemsData = await this.connection.query(
			`
        SELECT * FROM public."PedidoItem"
        WHERE "pedidoId" = $1;
      `,
			[id],
		);
		for (const itemData of itemsData) {
			order.items.push(
				new OrderItem(
					itemData.produtoId,
					itemData.id,
					itemData.quantidade,
					itemData.ncm,
					new Price(itemData.valor),
					itemData.descontos,
				),
			);
		}
		return order;
	}
}
