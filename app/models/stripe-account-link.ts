import { StripeAccount } from "./stripe-account";
import { User } from "./user";

export class StripeAccountLink {
  id: number;
  userId: number;
  user: User;
  url: string;
  refreshUrl: string;
  returnUrl: string;
  type: string;
  stripeAccount: StripeAccount;
}
