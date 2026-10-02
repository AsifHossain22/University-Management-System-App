import { LoaderIcon } from 'lucide-react';

export default function AuthLoading({
  label = 'Verifying account',
}: {
  label?: string;
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex items-center gap-3">
        <LoaderIcon className="size-6 animate-spin" />
        <span>{label}</span>
      </div>
    </div>
  );
}
