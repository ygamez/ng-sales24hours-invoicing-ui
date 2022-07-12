import { BankAccount } from "./bankaccount"

export class Transfer {


	public id: number;

	public createdById: number;

	public fromBankAccountId: number;

	public fromBankAccount: BankAccount;

	public toBankAccount: string;

	public amount: number;

	public date: Date;

	public reference: string;

	public description: string;
}
