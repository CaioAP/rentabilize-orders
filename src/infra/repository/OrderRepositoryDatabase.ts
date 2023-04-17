import OrderRepository from '../../application/repository/OrderRepository';
import Order from '../../domain/entity/Order';
import OrderItem from '../../domain/entity/OrderItem';
import OrderStatus from '../../domain/entity/OrderStatus';
import PaymentType from '../../domain/entity/PaymentType';
import Price from '../../domain/entity/Price';
import Connection from '../database/Connection';

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
				data.id,
				data.idExt,
				data.amount,
				data.discount,
				data.createdAt,
				data.modifiedAt,
				data.observation,
				data.status.id,
				data.payment.id,
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
			data.status,
			data.payment,
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
					orderItem.id,
					orderItem.amount,
					orderItem.discount,
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
					itemData.descontos,
				),
			);
		}
		return order;
	}

	async getByIdExt(id: string): Promise<Order | null> {
		const [orderData] = await this.connection.query(
			`
        SELECT p.*, sp.id AS "statusId", sp.nome AS "statusNome", pt.id AS "pagamentoTipoId", pt.nome AS "pagamentoTipoNome", c
        FROM public."Pedido" p
        INNER JOIN public."StatusPedido" sp ON sp.id = p."statusPedidoId"
        INNER JOIN public."PagamentoTipo" pt ON pt.id = p."pagamentoTipoId"
        LEFT JOIN public."Cupom" c ON c.id = p."cupomId"
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
			new OrderStatus(orderData.statusId, orderData.statusNome),
			new PaymentType(orderData.pagamentoTipoId, orderData.pagamentoTipoNome),
			orderData.lojaId,
			orderData.clienteId,
			orderData.couponId,
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
