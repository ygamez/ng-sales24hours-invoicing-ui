import { Vendor } from "./vendor"
import { InvoiceLineItem } from "./invoicelineitem"
import { BillLineItem } from "./billlineitem";
import { User } from "./user";
import { Currency } from "./currency";

export class Bill {


	public id: number;

	public createdById: number;

	public createdBy: User;

	public description: string;

	public reference: string;

	public vendorId: number;

	public vendor: Vendor;

	public vendorName: string;

	public vendorEmail: string;

	public issueDate: Date;

	public billDate: Date;

	public discountApply: boolean;

	public totalAmount: number;

  public remainingAmount: number;

  public paidAmount: number;

	public subTotalPrice: number;

  public totalDebitNote: number;

	public totalTax : number;

	public totalDiscount: number;

	public billLineItems: BillLineItem[];

	public orderNumber: string;

	public status: string;

  public dueDateIsPassed: boolean;

  public approved: boolean;

  public sent: boolean;

  public paid: boolean;

  public partiallyPaid: boolean;

  public badgeStatus: string;

  public stepperIndex: number;

  public stepperLabelOne: number;

  public stepperLabelTwo: number;

  public stepperLabelThree: number;

  public originUrl: string;

  public customerPreviewUrl: string;

  public vendorPreviewLink: string;

  public currencyId: number;

  public currency: Currency;

  public downloadUrl: string
}
