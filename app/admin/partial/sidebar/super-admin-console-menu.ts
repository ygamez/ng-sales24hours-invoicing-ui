import { NbMenuItem } from '@nebular/theme';

export const SUPER_ADMIN_CONSOLE_MENU: NbMenuItem[] = [
  {
    title: 'Users management',
    group: true
  },
  {
    title:'Users & Roles',
     link: '/dashboard/super-admin-console/users',
    icon: 'people-outline'
  },
  {
    title: 'Connected bank accounts',
    group: true
  },
  {
    title:'Stripe accounts',
     link: '/dashboard/super-admin-console/stripe-accounts',
    icon: 'people-outline'
  },
  {
    title: 'Pricing & Subscriptions',
    group: true
  },
  {
    title:'Pricings',
     link: '/dashboard/super-admin-console/pricings',
    icon: 'pricetags-outline'
  },
  {
    title:'Subscriptions',
     link: '/dashboard/super-admin-console/subscriptions',
    icon: 'credit-card-outline'
  },
  {
    title: 'Currencies',
    icon: 'credit-card-outline',
    link:'/dashboard/super-admin-console/currencies'
  },
  {
    title: 'Website settings',
    group: true
  },
  {
    title: 'Preferences',
    icon: 'layout-outline',
    link:'/dashboard/super-admin-console/general-settings'
  },
  {
    title: 'Email settings',
    icon: 'email-outline',
    link:'/dashboard/super-admin-console/email-settings'
  },
  {
    title: 'Social login',
    icon: 'email-outline',
    link:'/dashboard/super-admin-console/social-login'
  },
  {
    title: 'Banking & Payments settings',
    group: true
  },
  {
    title: 'Stripe & PayPal',
    icon: 'credit-card-outline',
    link:'/dashboard/super-admin-console/payment-settings'
  },
  {
    title: 'Software license',
    group: true
  },
  {
    title: 'Activate',
    icon: 'unlock-outline',
    link:'/dashboard/super-admin-console/license'
  },
]
