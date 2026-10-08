export interface Course {
  id: string;
  name: string;
  code: string;
  description: string | null;
  credits: number;
  departmentId: string;
  programId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CoursePrerequisite {
  id: string;
  name: string;
  code: string;
  credits: number;
  isActive: boolean;
}

export interface CoursePrerequisiteRelation {
  id: string;
  prerequisite: CoursePrerequisite;
}

export interface CourseDetail extends Course {
  department: {
    id: string;
    name: string;
    code: string;
    isActive: boolean;
  };
  program: {
    id: string;
    name: string;
    code: string;
    departmentId: string;
    isActive: boolean;
  };
  prerequisites: CoursePrerequisiteRelation[];
}

export interface CourseMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CourseQuery {
  searchTerm?: string;
  departmentId?: string;
  programId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'code' | 'credits' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCoursePayload {
  name: string;
  code: string;
  description?: string;
  credits: number;
  departmentId: string;
  programId: string;
}

export interface UpdateCoursePayload {
  name?: string;
  code?: string;
  description?: string;
  credits?: number;
  departmentId?: string;
  programId?: string;
  isActive?: boolean;
}
