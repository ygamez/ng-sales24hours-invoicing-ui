import { Plan } from "./plan";
import { User } from "./user";

export class PaypalSubscription {
  id: number;
  paypalId: string;
  name: string;
  description: string;
  start_date: string;
  payer: string;
  token: string;
  planId: number;
  plan: Plan;
  shipping_address: ShippingAddress;
  links: Link[];
  createdById: number;
  createdBy: User;
}

export class Link {
  href: string;
  rel: string;
  method: string;
  enctype: string;
}

export class ShippingAddress {
  id: number;
  paypalId: string;
  line1: string;
  city: string;
  state: string;
  postal_code: string;
  country_code: string;
}
