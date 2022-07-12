import { Plan } from "./plan";
import { StripeAccount } from "./stripe-account";

export class StripeSession {
  id: number;
  createdById: number | null;
  sessionId: string;
  productName: string;
  amount: number;
  applicationFeeAmount: number;
  currency: string;
  quantity: number;
  successUrl: string;
  cancelUrl: string;
  connectedAccount: StripeAccount;
  customerId: number;
  invoiceId: number;
  planId: number;
  plan: Plan;
}
