'use client';

import React from 'react';
import type { Application } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

function SkillPill({ label, value }: {label: string, value: string}) {
    let colorClass = 'bg-secondary text-secondary-foreground';
    if (value === 'Expert') colorClass = 'bg-green-500/20 text-green-300 border-green-500/30';
    if (value === 'Comfortable') colorClass = 'bg-sky-500/20 text-sky-300 border-sky-500/30';
    
    return <Badge variant="outline" className={`capitalize ${colorClass}`}>{label}</Badge>
}

export function ApplicationCard({ application: app }: { application: Application }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{app.fullName}</CardTitle>
                <CardDescription>{app.usn} &bull; {app.department} &bull; {app.year}</CardDescription>
            </div>
            {app.rankingScore !== undefined && (
                <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{app.rankingScore}</p>
                    <p className="text-xs text-muted-foreground -mt-1">AI Score</p>
                </div>
            )}
        </div>
        <div className="pt-2">
            <Badge variant="secondary">{app.experienceLevel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
          <Separator className="mb-4" />
          <div className="flex flex-col gap-4 flex-grow">
            <div>
              <p className="text-sm font-medium mb-2">Preferred Roles</p>
              <div className="flex flex-wrap gap-2">
                {app.roles?.map(r => <Badge key={r} variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-500/30">{r}</Badge>)}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(app.skills || {}).filter(([_,v]) => v !== 'None').map(([k,v]) => (
                  <SkillPill key={k} label={k} value={v}/>
                ))}
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {app.reasoning && (
                <AccordionItem value="reasoning">
                    <AccordionTrigger className="text-sm">AI Ranking Analysis</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground whitespace-pre-wrap">{app.reasoning}</AccordionContent>
                </AccordionItem>
              )}
              <AccordionItem value="projects">
                <AccordionTrigger className="text-sm">Projects</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">{app.projects}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="question">
                <AccordionTrigger className="text-sm">Conceptual Check</AccordionTrigger>
                <AccordionContent>
                    <p className="font-semibold text-foreground mb-2">
                        {
                            {
                                'a': 'Q: What is overfitting and how do you fight it?',
                                'b': 'Q: Difference between Transformers and RNNs?',
                                'c': 'Q: Why do we need Batch Normalization?'
                            }[app.techQuestionChoice]
                        }
                    </p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{app.techQuestionAnswer}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="motivation">
                <AccordionTrigger className="text-sm">Motivation</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground whitespace-pre-wrap">{app.motivation}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
      </CardContent>
    </Card>
  );
}
