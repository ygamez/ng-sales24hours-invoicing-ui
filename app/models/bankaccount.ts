import { Address } from "./address"
import { ChartAccounts } from "./chartaccounts";
import { Currency } from "./currency";
import { StripeAccount } from "./stripe-account";
import { StripeBalance } from "./stripe-balance";

export class BankAccount {


	public id: number;

	public createdById: number;

  public createdAt: Date;

  public updatedAt: Date;

	public bankName: string;

	public bankHolderName: string;

	public accountNumber: string;

	public balance: number;

	public pendingBalance: number;

	public phone: string;

	public type: string;

	public addressId: number;

	public address?: Address;

  public accountId: number;

  public account: ChartAccounts;

  public stripeAccountId: number;

  public stripeAccount: StripeAccount;

  public stripeBalance: StripeBalance;

  public stripeCurrency: string;

  public currencyId: number;

  public Currency: Currency;
}
