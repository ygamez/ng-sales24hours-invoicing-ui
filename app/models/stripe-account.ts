import { Company } from "./company";
import { User } from "./user";

export class StripeAccount {
  id: number;
  userId: number;
  user: User;
  accountId: string;
  type: string;
  email: string;
  country: string;
  cardPayments: boolean;
  transferts: boolean;
  detailsSubmitted: boolean;
  company: Company;
}
