import { Plan } from "./plan";
import { User } from "./user";

export class Subscription {
  id: number;
  userId: number;
  user: User;
  planId: number;
  plan: Plan;
  stripeSubId: string;
  stripeCustomerId: string;
  stripePlanId: string;
  stripePaymentMethodId: string;
  paypalAgreementId: string;
  createdAt: Date;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  canceledAt?: Date;
  active: boolean;
  canCreateInvoice: boolean;
  canCreateCustomer: boolean;
  canCreateUser: boolean;
  canCreateProduct: boolean;
  canCreateEstimate: boolean;
  paid: boolean;
  invoicePaymentFailed: boolean;
  subscriptionPortalUrl: string;
  renew:boolean;
  status: string;
  badgeStatus: string;
}
