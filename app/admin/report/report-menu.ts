import { NbMenuItem } from '@nebular/theme';

export const REPORT_MENU: NbMenuItem[] = [
  //Company settings
  {
    title: 'Income & expense reports',
    group: true
  },
  {
    title: 'Profit & loss',
    icon: 'clipboard-outline',
    link:'profit-and-loss'
  },
  {
    title: 'Balance sheet',
    icon: 'clipboard-outline',
    link:'balance-sheet'
  },
  // {
  //   title: 'Cash flow (comming soon...)',
  //   icon: 'clipboard-outline',
  //   link:'#'
  // },
  {
    title: 'Taxes reports',
    group: true
  },
  {
    title: 'Taxes report',
    icon: 'clipboard-outline',
    link:'taxes-sales'
  },
  {
    title: 'Customers reports ',
    group: true
  },
  {
    title: 'Sales by customer',
    icon: 'clipboard-outline',
    link:'customers-sales'
  },
  // {
  //   title: 'Aged receivables (coming soon...)',
  //   icon: 'clipboard-outline',
  //   link:'#'
  // },
  {
    title: 'Vendors reports ',
    group: true
  },
  {
    title: 'Purchase by vendor',
    icon: 'clipboard-outline',
    link:'vendors-purchases'
  },
  // {
  //   title: 'Aged payables (coming soon...)',
  //   icon: 'clipboard-outline',
  //   link:'#'
  // },
  {
    title: 'Accounts & transactions reports ',
    group: true
  },
  {
    title: 'Account balances',
    icon: 'clipboard-outline',
    link:'account-balances'
  },
  {
    title: 'Trial balances',
    icon: 'clipboard-outline',
    link:'trial-balances'
  },
  {
    title: 'Account transactions',
    icon: 'clipboard-outline',
    link:'account-transactions'
  },
];
