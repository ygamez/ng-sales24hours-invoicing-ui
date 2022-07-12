import { BankAccount } from "./bankaccount"
import { Vendor } from "./vendor"
import { Bill } from "./bill"
import { ChartAccounts } from "./chartaccounts"
import { Transaction } from "./transaction";

export class Payment {


	public id: number;

	public createdById: number;

	public date: Date;

	public amount: number;

  public totalTax: number;

	public bankAccountId: number;

	public bankAccount: BankAccount;

	public bankAccountName: string;

	public vendorId?: number;

	public vendor: Vendor;

	public vendorName: string;

	public vendorEmail: string;

	public reference: string;

	public description: string;

  public transactionId: number;

  public transaction: Transaction;

	public billId?: number;

	public bill?: Bill;

	public billReference: string;

	public accountId?: number;

	public account?: ChartAccounts;

	public accountName: string;

	public accountBalanceId: number;

	public accountBalance?: ChartAccounts;

	public accountBalanceName: string;
}
