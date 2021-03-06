import { NbMenuItem } from '@nebular/theme';

export const en: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'pie-chart-outline',
    link: '/dashboard/home',
    home: true,
  },
  {
	  title: 'Bank accounts',
	  link: '/dashboard/bank-account-list',
	  icon: 'checkmark-square-outline'
	},
  {
    title: 'Sales & Expenses',
    group: true,
  },
  {
    title: 'Sales',
    icon: 'credit-card-outline',
    children: [
      {
        title: 'Estimates',
        link: '/dashboard/proposal-list',
      },
      {
        title: 'Invoices',
        link: '/dashboard/invoice-list',
      },
      {
        title: 'Recurring invoices',
        link: '/dashboard/recurring-invoices',
      },
      {
        title: 'Incomes',
        link: '/dashboard/revenue-list',
      },
      {
        title: 'Credit notes',
        link: '/dashboard/credit-note-list',
      },
      {
        title: 'Customers',
        link: '/dashboard/customer-list',
      },
    ]
  },
  {
    title: 'Products & Services',
    icon: 'shopping-bag-outline',
    children: [
      {
        title: 'Products',
        link: '/dashboard/product-list',
      },
      {
        title: 'Services',
        link: '/dashboard/service-list',
      },
    ]
  },
  {
    title:'Expenses',
    icon:'credit-card-outline',
    children:[
      {
        title: 'Bills',
        link: '/dashboard/bill-list',
      },
      {
        title: 'Expenses',
        link: '/dashboard/payment-list',
      },
      {
        title: 'Debit notes',
        link: '/dashboard/debit-note-list',
      },
      {
        title: 'Vendors',
        link: '/dashboard/vendor-list',
      },
    ]
  },
  {
    title: 'Accounting',
    group: true,
  },
  {
	  title: 'Manual journals',
	  link: '/dashboard/manual-journal-list',
	  icon: 'file-text-outline'
	},
  {
	  title: 'Transactions',
	  link: '/dashboard/transaction-list',
	  icon: 'swap-outline'
	},
  {
	  title: 'Chart of accounts',
	  link: '/dashboard/chart-accounts-list',
	  icon: 'book-outline'
	},
  {
	  title: 'Assets',
	  link: '/dashboard/assets-list',
	  icon: 'briefcase-outline'
	},
  {
    title: 'Reports',
    group: true,
  },
  {
    title: 'Reports',
    link: '/dashboard/reports/profit-and-loss',
    icon: 'bar-chart-outline'
  },
  {
	  title: 'Settings',
	  group: true
	},
  {
	  title: 'Settings',
	  link: '/dashboard/setting-list/company',
	  icon: 'settings-outline'
	},
];

export const es: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'pie-chart-outline',
    link: '/dashboard/home',
    home: true,
  },
  // {
	//   title: 'Cuentas bancarias',
	//   link: '/dashboard/bank-account-list',
	//   icon: 'checkmark-square-outline'
	// },
  // {
  //   title: 'Ventas & Gastos',
  //   group: true,
  // },
  {
    title: 'Ventas',
    icon: 'credit-card-outline',
    children: [
      {
        title: 'Proformas',
        link: '/dashboard/proposal-list',
      },
      {
        title: 'Facturas',
        link: '/dashboard/invoice-list',
      },
      // {
      //   title: 'Facturas recurrentes',
      //   link: '/dashboard/recurring-invoices',
      // },
      // {
      //   title: 'Ingresos',
      //   link: '/dashboard/revenue-list',
      // },
      {
        title: 'Notas de cr??dito',
        link: '/dashboard/credit-note-list',
      },
      {
        title: 'Clientes',
        link: '/dashboard/customer-list',
      },
    ]
  },
  {
    title:'Gastos',
    icon:'credit-card-outline',
    children:[
      {
        title: 'Facturas de gastos',
        link: '/dashboard/bill-list',
      },
      {
        title: 'Gastos',
        link: '/dashboard/payment-list',
      },
      {
        title: 'Notas de d??bito',
        link: '/dashboard/debit-note-list',
      },
      {
        title: 'Proveedores',
        link: '/dashboard/vendor-list',
      },
    ]
  },
  {
    title: 'Productos & Servicios',
    icon: 'shopping-bag-outline',
    children: [
      {
        title: 'Productos',
        link: '/dashboard/product-list',
      },
      {
        title: 'Servicios',
        link: '/dashboard/service-list',
      },
    ]
  },
  {
    title: 'Contabilidad',
    children: [
      {
        title: 'Libros di??rios',
        link: '/dashboard/manual-journal-list',
        icon: 'file-text-outline'
      },
      {
        title: 'Actas',
        link: '/dashboard/transaction-list',
        icon: 'swap-outline'
      },
      {
        title: 'Cat??logo de cuentas',
        link: '/dashboard/chart-accounts-list',
        icon: 'book-outline'
      },
      {
        title: 'Activos',
        link: '/dashboard/assets-list',
        icon: 'briefcase-outline'
      }
    ]
  },
  {
    title: 'Reportes',
    link: '/dashboard/reports/profit-and-loss',
    icon: 'bar-chart-outline'
  },
  {
	  title: 'Configuraci??n',
	  link: '/dashboard/setting-list/company',
	  icon: 'settings-outline'
	},
];

