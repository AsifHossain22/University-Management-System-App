import type { SidebarItems } from '@/types/sidebar.type';

export const adminRoutes: SidebarItems = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Profile',
        url: '/admin-dashboard/profile',
      },
      {
        title: 'Admin Dashboard',
        url: '/admin-dashboard',
      },
      {
        title: 'Departments',
        url: '/admin-dashboard/departments',
      },
      {
        title: 'Programs',
        url: '/admin-dashboard/programs',
      },
    ],
  },
];
