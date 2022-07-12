import { ChartAccounts } from "./chartaccounts"
import { Customer } from "./customer";
import { Taxe } from "./taxe"
import { Vendor } from "./vendor";

export class ManualJournalLineItem {


	public id: number;

	public createdById: number;

	public accountId: number;

	public account: ChartAccounts;

	public description: string;

	public contactType: boolean;

	public taxId: number;

	public tax?: Taxe;

	public debit: number;

	public credit: number;

  public customerId: number;

	public customer: Customer;

  public vendorId: number;

  public vendor: Vendor;

  public update: boolean;
}
