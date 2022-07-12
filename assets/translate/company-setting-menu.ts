import { NbMenuItem } from '@nebular/theme';

export const en: NbMenuItem[] = [
  //Company settings
  {
    title: 'Company settings',
    group: true
  },
  {
    title: 'Company profile',
    icon: 'clipboard-outline',
    link:'/dashboard/setting-list/company'
  },
  {
    title: 'Users & Roles',
    icon: 'people-outline',
     link: '/dashboard/setting-list/users',
  },
  {
	  title: 'Currencies',
	   link: '/dashboard/setting-list/currencies',
	  icon: 'file-remove-outline'
	},
  {
	  title: 'Invoice customization',
	  link: '/dashboard/setting-list/invoice/customization',
	  icon: 'file-outline'
	},
  {
    title: 'Subscriptions',
    group: true
  },
  {
    title:'Subscriptions',
     link: '/dashboard/setting-list/subscriptions',
    icon: 'shopping-bag-outline'
  },
  {
    title:'Pricings',
     link: '/dashboard/setting-list/pricings',
    icon: 'pricetags-outline'
  },
  {
    title: 'Products & sevices',
    group: true
  },
  {
	  title: 'Categories',
	   link: '/dashboard/setting-list/category-list',
	  icon: 'folder-outline'
	},
  {
    title: 'Accounting',
    group: true
  },
  {
	  title: 'Taxes',
	  link: '/dashboard/setting-list/taxes',
	  icon: 'file-remove-outline'
	},
  {
    title: 'Account',
    group: true
  },
  {
    title: 'User profile',
    icon: 'clipboard-outline',
    link:'/dashboard/setting-list/users/profile'
  },
  {
    title: 'Close account',
    icon: 'close-circle-outline',
    link:'/dashboard/setting-list/users/account/close'
  },
];

export const es: NbMenuItem[] = [
  //Company settings
  {
    title: 'Configuración de la empresa',
    group: true
  },
  {
    title: 'Perfil de la compañía',
    icon: 'clipboard-outline',
    link:'/dashboard/setting-list/company'
  },
  {
    title: 'Usuarios y roles',
    icon: 'people-outline',
     link: '/dashboard/setting-list/users',
  },
  {
	  title: 'Monedas',
	   link: '/dashboard/setting-list/currencies',
	  icon: 'file-remove-outline'
	},
  {
	  title: 'Personalización de facturas',
	  link: '/dashboard/setting-list/invoice/customization',
	  icon: 'file-outline'
	},
  {
    title: 'Suscripciones',
    group: true
  },
  {
    title:'Suscripciones',
     link: '/dashboard/setting-list/subscriptions',
    icon: 'shopping-bag-outline'
  },
  {
    title:'Precios',
     link: '/dashboard/setting-list/pricings',
    icon: 'pricetags-outline'
  },
  {
    title: 'Productos y servicios',
    group: true
  },
  {
	  title: 'Categorías',
	   link: '/dashboard/setting-list/category-list',
	  icon: 'folder-outline'
	},
  {
    title: 'Contabilidad',
    group: true
  },
  {
	  title: 'Impuestos',
	  link: '/dashboard/setting-list/taxes',
	  icon: 'file-remove-outline'
	},
  {
    title: 'Cuenta',
    group: true
  },
  {
    title: 'Perfil del usuario',
    icon: 'clipboard-outline',
    link:'/dashboard/setting-list/users/profile'
  },
  {
    title: 'Cerrar cuenta',
    icon: 'close-circle-outline',
    link:'/dashboard/setting-list/users/account/close'
  },
];

export const fr: NbMenuItem[] = [
  //Company settings
  {
    title: 'Paramètre entreprise',
    group: true
  },
  {
    title: 'Profil entreprise',
    icon: 'clipboard-outline',
    link:'/dashboard/setting-list/company'
  },
  {
    title: 'Utilisateurs & Rôles',
    icon: 'people-outline',
     link: '/dashboard/setting-list/users',
  },
  {
	  title: 'Devises',
	   link: '/dashboard/setting-list/currencies',
	  icon: 'file-remove-outline'
	},
  {
	  title: 'Personnalisation de facture',
	  link: '/dashboard/setting-list/invoice/customization',
	  icon: 'file-outline'
	},
  {
    title: 'Abonnements',
    group: true
  },
  {
    title:'Abonnements',
     link: '/dashboard/setting-list/subscriptions',
    icon: 'shopping-bag-outline'
  },
  {
    title:'Pricings',
     link: '/dashboard/setting-list/pricings',
    icon: 'pricetags-outline'
  },
  {
    title: 'Produits & sevices',
    group: true
  },
  {
	  title: 'Categories',
	   link: '/dashboard/setting-list/category-list',
	  icon: 'folder-outline'
	},
  {
    title: 'Compatabilités',
    group: true
  },
  {
	  title: 'Taxes',
	  link: '/dashboard/setting-list/taxes',
	  icon: 'file-remove-outline'
	},
  {
    title: 'Comptes',
    group: true
  },
  {
    title: 'Profil utilisateur',
    icon: 'clipboard-outline',
    link:'/dashboard/setting-list/users/profile'
  },
  {
    title: 'Fermer le compte',
    icon: 'close-circle-outline',
    link:'/dashboard/setting-list/users/account/close'
  },
];

export const COMPANY_SETTINGS_MENUS = {
  en,
  es,
  fr
}
