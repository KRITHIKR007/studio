import { RecruitmentPortalClient } from '@/components/recruitment/recruitment-portal-client';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <Suspense 
        fallback={
          <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <RecruitmentPortalClient />
      </Suspense>
    </main>
  );
}
