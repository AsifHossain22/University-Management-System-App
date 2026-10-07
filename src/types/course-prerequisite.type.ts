export interface CoursePrerequisite {
  id: string;
  courseId: string;
  prerequisiteId: string;
  course: {
    id: string;
    name: string;
    code: string;
    credits: number;
  };
  prerequisite: {
    id: string;
    name: string;
    code: string;
    credits: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CoursePrerequisiteMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CoursePrerequisiteQuery {
  courseId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCoursePrerequisitePayload {
  courseId: string;
  prerequisiteId: string;
}
