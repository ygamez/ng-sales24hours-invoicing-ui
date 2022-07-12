import { NbMenuItem } from '@nebular/theme';

export const es: NbMenuItem[] = [
  {
    title: 'Users management',
    group: true
  },
  {
    title:'Usuarios y Roles',
     link: '/dashboard/super-admin-console/users',
    icon: 'people-outline'
  },
  // {
  //   title: 'Connected bank accounts',
  //   group: true
  // },
  // {
  //   title:'Stripe accounts',
  //    link: '/dashboard/super-admin-console/stripe-accounts',
  //   icon: 'people-outline'
  // },
  {
    title: 'Precios y suscripciones',
    group: true
  },
  {
    title:'Precios',
     link: '/dashboard/super-admin-console/pricings',
    icon: 'pricetags-outline'
  },
  {
    title:'Suscripciones',
     link: '/dashboard/super-admin-console/subscriptions',
    icon: 'credit-card-outline'
  },
  {
    title: 'Monedas',
    icon: 'credit-card-outline',
    link:'/dashboard/super-admin-console/currencies'
  },
  {
    title: 'Configuración del sitio web',
    group: true
  },
  {
    title: 'Preferencias',
    icon: 'layout-outline',
    link:'/dashboard/super-admin-console/general-settings'
  },
  {
    title: 'Ajustes del correo electrónico',
    icon: 'email-outline',
    link:'/dashboard/super-admin-console/email-settings'
  },
  {
    title: 'Inicio de sesión social',
    icon: 'email-outline',
    link:'/dashboard/super-admin-console/social-login'
  },
  // {
  //   title: 'Configuración bancaria y pagos',
  //   group: true
  // },
  // {
  //   title: 'Stripe & PayPal',
  //   icon: 'credit-card-outline',
  //   link:'/dashboard/super-admin-console/payment-settings'
  // },
  {
    title: 'Licencia de software',
    group: true
  },
  {
    title: 'Activar',
    icon: 'unlock-outline',
    link:'/dashboard/super-admin-console/license'
  },
];

export const en: NbMenuItem[] = [
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
];

export const fr: NbMenuItem[] = [
  {
    title: 'Gestion utilisateurs',
    group: true
  },
  {
    title:'Utilisateurs et rôles',
     link: '/dashboard/super-admin-console/users',
    icon: 'people-outline'
  },
  {
    title: 'Comptes bancaires connectés',
    group: true
  },
  {
    title:'Comptes Stripe',
     link: '/dashboard/super-admin-console/stripe-accounts',
    icon: 'people-outline'
  },
  {
    title: 'Pricing & Abonnements',
    group: true
  },
  {
    title:'Pricings',
     link: '/dashboard/super-admin-console/pricings',
    icon: 'pricetags-outline'
  },
  {
    title:'Abonnements',
     link: '/dashboard/super-admin-console/subscriptions',
    icon: 'credit-card-outline'
  },
  {
    title: 'Devises',
    icon: 'credit-card-outline',
    link:'/dashboard/super-admin-console/currencies'
  },
  {
    title: 'Paramètre du site',
    group: true
  },
  {
    title: 'Préférences',
    icon: 'layout-outline',
    link:'/dashboard/super-admin-console/general-settings'
  },
  {
    title: 'Paramètres email',
    icon: 'email-outline',
    link:'/dashboard/super-admin-console/email-settings'
  },
  {
    title: 'Social login',
    icon: 'email-outline',
    link:'/dashboard/super-admin-console/social-login'
  },
  {
    title: 'Paramètre de paiements',
    group: true
  },
  {
    title: 'Stripe & PayPal',
    icon: 'credit-card-outline',
    link:'/dashboard/super-admin-console/payment-settings'
  },
  {
    title: 'Licence',
    group: true
  },
  {
    title: 'Activer',
    icon: 'unlock-outline',
    link:'/dashboard/super-admin-console/license'
  },
]

export const SUPER_ADMIN_CONSOLE_MENUS = {
  en,
  es,
  fr
}
