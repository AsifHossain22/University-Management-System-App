'use client';

import { useForm } from '@tanstack/react-form';
import { Eye, EyeOff, FileText, ImagePlus, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useRegistration } from '@/hooks/auth.hook';
import { useApplyAsInstructor } from '@/hooks/instructor-application.hook';
import { getApiErrorMessage } from '@/lib/api-error';
import type { ApplyAsInstructorPayload } from '@/types/instructor-application.type';
import {
  applyAsInstructorSchema,
  registerSchema,
} from '@/validation/auth.validation';

type RegisterFormValues = z.infer<typeof registerSchema>;
type InstructorFormValues = z.infer<typeof applyAsInstructorSchema>;
type RegistrationTab = 'STUDENT' | 'INSTRUCTOR';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_SUPPORTING_DOCUMENTS = 5;

const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function validateFile(
  file: File,
  allowedTypes: string[],
  label: string,
): string | null {
  if (!allowedTypes.includes(file.type)) {
    return `${label} must use an allowed file format.`;
  }

  if (file.size > MAX_FILE_SIZE) {
    return `${label} must be 5 MB or smaller.`;
  }

  return null;
}

export default function RegisterPage() {
  const router = useRouter();

  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const supportingDocumentsInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<RegistrationTab>('STUDENT');
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [showInstructorPassword, setShowInstructorPassword] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState<File | undefined>();
  const [cv, setCv] = useState<File | undefined>();
  const [supportingDocuments, setSupportingDocuments] = useState<File[]>([]);

  const [profilePhotoError, setProfilePhotoError] = useState('');
  const [cvError, setCvError] = useState('');
  const [supportingDocumentsError, setSupportingDocumentsError] = useState('');

  const { mutate: registration, isPending: registrationPending } =
    useRegistration();

  const { mutate: applyAsInstructor, isPending: instructorApplicationPending } =
    useApplyAsInstructor();

  const studentDefaultValues: RegisterFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'STUDENT',
  };

  const instructorDefaultValues: InstructorFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    specialization: '',
    qualification: '',
    experienceYears: 0,
    bio: '',
  };

  const studentForm = useForm({
    defaultValues: studentDefaultValues,
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      registration(value, {
        onSuccess: response => {
          toast.success('Account created successfully.', {
            description: 'Please verify your email address to continue.',
          });

          const params = new URLSearchParams({
            email: response.data.email,
          });

          router.push(`/verify-email?${params.toString()}`);
        },
        onError: error => {
          toast.error(getApiErrorMessage(error));
        },
      });
    },
  });

  const instructorForm = useForm({
    defaultValues: instructorDefaultValues,
    validators: {
      onSubmit: applyAsInstructorSchema,
    },
    onSubmit: async ({ value }) => {
      // ValidateFilesBeforeSubmittingApplication
      if (profilePhoto) {
        const error = validateFile(profilePhoto, PHOTO_TYPES, 'Profile photo');

        if (error) {
          setProfilePhotoError(error);
          toast.error(error);
          return;
        }
      }

      if (cv) {
        const error = validateFile(cv, DOCUMENT_TYPES, 'CV');

        if (error) {
          setCvError(error);
          toast.error(error);
          return;
        }
      }

      if (supportingDocuments.length > MAX_SUPPORTING_DOCUMENTS) {
        const error = 'You can upload a maximum of 5 supporting documents.';
        setSupportingDocumentsError(error);
        toast.error(error);
        return;
      }

      for (const file of supportingDocuments) {
        const error = validateFile(
          file,
          DOCUMENT_TYPES,
          `Supporting document "${file.name}"`,
        );

        if (error) {
          setSupportingDocumentsError(error);
          toast.error(error);
          return;
        }
      }

      setProfilePhotoError('');
      setCvError('');
      setSupportingDocumentsError('');

      const payload: ApplyAsInstructorPayload = {
        ...value,
        email: value.email.trim().toLowerCase(),
        firstName: value.firstName.trim(),
        lastName: value.lastName.trim(),
        specialization: value.specialization.trim(),
        qualification: value.qualification.trim(),
        experienceYears: Number(value.experienceYears),
        ...(value.bio?.trim() ? { bio: value.bio.trim() } : {}),
        ...(profilePhoto ? { profilePhoto } : {}),
        ...(cv ? { cv } : {}),
        ...(supportingDocuments.length > 0 ? { supportingDocuments } : {}),
      };

      applyAsInstructor(payload, {
        onSuccess: response => {
          toast.success('Instructor application submitted.', {
            description: 'Check your email for the verification code.',
          });

          const params = new URLSearchParams({
            email: response.data.email,
          });

          router.push(`/verify-instructor-email?${params.toString()}`);
        },
        onError: error => {
          toast.error(getApiErrorMessage(error));
        },
      });
    },
  });

  const handleProfilePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    setProfilePhotoError('');

    if (!file) {
      setProfilePhoto(undefined);
      return;
    }

    const error = validateFile(file, PHOTO_TYPES, 'Profile photo');

    if (error) {
      setProfilePhoto(undefined);
      event.target.value = '';
      setProfilePhotoError(error);
      toast.error(error);
      return;
    }

    setProfilePhoto(file);
  };

  const handleCvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setCvError('');

    if (!file) {
      setCv(undefined);
      return;
    }

    const error = validateFile(file, DOCUMENT_TYPES, 'CV');

    if (error) {
      setCv(undefined);
      event.target.value = '';
      setCvError(error);
      toast.error(error);
      return;
    }

    setCv(file);
  };

  const handleSupportingDocumentsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    setSupportingDocumentsError('');

    if (selectedFiles.length > MAX_SUPPORTING_DOCUMENTS) {
      setSupportingDocuments([]);
      event.target.value = '';
      const error = 'You can select a maximum of 5 supporting documents.';
      setSupportingDocumentsError(error);
      toast.error(error);
      return;
    }

    for (const file of selectedFiles) {
      const error = validateFile(
        file,
        DOCUMENT_TYPES,
        `Supporting document "${file.name}"`,
      );

      if (error) {
        setSupportingDocuments([]);
        event.target.value = '';
        setSupportingDocumentsError(error);
        toast.error(error);
        return;
      }
    }

    setSupportingDocuments(selectedFiles);
  };

  const removeSupportingDocument = (index: number) => {
    setSupportingDocuments(current =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );

    if (supportingDocumentsInputRef.current) {
      supportingDocumentsInputRef.current.value = '';
    }

    setSupportingDocumentsError('');
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Register as a student or apply to become an instructor.
          </p>
        </div>

        <div
          className="mb-6 grid grid-cols-2 rounded-xl border bg-muted p-1"
          role="tablist"
          aria-label="Registration type"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'STUDENT'}
            onClick={() => setActiveTab('STUDENT')}
            className={`rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
              activeTab === 'STUDENT'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Student Registration
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'INSTRUCTOR'}
            onClick={() => setActiveTab('INSTRUCTOR')}
            className={`rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
              activeTab === 'INSTRUCTOR'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Apply as Instructor
          </button>
        </div>

        {activeTab === 'STUDENT' ? (
          <section role="tabpanel" aria-label="Student registration">
            <form
              onSubmit={event => {
                event.preventDefault();
                event.stopPropagation();
                studentForm.handleSubmit();
              }}
              className="rounded-xl border bg-card p-6 shadow-sm"
            >
              <FieldGroup>
                <div className="grid gap-5 sm:grid-cols-2">
                  <studentForm.Field name="firstName">
                    {field => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor="student-firstName">
                            First name
                          </FieldLabel>
                          <Input
                            id="student-firstName"
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={event =>
                              field.handleChange(event.target.value)
                            }
                            aria-invalid={isInvalid}
                            autoComplete="given-name"
                            required={true}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </studentForm.Field>

                  <studentForm.Field name="lastName">
                    {field => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor="student-lastName">
                            Last name
                          </FieldLabel>
                          <Input
                            id="student-lastName"
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={event =>
                              field.handleChange(event.target.value)
                            }
                            aria-invalid={isInvalid}
                            autoComplete="family-name"
                            required={true}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </studentForm.Field>
                </div>

                <studentForm.Field name="email">
                  {field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="student-email">Email</FieldLabel>
                        <Input
                          id="student-email"
                          name={field.name}
                          type="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={event =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={isInvalid}
                          autoComplete="email"
                          required={true}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </studentForm.Field>

                <studentForm.Field name="password">
                  {field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="student-password">
                          Password
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            id="student-password"
                            name={field.name}
                            type={showStudentPassword ? 'text' : 'password'}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={event =>
                              field.handleChange(event.target.value)
                            }
                            aria-invalid={isInvalid}
                            className="pr-10"
                            autoComplete="new-password"
                            required={true}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowStudentPassword(current => !current)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label={
                              showStudentPassword
                                ? 'Hide password'
                                : 'Show password'
                            }
                          >
                            {showStudentPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </studentForm.Field>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={registrationPending}
                >
                  {registrationPending
                    ? 'Creating account...'
                    : 'Create student account'}
                </Button>
              </FieldGroup>
            </form>
          </section>
        ) : (
          <section role="tabpanel" aria-label="Instructor application">
            <form
              onSubmit={event => {
                event.preventDefault();
                event.stopPropagation();
                instructorForm.handleSubmit();
              }}
              className="rounded-xl border bg-card p-6 shadow-sm"
            >
              <div className="mb-6">
                <h2 className="text-lg font-semibold">
                  Instructor application
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Submit your details and verify your email. Your application
                  will then be reviewed by an administrator.
                </p>
              </div>

              <FieldGroup>
                <div className="grid gap-5 sm:grid-cols-2">
                  <instructorForm.Field name="firstName">
                    {field => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor="instructor-firstName">
                            First name
                          </FieldLabel>
                          <Input
                            id="instructor-firstName"
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={event =>
                              field.handleChange(event.target.value)
                            }
                            aria-invalid={isInvalid}
                            autoComplete="given-name"
                            required={true}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </instructorForm.Field>

                  <instructorForm.Field name="lastName">
                    {field => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor="instructor-lastName">
                            Last name
                          </FieldLabel>
                          <Input
                            id="instructor-lastName"
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={event =>
                              field.handleChange(event.target.value)
                            }
                            aria-invalid={isInvalid}
                            autoComplete="family-name"
                            required={true}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </instructorForm.Field>
                </div>

                <instructorForm.Field name="email">
                  {field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="instructor-email">
                          Email
                        </FieldLabel>
                        <Input
                          id="instructor-email"
                          name={field.name}
                          type="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={event =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={isInvalid}
                          autoComplete="email"
                          required={true}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </instructorForm.Field>

                <instructorForm.Field name="password">
                  {field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="instructor-password">
                          Password
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            id="instructor-password"
                            name={field.name}
                            type={showInstructorPassword ? 'text' : 'password'}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={event =>
                              field.handleChange(event.target.value)
                            }
                            aria-invalid={isInvalid}
                            className="pr-10"
                            autoComplete="new-password"
                            required={true}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowInstructorPassword(current => !current)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label={
                              showInstructorPassword
                                ? 'Hide password'
                                : 'Show password'
                            }
                          >
                            {showInstructorPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </instructorForm.Field>

                <instructorForm.Field name="specialization">
                  {field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="instructor-specialization">
                          Specialization
                        </FieldLabel>
                        <Input
                          id="instructor-specialization"
                          name={field.name}
                          placeholder="e.g. Web Development"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={event =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={isInvalid}
                          required={true}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </instructorForm.Field>

                <instructorForm.Field name="qualification">
                  {field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="instructor-qualification">
                          Highest qualification
                        </FieldLabel>
                        <Input
                          id="instructor-qualification"
                          name={field.name}
                          placeholder="e.g. Bachelor's in Computer Science"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={event =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={isInvalid}
                          required={true}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </instructorForm.Field>

                <instructorForm.Field name="experienceYears">
                  {field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="instructor-experienceYears">
                          Years of experience
                        </FieldLabel>
                        <Input
                          id="instructor-experienceYears"
                          name={field.name}
                          type="number"
                          min={0}
                          step={1}
                          value={String(field.state.value)}
                          onBlur={field.handleBlur}
                          onChange={event => {
                            const inputValue = event.target.value;
                            field.handleChange(
                              inputValue === ''
                                ? Number.NaN
                                : Number(inputValue),
                            );
                          }}
                          aria-invalid={isInvalid}
                          required={true}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </instructorForm.Field>

                <instructorForm.Field name="bio">
                  {field => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="instructor-bio">
                          Professional biography (optional)
                        </FieldLabel>
                        <textarea
                          id="instructor-bio"
                          name={field.name}
                          rows={4}
                          value={field.state.value ?? ''}
                          onBlur={field.handleBlur}
                          onChange={event =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={isInvalid}
                          placeholder="Briefly describe your teaching experience and expertise."
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </instructorForm.Field>

                {/* ProfilePhotoUpload */}
                <Field data-invalid={Boolean(profilePhotoError)}>
                  <FieldLabel htmlFor="instructor-profile-photo">
                    <ImagePlus className="mr-2 inline size-4" />
                    Profile Photo
                  </FieldLabel>
                  <Input
                    ref={profilePhotoInputRef}
                    id="instructor-profile-photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleProfilePhotoChange}
                    aria-invalid={Boolean(profilePhotoError)}
                    required={true}
                  />
                  <p className="text-xs text-muted-foreground">
                    JPEG, JPG, PNG or WebP. Maximum 5 MB.
                  </p>
                  {profilePhoto && (
                    <div className="flex items-center justify-between gap-3 rounded-md border p-2 text-sm">
                      <span className="truncate">{profilePhoto.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Remove profile photo"
                        onClick={() => {
                          setProfilePhoto(undefined);
                          setProfilePhotoError('');
                          if (profilePhotoInputRef.current) {
                            profilePhotoInputRef.current.value = '';
                          }
                        }}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  )}
                  {profilePhotoError && (
                    <p className="text-sm text-destructive">
                      {profilePhotoError}
                    </p>
                  )}
                </Field>

                {/* CVUpload */}
                <Field data-invalid={Boolean(cvError)}>
                  <FieldLabel htmlFor="instructor-cv">
                    <FileText className="mr-2 inline size-4" />
                    CV or Resume
                  </FieldLabel>
                  <Input
                    ref={cvInputRef}
                    id="instructor-cv"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleCvChange}
                    aria-invalid={Boolean(cvError)}
                    required={true}
                  />
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC or DOCX. Maximum 5 MB.
                  </p>
                  {cv && (
                    <div className="flex items-center justify-between gap-3 rounded-md border p-2 text-sm">
                      <span className="truncate">{cv.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Remove CV"
                        onClick={() => {
                          setCv(undefined);
                          setCvError('');
                          if (cvInputRef.current) {
                            cvInputRef.current.value = '';
                          }
                        }}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  )}
                  {cvError && (
                    <p className="text-sm text-destructive">{cvError}</p>
                  )}
                </Field>

                {/* SupportingDocumentsUpload */}
                <Field data-invalid={Boolean(supportingDocumentsError)}>
                  <FieldLabel htmlFor="instructor-supporting-documents">
                    <FileText className="mr-2 inline size-4" />
                    Certificates
                  </FieldLabel>
                  <Input
                    ref={supportingDocumentsInputRef}
                    id="instructor-supporting-documents"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleSupportingDocumentsChange}
                    aria-invalid={Boolean(supportingDocumentsError)}
                    required={true}
                  />
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC or DOCX. Up to 5 files, maximum 5 MB each.
                  </p>

                  {supportingDocuments.length > 0 && (
                    <ul className="mt-2 space-y-2">
                      {supportingDocuments.map((file, index) => (
                        <li
                          key={`${file.name}-${file.size}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-md border p-2 text-sm"
                        >
                          <span className="truncate">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Remove ${file.name}`}
                            onClick={() => removeSupportingDocument(index)}
                          >
                            <X className="size-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {supportingDocumentsError && (
                    <p className="text-sm text-destructive">
                      {supportingDocumentsError}
                    </p>
                  )}
                </Field>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={instructorApplicationPending}
                >
                  {instructorApplicationPending
                    ? 'Submitting application...'
                    : 'Submit instructor application'}
                </Button>
              </FieldGroup>
            </form>
          </section>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
