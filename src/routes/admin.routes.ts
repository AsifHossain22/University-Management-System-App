import type { SidebarItems } from '@/types/sidebar.type';

export const adminRoutes: SidebarItems = [
  {
    title: 'Overview',
    items: [
      { title: 'Admin Dashboard', url: '/admin-dashboard' },
      { title: 'Departments', url: '/admin-dashboard/departments' },
      { title: 'Programs', url: '/admin-dashboard/programs' },
      { title: 'Courses', url: '/admin-dashboard/courses' },
      { title: 'Sections', url: '/admin-dashboard/sections' },
      {
        title: 'Course Prerequisites',
        url: '/admin-dashboard/course-prerequisites',
      },
      { title: 'Semesters', url: '/admin-dashboard/semesters' },
      { title: 'Fee Management', url: '/admin-dashboard/fees' },
      { title: 'Profile', url: '/admin-dashboard/profile' },
    ],
  },
];
