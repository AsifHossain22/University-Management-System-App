import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import '@/app/globals.css';
import QueryProvider from '@/providers/query.provider';
import { AuthProvider } from '@/providers/auth.provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'University Management System',
    template: '%s | University Management System',
  },
  description:
    'A modern university management system for students, instructors and administrators.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <TooltipProvider>
          <ThemeProvider>
            <QueryProvider>
              <AuthProvider>{children}</AuthProvider>
            </QueryProvider>
          </ThemeProvider>
        </TooltipProvider>

        <Toaster />
      </body>
    </html>
  );
}
