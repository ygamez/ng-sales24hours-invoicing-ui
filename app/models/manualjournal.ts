import { Currency } from "./currency";
import { ManualJournalLineItem } from "./manualjournallineitem"
import { Transaction } from "./transaction";

export class ManualJournal {


	public id: number;

	public createdById: number;

	public date: Date;

	public currencyId: number;

	public currency: Currency;

	public reference: string;

	public notes: string;

	public subTotal: number;

	public total: number;

	public status: string;

  public subTotalDebitPrice :number;

  public subTotalCreditPrice :number;

  public totalCreditTax :number;

  public totalDebitTax :number;

  public totalCreditPrice :number;

  public totalDebitPrice :number;

  public creditDifference :number;

  public debitDifference :number;

  public badgeStatus: string;

  public transactionId: number;

  public transaction: Transaction;

	public manualJournalLineItems: ManualJournalLineItem[];
}
