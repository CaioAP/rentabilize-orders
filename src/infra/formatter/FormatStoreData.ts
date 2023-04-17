import Sex from '../../domain/entity/Sex';

export default function formatStoreData(data: any): Output {
	let discount = 0;
	if (data.xfeepro) discount += Number(data.xfeepro.value) * -1;
	if (data.productbundlestotal)
		discount += Number(data.productbundlestotal.value) * -1;
	if (data.coupon) discount += Number(data.coupon.value) * -1;
	return {
		saleId: data.pedido,
		status: data.status_descricao,
		store: data.store_name,
		price: Number(data.valor),
		discount: Number(discount),
		coupon: data.coupon_code || data.coupon.nomeCupom,
		payment: data.payment_code,
		dateAdded: new Date(data.date_added),
		dateModified: new Date(data.date_modified),
		observation: data.comment,
		client: {
			cpfCnpj: data.cpf || data.cnpj,
			name: data.cliente,
			email: data.cliente_email,
			sex: data.sexo || null,
			birthdate: data.data_de_nascimento || null,
			contact: {
				telephone: data.cliente_telefone,
				cellphone: data.seu_celular,
			},
			address: {
				cep: data.shipping_postcode,
				state: data.ufCode,
				city: data.shipping_city,
				neighborhood: data.shipping_address_2,
				street: data.shipping_address_1,
				complement: data.complemento || null,
				number: Number(data.numero) || 0,
			},
		},
		items: data.itens.map(
			(item: any): OutputItem => ({
				saleId: item.pedido,
				sku: item.sku,
				ncm: item.ncm || 0,
				name: item.nome,
				price: Number(item.preco_cheio),
				quantity: Number(item.quantidade),
			}),
		),
	};
}

type Output = {
	saleId: string;
	status: string;
	store: string;
	price: number;
	discount: number;
	coupon: string;
	payment: string;
	dateAdded: Date;
	dateModified: Date;
	observation: string | null;
	client: {
		cpfCnpj: string;
		name: string;
		email: string;
		sex: string | null;
		birthdate: Date | null;
		contact: {
			telephone?: string;
			cellphone?: string;
		};
		address: {
			cep: string;
			state: string;
			city: string;
			neighborhood: string;
			street: string;
			complement: string | null;
			number: number;
		};
	};
	items: OutputItem[];
};

type OutputItem = {
	saleId: string;
	sku: string;
	ncm: number;
	name: string;
	price: number;
	quantity: number;
};
