'use client';

import { Camera, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUpdateMePhoto } from '@/hooks/auth.hook';
import { getApiErrorMessage } from '@/lib/api-error';
import type { User } from '@/types/auth.type';

type AdminProfilePhotoProps = {
  user: User;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export function AdminProfilePhoto({ user }: AdminProfilePhotoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const updatePhoto = useUpdateMePhoto();

  const fullName = `${user.firstName} ${user.lastName}`;

  const initials =
    `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('Please select a JPEG, JPG, PNG, or WebP image.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Profile photo must be smaller than 2 MB.');
      event.target.value = '';
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    setPreviewUrl(objectUrl);

    updatePhoto.mutate(file, {
      onSuccess: () => {
        toast.success(
          user.profileImageUrl
            ? 'Profile photo updated successfully.'
            : 'Profile photo added successfully.',
        );

        URL.revokeObjectURL(objectUrl);
        setPreviewUrl(null);
        event.target.value = '';
      },

      onError: error => {
        URL.revokeObjectURL(objectUrl);
        setPreviewUrl(null);
        event.target.value = '';

        toast.error(getApiErrorMessage(error));
      },
    });
  };

  const handleButtonClick = () => {
    if (updatePhoto.isPending) return;

    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <div className="relative">
        <Avatar className="size-20 sm:size-24">
          <AvatarImage
            src={previewUrl ?? user.profileImageUrl ?? undefined}
            alt={fullName}
          />

          <AvatarFallback className="text-lg sm:text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Camera / EditButton */}
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={updatePhoto.isPending}
          aria-label={
            user.profileImageUrl ? 'Edit profile photo' : 'Add profile photo'
          }
          className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {updatePhoto.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Camera className="size-4" />
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="space-y-1 text-center sm:text-left">
        <p className="text-sm font-medium">
          {user.profileImageUrl ? 'Profile photo' : 'Add a profile photo'}
        </p>

        <p className="text-xs text-muted-foreground">
          JPEG, JPG, PNG or WebP · Max 2 MB
        </p>

        {/* Add / ChangePhotoButton */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleButtonClick}
          disabled={updatePhoto.isPending}
        >
          {updatePhoto.isPending
            ? 'Uploading...'
            : user.profileImageUrl
              ? 'Change Photo'
              : 'Add Photo'}
        </Button>
      </div>
    </div>
  );
}
