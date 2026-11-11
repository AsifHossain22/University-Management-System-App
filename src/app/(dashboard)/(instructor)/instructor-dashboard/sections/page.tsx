'use client';

import { useMemo, useState } from 'react';
import { BookOpen, GraduationCap, Search, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useSections } from '@/hooks/section.hook';
import { useRegisteredStudentsBySection } from '@/hooks/course-registration.hook';
import type { Section } from '@/types/section.type';
import type { RegisteredStudent } from '@/api/course-registration.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function SectionCard({
  section,
  studentCount,
  isSelected,
  onSelect,
}: {
  section: Section;
  studentCount?: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Card
      className={`transition-colors ${
        isSelected ? 'border-primary ring-1 ring-primary' : ''
      }`}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-lg">{section.course.code}</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              {section.course.name}
            </p>
          </div>

          <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs font-medium">
            {section.code}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Separator />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Section</p>
            <p className="mt-1 font-medium">{section.name}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Credits</p>
            <p className="mt-1 font-medium">{section.course.credits}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Semester</p>
            <p className="mt-1 font-medium">{section.semester.name}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Capacity</p>
            <p className="mt-1 font-medium">{section.capacity}</p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="size-4" />
            <span>
              {studentCount === undefined
                ? 'Students'
                : `${studentCount} registered`}
            </span>
          </div>

          <Button
            size="sm"
            variant={isSelected ? 'default' : 'outline'}
            onClick={onSelect}
          >
            {isSelected ? 'Selected' : 'View Students'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionRoster({ section }: { section: Section }) {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError, error, refetch } =
    useRegisteredStudentsBySection(section.id);

  const students = data?.data ?? [];

  const filteredStudents = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return students;

    return students.filter(student => {
      const fullName = `${student.student.user.firstName} ${student.student.user.lastName}`;

      return (
        fullName.toLowerCase().includes(search) ||
        student.student.studentId.toLowerCase().includes(search) ||
        student.student.user.email.toLowerCase().includes(search) ||
        student.student.studentEmail.toLowerCase().includes(search)
      );
    });
  }, [students, searchTerm]);

  if (isError) {
    return (
      <Card>
        <CardContent className="space-y-3 py-8 text-center">
          <p className="text-destructive">
            Failed to load registered students.
          </p>

          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Registered Students</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              {section.course.code} · {section.code} · {section.semester.name}
            </p>
          </div>

          {!isLoading && (
            <span className="w-fit rounded-md bg-muted px-3 py-1 text-sm font-medium">
              {students.length} Students
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            placeholder="Search by student name, ID or email..."
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="rounded-lg border border-dashed py-10 text-center">
            <Users className="mx-auto size-8 text-muted-foreground" />

            <p className="mt-3 font-medium">
              {students.length === 0
                ? 'No registered students yet'
                : 'No students found'}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {students.length === 0
                ? 'Students registered in this section will appear here.'
                : 'Try another search term.'}
            </p>
          </div>
        ) : (
          <div className="divide-y rounded-lg border">
            {filteredStudents.map(student => (
              <StudentRow key={student.id} student={student} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StudentRow({ student }: { student: RegisteredStudent }) {
  const firstName = student.student.user.firstName;
  const lastName = student.student.user.lastName;

  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar>
          <AvatarFallback>{getInitials(firstName, lastName)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="truncate font-medium">
            {firstName} {lastName}
          </p>

          <p className="truncate text-sm text-muted-foreground">
            {student.student.studentId}
          </p>
        </div>
      </div>

      <div className="min-w-0 sm:text-right">
        <p className="break-all text-sm text-muted-foreground">
          {student.student.user.email}
        </p>

        <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
          {student.status}
        </span>
      </div>
    </div>
  );
}

export default function InstructorSectionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');

  const { data, isLoading, isError, refetch } = useSections({
    page: 1,
    limit: 100,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const sections = data?.data?.data ?? [];

  const filteredSections = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return sections;

    return sections.filter(section => {
      return (
        section.name.toLowerCase().includes(search) ||
        section.code.toLowerCase().includes(search) ||
        section.course.name.toLowerCase().includes(search) ||
        section.course.code.toLowerCase().includes(search) ||
        section.semester.name.toLowerCase().includes(search)
      );
    });
  }, [sections, searchTerm]);

  const selectedSection = sections.find(
    section => section.id === selectedSectionId,
  );

  const handleSelectSection = (section: Section) => {
    setSelectedSectionId(section.id);
  };

  if (isError) {
    return (
      <main className="space-y-4 p-6">
        <h1 className="text-2xl font-bold">My Sections</h1>

        <p className="text-destructive">
          Failed to load your assigned sections.
        </p>

        <Button variant="outline" onClick={() => refetch()}>
          Try Again
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6">
      <div>
        <div className="flex items-center gap-2 text-primary">
          <GraduationCap className="size-5" />
          <span className="text-sm font-medium">Instructor Workspace</span>
        </div>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">My Sections</h1>

        <p className="mt-2 text-muted-foreground">
          View your assigned courses and manage their registered student
          rosters.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <BookOpen className="size-6" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Assigned Sections</p>

              <p className="text-2xl font-bold">
                {isLoading ? '...' : sections.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <Users className="size-6" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Available Rosters</p>

              <p className="text-2xl font-bold">
                {isLoading ? '...' : sections.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Assigned Courses</h2>

            <p className="text-sm text-muted-foreground">
              Select a section to view its registered students.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder="Search sections..."
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full" />
            ))}
          </div>
        ) : filteredSections.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="mx-auto size-10 text-muted-foreground" />

              <h3 className="mt-4 font-semibold">
                {sections.length === 0
                  ? 'No assigned sections'
                  : 'No matching sections'}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                {sections.length === 0
                  ? 'Your assigned teaching sections will appear here.'
                  : 'Try searching with a different course or section name.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredSections.map(section => (
              <SectionCard
                key={section.id}
                section={section}
                isSelected={selectedSectionId === section.id}
                onSelect={() => handleSelectSection(section)}
              />
            ))}
          </div>
        )}
      </section>

      {selectedSection && (
        <section className="space-y-4" id="section-roster">
          <Separator />

          <div>
            <h2 className="text-xl font-semibold">Section Roster</h2>

            <p className="text-sm text-muted-foreground">
              Students registered in {selectedSection.course.name} (
              {selectedSection.code}).
            </p>
          </div>

          <SectionRoster key={selectedSection.id} section={selectedSection} />
        </section>
      )}
    </main>
  );
}
