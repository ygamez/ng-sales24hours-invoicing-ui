import { ChartAccounts } from "./chartaccounts";

export class TrialBalanceReport {
  category: string;
  totalDebit: number;
  totalCredit: number;
  trialBalanceReportItems: TrialBalanceReportItem[];
}

export class TrialBalanceReportItem {
  debit: number;
  credit: number;
  netMovement: number;
  accountCategory: string;
  accounts: ChartAccounts;
}
