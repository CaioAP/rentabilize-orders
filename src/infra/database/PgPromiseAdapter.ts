import pgPromise from 'pg-promise';
import Connection from './Connection';

export default class PgPromise implements Connection {
	connection: any;

	constructor() {
		this.connection = pgPromise()(
			'postgres://rentabilizeme:56BJcAst@localhost:5432/rentabilize?schema=public'
		);
	}

	async query(statement: string, params: any): Promise<any> {
		return this.connection.query(statement, params);
	}

	async transaction(cb: Function): Promise<any> {
		return this.connection.tx(cb);
	}

	async close(): Promise<void> {
		await this.connection.$pool.end();
	}
}
