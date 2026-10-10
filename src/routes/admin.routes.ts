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
        title: 'Exam Management',
        url: '/admin-dashboard/exams',
      },
      {
        title: 'Results Management',
        url: '/admin-dashboard/results',
      },
      {
        title: 'Course Prerequisites',
        url: '/admin-dashboard/course-prerequisites',
      },
      { title: 'Semesters', url: '/admin-dashboard/semesters' },
      { title: 'Fee Management', url: '/admin-dashboard/fees' },
      {
        title: 'Instructor Applications',
        url: '/admin-dashboard/instructor-applications',
      },
      { title: 'Profile', url: '/admin-dashboard/profile' },
    ],
  },
];
