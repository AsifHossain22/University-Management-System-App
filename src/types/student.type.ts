export interface StudentProfile {
  id: string;
  studentId: string;
  profileImageUrl: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'STUDENT';
  };
}

export interface UpdateStudentProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}
