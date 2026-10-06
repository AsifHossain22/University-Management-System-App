export interface Semester {
  id: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface SemesterMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SemesterQuery {
  searchTerm?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'code' | 'startDate' | 'endDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateSemesterPayload {
  name: string;
  code: string;
  startDate: string;
  endDate: string;
}

export interface UpdateSemesterPayload {
  name?: string;
  code?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}
