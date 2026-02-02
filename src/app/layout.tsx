import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'The Turing Club | Recruitment Hub',
  description: 'Join the next generation of innovators at The Turing Club.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="/logo.png" />
      </head>
      <body className="font-sans antialiased bg-[#f8fafc] text-slate-900 selection:bg-primary/10 selection:text-primary min-h-screen">
        <FirebaseClientProvider>
          <div className="relative flex flex-col min-h-screen font-sans">
            <main className="flex-1">
              {children}
            </main>

            {/* Global Background Accents - Light Version */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
          </div>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
