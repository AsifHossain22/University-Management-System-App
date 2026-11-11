import type { SidebarItems } from '@/types/sidebar.type';

export const instructorRoutes: SidebarItems = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Instructor Dashboard',
        url: '/instructor-dashboard',
      },
      {
        title: 'My Sections',
        url: '/instructor-dashboard/sections',
      },
      {
        title: 'Attendance',
        url: '/instructor-dashboard/attendance',
      },
    ],
  },
];
