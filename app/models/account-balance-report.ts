import { ChartAccounts } from "./chartaccounts";

export class AccountBalanceReport {
  category: string;
  totalStartingBalance: number;
  totalEndingBalance: number;
  totalDebit: number;
  totalCredit: number;
  accountBalanceReportItems: AccountBalanceReportItem[];
}

export class AccountBalanceReportItem {
  startingBalance: number;
  debit: number;
  credit: number;
  netMovement: number;
  endingBalance: number;
  accountCategory: string;
  accounts: ChartAccounts;
}
