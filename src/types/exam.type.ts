export type ExamType =
  | 'MIDTERM'
  | 'FINAL'
  | 'QUIZ'
  | 'ASSIGNMENT'
  | 'PRESENTATION';

export interface Exam {
  id: string;
  sectionId: string;
  title: string;
  type: ExamType;
  examDate: string;
  totalMarks: number;
  passingMarks: number;
  weight: number;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  section: {
    id: string;
    name: string;
    code: string;
  };
}

export interface ExamMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ExamQuery {
  searchTerm?: string;
  sectionId?: string;
  type?: ExamType;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'examDate' | 'totalMarks' | 'weight' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateExamPayload {
  sectionId: string;
  title: string;
  type: ExamType;
  examDate: string;
  totalMarks: number;
  passingMarks: number;
  weight: number;
}

export interface UpdateExamPayload {
  title?: string;
  type?: ExamType;
  examDate?: string;
  totalMarks?: number;
  passingMarks?: number;
  weight?: number;
  isActive?: boolean;
}

export interface ExamListResponse {
  success: boolean;
  message: string;
  data: Exam[];
  meta: ExamMeta;
}
