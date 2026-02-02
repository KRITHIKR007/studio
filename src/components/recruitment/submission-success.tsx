'use client';

import { ApplicationCard } from './application-card';
import { CheckCircle2, PartyPopper, ArrowRight } from 'lucide-react';
import type { Application, ApplicationData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Navbar } from './navbar';

export function SubmissionSuccess({ submittedData }: { submittedData: ApplicationData | null }) {
  if (!submittedData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <Navbar onAdminClick={() => { }} onLogoClick={() => window.location.reload()} />
        <div className="max-w-md w-full glass p-12 text-center rounded-[3rem] animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Application Saved</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">
            Your profile has been securely stored. We will review your application and get back to you soon.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full h-12 rounded-xl primary-gradient text-white font-bold">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const applicationForCard: Application = {
    ...submittedData,
    id: 'preview',
    status: 'pending',
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
  } as any;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar onAdminClick={() => { }} onLogoClick={() => window.location.reload()} />

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24 animate-in slide-in-from-bottom-10 duration-700">
        <div className="bg-white border border-slate-100 rounded-[3.5rem] p-12 md:p-20 text-center shadow-2xl shadow-slate-200/50 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-32 -mt-32" />

          <div className="relative z-10">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-10 transition-transform hover:scale-110 duration-500">
              <PartyPopper size={48} className="text-green-500" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Transmission Received</h2>
            <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
              Thank you for applying. Your application has been successfully recorded in the 2025 cohort database.
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <div className="flex items-center justify-between px-6">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Application Summary</h3>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold tracking-widest uppercase">
              Reference ID: PRV-{Math.floor(Math.random() * 9000) + 1000}
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <ApplicationCard application={applicationForCard} />
          </div>
        </div>

        <div className="mt-20 text-center space-y-8">
          <p className="text-slate-400 font-medium">Want to learn more about the next steps?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={() => window.location.reload()} variant="outline" className="h-14 px-8 rounded-2xl border-slate-200 font-bold text-slate-600 hover:bg-white">
              Exit Portal
            </Button>
            <Button asChild className="h-14 px-8 rounded-2xl primary-gradient font-bold text-white shadow-lg shadow-primary/20">
              <a href="https://turingclub.org" target="_blank">
                Visit Official Website <ArrowRight size={18} className="ml-2" />
              </a>
            </Button>
          </div>
        </div>

        <footer className="text-center text-slate-400 text-xs font-bold tracking-[0.2em] uppercase py-12 mt-20 border-t border-slate-100">
          &copy; 2025 The Turing Club Systems | Engineering the Unknown
        </footer>
      </div>
    </div>
  );
}
