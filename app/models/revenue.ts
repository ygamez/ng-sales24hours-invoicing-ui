import { ChartAccounts } from "./chartaccounts"
import { BankAccount } from "./bankaccount"
import { Customer } from "./customer"
import { Invoice } from "./invoice"
import { Transaction } from "./transaction";
import { Receipt } from "./receipt";

export class Revenue {

	public id: number;

	public createdById: number;

	public accountId: number;

	public account?: ChartAccounts;

	public accountName: string;

  public accountBalanceId: number;

	public accountBalance?: ChartAccounts;

	public accountBalanceName: string;

	public date: Date;

	public amount: number;

  public totalTax: number;

	public bankAccountId: number;

	public bankAccount: BankAccount;

	public bankAccountName: string;

	public customerId: number;

	public customer: Customer;

	public customerName: string;

	public customerEmail: string;

	public reference: string;

	public description: string;

  public paymentMethod: string;

  public transactionId: number;

  public transaction: Transaction;

	public invoiceId: number;

	public invoice?: Invoice;

	public invoiceReference: string;

  public receipt: Receipt;

  public customerReceiptLink: string;
}
