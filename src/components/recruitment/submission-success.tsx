'use client';

import { ApplicationCard } from './application-card';
import { CheckCircle } from 'lucide-react';
import type { Application, ApplicationData } from '@/lib/types';

export function SubmissionSuccess({ submittedData }: { submittedData: ApplicationData | null }) {
  if (!submittedData) {
    // Fallback for any edge case where data isn't passed.
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
        </div>
      </div>
    );
  }

  // Create a temporary application object for preview on the card.
  // The card component is designed to handle potentially missing fields gracefully.
  const applicationForCard: Application = {
    ...submittedData,
    id: 'preview', // A temporary ID for preview purposes
    status: 'pending',
    // A mock timestamp; the actual timestamp is handled by the server.
    // The card does not display this, so it's safe.
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="bg-card border rounded-2xl p-8 text-center shadow-xl mb-12">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Application Received!</h2>
        <p className="text-muted-foreground">
          Thank you for applying. Below is a summary of your submission. We will be in touch soon.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-center mb-6 text-foreground">Your Submitted Application</h3>
      
      <div className="max-w-xl mx-auto">
        <ApplicationCard application={applicationForCard} />
      </div>

      <footer className="text-center text-muted-foreground text-sm py-8 mt-8">
        &copy; 2025 Turing Club. Securely powered by Firebase.
      </footer>
    </div>
  );
}
