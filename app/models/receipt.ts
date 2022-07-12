import { Revenue } from "./revenue";

export class Receipt {
  id: number;
  createdAt: Date;
  amount: number;
  paymentMethod: string;
  paymentCompleted: boolean;
  revenue: Revenue;
  customerReceiptLink: string;
}
