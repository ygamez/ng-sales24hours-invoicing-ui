import { NbMenuItem } from '@nebular/theme';

export const es: NbMenuItem[] = [
  //Company settings
  {
    title: 'Ingresos y gastos',
    group: true
  },
  {
    title: 'Beneficios & perdidas',
    icon: 'clipboard-outline',
    link:'profit-and-loss'
  },
  {
    title: 'Balance',
    icon: 'clipboard-outline',
    link:'balance-sheet'
  },
  // {
  //   title: 'Cash flow (comming soon...)',
  //   icon: 'clipboard-outline',
  //   link:'#'
  // },
  {
    title: 'Impuestos',
    group: true
  },
  {
    title: 'Impuestos',
    icon: 'clipboard-outline',
    link:'taxes-sales'
  },
  {
    title: 'Imformes de clientes',
    group: true
  },
  {
    title: 'Ventas por clientes',
    icon: 'clipboard-outline',
    link:'customers-sales'
  },
  // {
  //   title: 'Aged receivables (coming soon...)',
  //   icon: 'clipboard-outline',
  //   link:'#'
  // },
  {
    title: 'Proveedores',
    group: true
  },
  {
    title: 'Compra por vendedor',
    icon: 'clipboard-outline',
    link:'vendors-purchases'
  },
  // {
  //   title: 'Aged payables (coming soon...)',
  //   icon: 'clipboard-outline',
  //   link:'#'
  // },
  {
    title: 'Cuentas y transacciones',
    group: true
  },
  {
    title: 'Saldos de cuentas',
    icon: 'clipboard-outline',
    link:'account-balances'
  },
  {
    title: 'Saldos de pruebas',
    icon: 'clipboard-outline',
    link:'trial-balances'
  },
  {
    title: 'Transacciones de cuenta',
    icon: 'clipboard-outline',
    link:'account-transactions'
  },
];

export const en: NbMenuItem[] = [
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

export const fr: NbMenuItem[] = [
  //Company settings
  {
    title: 'Revnues & Dépenses',
    group: true
  },
  {
    title: 'Pertes & Profit',
    icon: 'clipboard-outline',
    link:'profit-and-loss'
  },
  {
    title: 'Bilan financier',
    icon: 'clipboard-outline',
    link:'balance-sheet'
  },
  // {
  //   title: 'Cash flow (comming soon...)',
  //   icon: 'clipboard-outline',
  //   link:'#'
  // },
  {
    title: 'Raport des taxes',
    group: true
  },
  {
    title: 'Raport de taxes',
    icon: 'clipboard-outline',
    link:'taxes-sales'
  },
  {
    title: 'Rapport client',
    group: true
  },
  {
    title: 'Ventes par client',
    icon: 'clipboard-outline',
    link:'customers-sales'
  },
  // {
  //   title: 'Aged receivables (coming soon...)',
  //   icon: 'clipboard-outline',
  //   link:'#'
  // },
  {
    title: 'Rapport fournisseurs',
    group: true
  },
  {
    title: 'Achats fournisseur',
    icon: 'clipboard-outline',
    link:'vendors-purchases'
  },
  // {
  //   title: 'Aged payables (coming soon...)',
  //   icon: 'clipboard-outline',
  //   link:'#'
  // },
  {
    title: 'Compte & Transactions',
    group: true
  },
  {
    title: 'Solde des comptes',
    icon: 'clipboard-outline',
    link:'account-balances'
  },
  {
    title: 'Soldes de vérification',
    icon: 'clipboard-outline',
    link:'trial-balances'
  },
  {
    title: 'Transaction des comptes',
    icon: 'clipboard-outline',
    link:'account-transactions'
  },
];

export const REPORT_MENUS = {
  en,
  es,
  fr
}
