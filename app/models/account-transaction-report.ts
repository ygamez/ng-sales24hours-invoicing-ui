import { ChartAccounts } from "./chartaccounts";

export class AccountTransactionReport {
  startingBalance: number;
  endingBalance: number;
  reportType: string;
  totalCredit: number;
  totalDebit: number;
  totalBalance: Number;
  account: ChartAccounts;
  accountTransactionReportItems: AccountTransactionReportItem[];
}

export class AccountTransactionReportItem {
  description: string;
  date: string;
  debit: number;
  credit: number;
  balance: number;
}
