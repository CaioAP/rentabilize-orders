import StoreGateway from "../../application/gateway/StoreGateway";
import DateObject from "../../domain/entity/Date";
import Store from "../../domain/entity/Store";
import HttpClient from "../http/HttpClient";

export default class StoreGatewayHttp implements StoreGateway {
	constructor(readonly httpClient: HttpClient) {}

	async getOrders(store: Store, date: Date) {
		const dateFormatted = new DateObject(date).format("yyyy-MM-dd");
		const url = `${store.url}/api_rentabilize_atualiza.php?atualizacao=${dateFormatted}`;
		const response = await this.httpClient.get(url);
		return response;
	}
}
