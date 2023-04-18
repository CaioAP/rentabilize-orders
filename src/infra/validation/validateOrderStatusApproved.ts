export default function validateOrderStatusApproved(status: string) {
	return ['Aprovado', 'Em separação', 'Enviado', 'Entregue'].includes(status);
}
