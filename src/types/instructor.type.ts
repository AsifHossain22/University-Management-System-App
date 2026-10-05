export interface InstructorProfile {
  id: string;
  userId: string;
  instructorId: string;
  profileImageUrl: string | null;
  profileImagePublicId: string | null;
  specialization: string | null;
  qualification: string | null;
  experienceYears: number | null;
  bio: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'INSTRUCTOR';
  };
}

export interface UpdateInstructorProfilePayload {
  firstName?: string;
  lastName?: string;
  specialization?: string;
  qualification?: string;
  experienceYears?: number;
  bio?: string;
  phone?: string;
  address?: string;
}
