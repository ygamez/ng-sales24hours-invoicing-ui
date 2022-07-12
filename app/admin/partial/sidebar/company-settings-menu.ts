import { NbMenuItem } from '@nebular/theme';

export const COMPANY_SETTINGS_MENU: NbMenuItem[] = [
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