export const fr: NbMenuItem[] = [
  {
    title: 'Tableau de bord',
    icon: 'pie-chart-outline',
    link: '/dashboard/home',
    home: true,
  },
  {
	  title: 'Compte bancaires',
	  link: '/dashboard/bank-account-list',
	  icon: 'checkmark-square-outline'
	},
  {
    title: 'Products & Services',
    icon: 'shopping-bag-outline',
    children: [
      {
        title: 'Produits',
        link: '/dashboard/product-list',
      },
      {
        title: 'Services',
        link: '/dashboard/service-list',
      },
    ]
  },
  {
    title: 'Ventes & D??penses',
    group: true,
  },
  {
    title: 'Ventes',
    icon: 'credit-card-outline',
    children: [
      {
        title: 'Devis',
        link: '/dashboard/proposal-list',
      },
      {
        title: 'Facture',
        link: '/dashboard/invoice-list',
      },
      {
        title: 'Facture r??currente',
        link: '/dashboard/recurring-invoices',
      },
      {
        title: 'Revenues',
        link: '/dashboard/revenue-list',
      },
      {
        title: 'Notes de cr??dit',
        link: '/dashboard/credit-note-list',
      },
      {
        title: 'Clients',
        link: '/dashboard/customer-list',
      },
    ]
  },
  {
    title:'D??penses',
    icon:'credit-card-outline',
    children:[
      {
        title: 'Facture de d??pense',
        link: '/dashboard/bill-list',
      },
      {
        title: 'D??penses',
        link: '/dashboard/payment-list',
      },
      {
        title: 'Notes de debit',
        link: '/dashboard/debit-note-list',
      },
      {
        title: 'Fournisseurs',
        link: '/dashboard/vendor-list',
      },
    ]
  },
  {
    title: 'Comptabilit??s',
    group: true,
  },
  {
	  title: 'Journals manuels',
	  link: '/dashboard/manual-journal-list',
	  icon: 'file-text-outline'
	},
  {
	  title: 'Transactions',
	  link: '/dashboard/transaction-list',
	  icon: 'swap-outline'
	},
  {
	  title: 'Plan comptable',
	  link: '/dashboard/chart-accounts-list',
	  icon: 'book-outline'
	},
  {
	  title: 'Actifs',
	  link: '/dashboard/assets-list',
	  icon: 'briefcase-outline'
	},
  {
    title: 'Rapports',
    group: true,
  },
  {
    title: 'Raports',
    link: '/dashboard/reports/profit-and-loss',
    icon: 'bar-chart-outline'
  },
  {
	  title: 'Param??tres',
	  group: true
	},
  {
	  title: 'Param??tres',
	  link: '/dashboard/setting-list/company',
	  icon: 'settings-outline'
	},
];

export const SIDEBAR_MENUS = {
  en,
  es,
  fr
}
