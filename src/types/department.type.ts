export interface Department {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface DepartmentMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DepartmentQuery {
  searchTerm?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'code' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateDepartmentPayload {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateDepartmentPayload {
  name?: string;
  code?: string;
  description?: string;
  isActive?: boolean;
}
