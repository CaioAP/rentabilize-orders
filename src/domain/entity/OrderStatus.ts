export default class OrderStatus {
	constructor(readonly id: string | undefined, readonly name: StatusName) {}

	isApproved() {
		return ['Aprovado', 'Em separação', 'Enviado', 'Entregue'].includes(
			this.name,
		);
	}
}

export type StatusName =
	| 'Aguardando pagamento'
	| 'Aprovado'
	| 'Em separação'
	| 'Enviado'
	| 'Entregue'
	| 'Cancelado'
	| 'Negado'
	| 'Estornado';
