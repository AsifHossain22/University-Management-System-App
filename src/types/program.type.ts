export interface Program {
  id: string;
  name: string;
  code: string;
  description: string | null;
  departmentId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ProgramMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProgramQuery {
  searchTerm?: string;
  departmentId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'code' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProgramPayload {
  name: string;
  code: string;
  description?: string;
  departmentId: string;
}

export interface UpdateProgramPayload {
  name?: string;
  code?: string;
  description?: string;
  departmentId?: string;
  isActive?: boolean;
}
