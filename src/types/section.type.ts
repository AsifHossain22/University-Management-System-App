export interface Section {
  id: string;
  name: string;
  code: string;
  courseId: string;
  semesterId: string;
  instructorId: string;
  capacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  course: {
    id: string;
    name: string;
    code: string;
    credits: number;
  };

  semester: {
    id: string;
    name: string;
    code: string;
  };

  instructor: {
    id: string;
    instructorId: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface SectionMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SectionQuery {
  searchTerm?: string;
  courseId?: string;
  semesterId?: string;
  instructorId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'code' | 'capacity' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateSectionPayload {
  name: string;
  code: string;
  courseId: string;
  semesterId: string;
  instructorId: string;
  capacity: number;
}

export interface UpdateSectionPayload {
  name?: string;
  code?: string;
  courseId?: string;
  semesterId?: string;
  instructorId?: string;
  capacity?: number;
  isActive?: boolean;
}
