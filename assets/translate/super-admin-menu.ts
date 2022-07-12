import { NbMenuItem } from '@nebular/theme';

export const en: NbMenuItem[] = [
  {
    title: 'Super admin',
    group: true,
  },
  {
    title: 'Console',
    icon: 'layout-outline',
    link: '/dashboard/super-admin-console/users',
  },
]

export const es: NbMenuItem[] = [
  {
    title: 'Super admin',
    group: true,
  },
  {
    title: 'Console',
    icon: 'layout-outline',
    link: '/dashboard/super-admin-console/users',
  },
]

export const fr: NbMenuItem[] = [
  {
    title: 'Super admin',
    group: true,
  },
  {
    title: "Console d'admin",
    icon: 'layout-outline',
    link: '/dashboard/super-admin-console/users',
  },
]

export const SUPER_ADMIN_MENUS = {
  en,
  es,
  fr
}
