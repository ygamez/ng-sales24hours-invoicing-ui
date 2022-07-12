export class Amount {
  currency_code: string;
  value: string;
}

export class Payee {
  email_address: string;
}

export class PlatformFee {
  amount: Amount;
}

export class PaymentInstruction {
  disbursement_mode: string;
  platform_fees: PlatformFee[];
}

export class PurchaseUnit {
  amount: Amount;
  payee: Payee;
  payment_instruction: PaymentInstruction;
}

export class PaypalOrder {
  intent: string;
  partnerId: string;
  tenantId: number;
  purchase_units: PurchaseUnit[];
}
