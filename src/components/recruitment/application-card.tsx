'use client';

import React from 'react';
import type { Application } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Hash, BookOpen, Calendar, Star, Github, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

function SkillPill({ label, value }: { label: string, value: string }) {
  let colorClass = 'bg-slate-100 text-slate-600 border-slate-200';
  if (value === 'Expert') colorClass = 'bg-primary/10 text-primary border-primary/20';
  if (value === 'Comfortable') colorClass = 'bg-blue-500/10 text-blue-500 border-blue-500/20';

  return <Badge variant="outline" className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider", colorClass)}>{label}: {value}</Badge>
}

const ConceptualCheck = ({
  title,
  choice,
  answer,
  questions,
  isLink = false,
}: {
  title: string;
  choice?: string;
  answer?: string;
  questions: Record<string, string>;
  isLink?: boolean;
}) => {
  if (!answer || !choice) {
    return null;
  }
  return (
    <AccordionItem value={title.toLowerCase().replace(/\s/g, '-')} className="border-slate-100">
      <AccordionTrigger className="text-sm font-bold text-slate-700 hover:text-primary transition-colors">
        {title}
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-2">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 italic text-slate-500 text-xs font-medium leading-relaxed">
          Q: {questions[choice] || 'Question definition missing'}
        </div>
        <div className="px-1 text-sm text-slate-600 leading-loose whitespace-pre-wrap">
          {isLink ? (
            <a href={answer} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline font-mono">
              <Github size={14} /> {answer} <ExternalLink size={12} />
            </a>
          ) : (
            answer
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

// Simplified questions for summary view
const summaryQuestions = {
  'Tech': {
    a: "Technical Challenge & Resolution",
    b: "Explaining Technology Simplicity"
  },
  'Design': {
    a: "Product Design Analysis",
    b: "Creative Process Walkthrough"
  }
};

export function ApplicationCard({ application: app }: { application: Application }) {
  return (
    <Card className="rounded-[2.5rem] border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden bg-white">
      <CardHeader className="p-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-400 tracking-widest uppercase">
              Status: {app.status}
            </div>
            <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">{app.fullName}</CardTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Hash size={16} className="text-primary" /> {app.usn}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Calendar size={16} className="text-primary" /> {app.year}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <BookOpen size={16} className="text-primary" /> {app.department}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Mail size={16} className="text-primary" /> {app.email}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="flex flex-col items-center p-6 rounded-3xl bg-primary/5 border border-primary/10">
              <Star size={32} className="text-primary mb-2 fill-primary/10" />
              <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">{app.experienceLevel}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        <Separator className="bg-slate-100" />

        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Sector Specializations</p>
            <div className="flex flex-wrap gap-2">
              {app.roles?.map(r => (
                <Badge key={r} variant="outline" className="px-4 py-1.5 rounded-xl bg-slate-50 text-slate-600 border-slate-100 font-bold hover:border-primary/20 transition-colors">
                  {r}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Skillset Inventory</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(app.skills || {}).filter(([_, v]) => v !== 'None').map(([k, v]) => (
                <SkillPill key={k} label={k} value={v as string} />
              ))}
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {app.projects && app.projects.trim() !== '' && (
              <AccordionItem value="projects" className="border-slate-100">
                <AccordionTrigger className="text-sm font-bold text-slate-700 hover:text-primary transition-colors">Strategic Portfolio</AccordionTrigger>
                <AccordionContent className="text-sm text-slate-500 leading-loose whitespace-pre-wrap font-mono bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-2">
                  {app.projects}
                </AccordionContent>
              </AccordionItem>
            )}

            <ConceptualCheck
              title="Engineering Challenge (Tech)"
              choice={app.techQuestionChoice}
              answer={app.techQuestionAnswer}
              isLink={true}
              questions={summaryQuestions['Tech'] as any}
            />

            <ConceptualCheck
              title="Creative Challenge (Design)"
              choice={app.designQuestionChoice}
              answer={app.designQuestionAnswer}
              questions={summaryQuestions['Design'] as any}
            />

            <AccordionItem value="motivation" className="border-none">
              <AccordionTrigger className="text-sm font-bold text-slate-700 hover:text-primary transition-colors">Personal Manifesto</AccordionTrigger>
              <AccordionContent className="text-sm text-slate-500 leading-loose whitespace-pre-wrap pt-2 px-1">
                {app.motivation}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
