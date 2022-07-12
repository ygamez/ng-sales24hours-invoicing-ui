import { User } from "./user";

export class InvoiceCustomization {
  id: number;
  createdById: number | null;
  createdBy: User;
  invoiceName: string;
  invoiceTitle: string;
  invoiceSubtitle: string;
  invoiceFooter: string;
  invoiceNotes: string;
  estimateName: string;
  estimateTitle: string;
  estimateSubtitle: string;
  estimateFooter: string;
  estimateNotes: string;
  items: string;
  units: string;
  price: string;
  amount: string;
  hideShippingAddress: boolean;
  hideDescription: boolean;
  hideQuantity: boolean;
  hidePrice: boolean;
  hideTax: boolean;
  hideCategory: boolean;
  hideDiscount: boolean;
}
