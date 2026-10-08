import type { SidebarItems } from '@/types/sidebar.type';

export const studentRoutes: SidebarItems = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Student Dashboard',
        url: '/student-dashboard',
      },
      {
        title: 'Course Registration',
        url: '/student-dashboard/course-registration',
      },
      {
        title: 'My Attendance',
        url: '/student-dashboard/attendance',
      },
    ],
  },
];
