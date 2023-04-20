import Balance from '../../domain/entity/Balance';
import FinancialStatement from '../../domain/entity/FinancialStatement';
import BalanceRepository from '../repository/BalanceRepository';
import FinancialStatementRepository from '../repository/FinancialStatementRepository';
import Usecase from './Usecase';

export default class SaveBalanceAvailable implements Usecase {
	constructor(
		readonly balanceRepository: BalanceRepository,
		readonly financialStatementRepository: FinancialStatementRepository,
	) {}

	async execute(input: Input): Promise<Output[]> {
		const financialStatements =
			await this.financialStatementRepository.getNotAvailableOnDate(input.date);
		const output: Output[] = [];
		for (const statementData of financialStatements) {
			const financialStatement =
				await this.financialStatementRepository.updateAvailability(
					String(statementData.id),
					true,
				);
			const balanceData = await this.balanceRepository.get(
				statementData.companyId,
				statementData.influencerId,
			);
			balanceData.incrementAvailable(financialStatement.amount);
			const balance = await this.balanceRepository.update(balanceData);
			output.push({
				financialStatement,
				balance,
			});
		}
		return output;
	}
}

type Input = {
	date: Date;
};

type Output = {
	financialStatement: FinancialStatement;
	balance: Balance;
};
