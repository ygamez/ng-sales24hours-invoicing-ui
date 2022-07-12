import { Currency } from "./currency";
import { Customer } from "./customer"
import { ProposalLineItem } from "./proposallineitem"
import { User } from "./user";

export class Proposal {

	public id: number;

	public createdById: number;

	public createdBy: User;

	public reference: string;

	public sent: boolean;

	public approved: boolean;

	public customerId: number;

	public customer: Customer;

	public customerName: string;

	public customerEmail: string;

	public issueDate: Date;

	public proposalNumber: string;

	public discountApply: boolean;

  public downloadUrl: string;

	public totalAmount: number;

  public remainingAmount: number;

  public paidAmount: number;

	public proposalLineItems: ProposalLineItem[];

	public description: string;

	public status: string;

	public totalDiscount: number;

	public totalTax: number;

	public subTotalPrice: number;

	public totalCreditNote: number;

	public proposalDate: Date;

  public dueDateIsPassed: boolean;

  public declined: boolean;

  public accepted: boolean;

  public badgeStatus: string;

  public stepperIndex: number;

  public originUrl: string;

  public customerPreviewUrl: string;

  public currencyId: number;

  public currency: Currency;
}
