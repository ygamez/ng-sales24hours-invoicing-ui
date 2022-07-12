import { Bill } from "./bill"

export class DebitNote {


	public id: number;

	public createdById: number;

	public billId: number;

	public bill: Bill;

	public billReference: string;

	public amount: number;

	public date: Date;

	public description: string;
}
