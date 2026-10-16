import type { SidebarItems } from '@/types/sidebar.type';

export const adminRoutes: SidebarItems = [
  {
    title: 'Overview',
    items: [
      { title: 'Admin Dashboard', url: '/admin-dashboard' },
      { title: 'Audit Logs', url: '/admin-dashboard/audit-logs' },
      {
        title: 'Course Prerequisites',
        url: '/admin-dashboard/course-prerequisites',
      },
      { title: 'Courses', url: '/admin-dashboard/courses' },
      { title: 'Departments', url: '/admin-dashboard/departments' },
      {
        title: 'Exam Management',
        url: '/admin-dashboard/exams',
      },
      { title: 'Fee Management', url: '/admin-dashboard/fees' },
      {
        title: 'Instructor Applications',
        url: '/admin-dashboard/instructor-applications',
      },
      { title: 'Profile', url: '/admin-dashboard/profile' },
      { title: 'Programs', url: '/admin-dashboard/programs' },
      { title: 'Results Management', url: '/admin-dashboard/results' },
      { title: 'Sections', url: '/admin-dashboard/sections' },
      { title: 'Semesters', url: '/admin-dashboard/semesters' },
      { title: 'Students', url: '/admin-dashboard/students' },
    ],
  },
];
