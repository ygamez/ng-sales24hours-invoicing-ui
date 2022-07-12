import { Invoice } from "./invoice"

export class CreditNote {


	public id: number;

	public createdById: number;

	public invoiceId: number;

	public invoice: Invoice;

	public invoiceReference: string;

	public amount: number;

	public date: Date;

	public description: string;
}
