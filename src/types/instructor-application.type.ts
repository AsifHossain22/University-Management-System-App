export type InstructorApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type ApplyAsInstructorPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  bio?: string;
  departmentId?: string;

  // OptionalUploadedFiles
  profilePhoto?: File;
  cv?: File;
  supportingDocuments?: File[];
};

export type ApplyAsInstructorResponse = {
  id: string;
  email: string;
  status: InstructorApplicationStatus;
  emailVerified: boolean;
};

export type VerifyInstructorEmailPayload = {
  email: string;
  otp: string;
};

export type VerifyInstructorEmailResponse = {
  id: string;
  email: string;
  status: InstructorApplicationStatus;
  emailVerifiedAt: string;
};
