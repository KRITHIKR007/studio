'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export function SubmissionSuccess({ onReset }: { onReset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border rounded-2xl p-8 text-center shadow-2xl animate-fade-in">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Application Saved</h2>
        <p className="text-muted-foreground mb-8">
          Your profile has been securely stored. We will review your application and get back to you soon.
        </p>
        <Button variant="link" onClick={onReset}>
          Submit another
        </Button>
      </div>
    </div>
  );
}
