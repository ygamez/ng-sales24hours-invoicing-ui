import { Address } from "./address";
import { User } from "./user";

export class Company {
  id: number;
  createdById: number | null;
  createdBy: User;
  createdAt: string;
  updateAt: string | null;
  name: string;
  email: string;
  phone: string;
  taxNumber: string;
  taxNumberType: string;
  registrationNumber: string;
  shippingAddress: Address;
  billingAddress: Address;
}
