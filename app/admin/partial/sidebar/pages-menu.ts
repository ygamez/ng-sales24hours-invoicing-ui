import { NbMenuItem } from '@nebular/theme';
import * as adminComponentConfig  from '../../admin-components.config';

export const MENU_ITEMS: NbMenuItem[] = [
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
  ...adminComponentConfig.menuItems,
  {
	  title: 'Settings',
	  link: '/dashboard/setting-list/company',
	  icon: 'settings-outline'
	},
];

