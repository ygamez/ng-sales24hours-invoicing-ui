import { AccountType } from "./accounttype";
import { AccountTypeCategory } from "./accounttypecategory";
import { ChartAccounts } from "./chartaccounts";

export class BalanceSheetReport {
  totalAmount: number;
  category: AccountTypeCategory;
  balanceSheetReportItems: BalanceSheetReportItem[];
}

export class BalanceSheetReportItem {
  totalAmount: number;
  accountType: AccountType;
  balanceSheetReportItemDetails: BalanceSheetReportItemDetail[];
}

export class BalanceSheetReportItemDetail {
  totalAmount: number;
  account: ChartAccounts;
}
