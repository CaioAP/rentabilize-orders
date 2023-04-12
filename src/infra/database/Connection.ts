export default interface Connection {
	query(statement: string, params: any): Promise<any>;
	transaction(cb: Function): Promise<any>;
	close(): Promise<void>;
}
