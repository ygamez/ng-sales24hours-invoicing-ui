import { AccountType } from "./accounttype";
import { ChartAccounts } from "./chartaccounts";

export class AccountStatementReport {
  totalAmount: number;
  reportType: string;
  accountType: AccountType;
  accountStatementReportItems: AccountStatementReportItem[];
}

export interface AccountStatementReportItem {
  totalAmount: number;
  account: ChartAccounts;
}
