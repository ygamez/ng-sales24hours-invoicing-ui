import { Currency } from "./currency";
import { Customer } from "./customer"
import { InvoiceLineItem } from "./invoicelineitem"
import { Revenue } from "./revenue";
import { User } from "./user";

export class Invoice {

	public id: number;

	public createdById: number;

	public createdBy: User;

	public reference: string;

	public sent: boolean;

	public customerId: number;

	public customer: Customer;

	public customerName: string;

	public customerEmail: string;

	public issueDate: Date;

	public invoiceNumber: string;

	public discountApply: boolean;

  public downloadUrl: string;

	public totalAmount: number;

  public remainingAmount: number;

  public paidAmount: number;

	public invoiceLineItems: InvoiceLineItem[];

	public description: string;

	public status: string;

	public totalDiscount: number;

	public totalTax: number;

	public subTotalPrice: number;

	public totalCreditNote: number;

	public invoiceDate: Date;

  public dueDateIsPassed: boolean;

  public approved: boolean;

  public paid: boolean;

  public partiallyPaid: boolean;

  public badgeStatus: string;

  public stepperIndex: number;

  public stepperLabelOne: number;

  public stepperLabelTwo: number;

  public stepperLabelThree: number;

  public currentUrl: string;

  public customerPreviewUrl: string;

  public customerReceiptLink: string;

  public revenues: Revenue[];

  public currencyId: number;

  public currency: Currency;

  public repeatFrequency?: string;

  public customFrequency?: string;

  public repeat?: number;

  public neverEnd?: boolean;

  public startDate?: Date;

  public endDate?: Date;

  public isRecurring: boolean;
}
