import { Revenue } from "./revenue"
import { Payment } from "./payment"
import { ChartAccounts } from "./chartaccounts"

export class Transaction {

	public id: number;

	public createdById: number;

	public date: Date;

	public amount: number;

  public totalTax: number;

	public note: string;

	public accountId: number;

	public account: ChartAccounts;

	public accountName: string;

  public accountBalanceId: number;

  public accountBalance: ChartAccounts;

  public accountBalanceName: string;

	public category: string;

  public source: string;

	public published: boolean;

  public platform: string;
}
