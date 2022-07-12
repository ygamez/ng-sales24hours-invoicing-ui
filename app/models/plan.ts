import { Currency } from "./currency";

export class Plan
{
  id: number;
  title: string;
  thumbnail: string;
  originUrl: string;
  description: string;
  stripePriceId: string;
  stripeProductId: string;
  paypalPlanId: string;
  price: number;
  maxProduct: number;
  maxCustomer: number;
  maxOrder: number;
  maxEstimate: number;
  maxUser: number;
  maxStorage: number;
  createdAt: Date;
  updatedAt?: Date;
  createdById: number;
  recommended: boolean;
  status: string;
  cardStatus: string;
  currencyId: number;
  currency: Currency;
  state: string;
  cannotDelete: boolean;
}
