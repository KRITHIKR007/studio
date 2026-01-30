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
  if (!answer || !choice || answer.trim() === '') {
    return null;
  }
  return (
    <AccordionItem value={title.toLowerCase().replace(/\s/g, '-')}>
      <AccordionTrigger className="text-sm">{title}</AccordionTrigger>
      <AccordionContent>
        <p className="font-semibold text-foreground mb-2">
          Q: {questions[choice]}
        </p>
        {isLink ? (
          <a href={answer} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">
            {answer}
          </a>
        ) : (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {answer}
          </p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};


export function ApplicationCard({ application: app }: { application: Application }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{app.fullName}</CardTitle>
                <CardDescription>{app.usn} &bull; {app.department} &bull; {app.year}</CardDescription>
            </div>
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
              {app.projects && app.projects.trim() !== '' && (
                <AccordionItem value="projects">
                  <AccordionTrigger className="text-sm">Projects</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">{app.projects}</AccordionContent>
                </AccordionItem>
              )}
              
              <ConceptualCheck
                title="Take-Home Coding Challenge (Tech)"
                choice={app.techQuestionChoice}
                answer={app.techQuestionAnswer}
                isLink={true}
                questions={{
                  'a': "Implement a Q-Learning agent from scratch to solve a simple environment, or optimize a pre-trained model for a specific edge case.",
                  'b': "Set up a basic distributed task queue or a containerized environment that can handle a mock AI workload.",
                  'c': "Build a retrieval-augmented generation (RAG) pipeline that uses a Knowledge Graph to answer complex queries."
                }}
              />
              
              <ConceptualCheck
                title="Design Challenge"
                choice={app.designQuestionChoice}
                answer={app.designQuestionAnswer}
                questions={{
                  'a': 'Describe your design process for a recent project.',
                  'b': 'Pick a popular app. What is one UI/UX improvement you would make and why?',
                  'c': 'How would you design a poster for an AI workshop?'
                }}
              />
              
              <ConceptualCheck
                title="Operations Challenge"
                choice={app.operationsQuestionChoice}
                answer={app.operationsQuestionAnswer}
                questions={{
                  'a': "Describe how you would plan and execute a 100-person workshop, from budget to feedback collection.",
                  'b': "A key speaker for an event cancels last minute. What's your immediate action plan?",
                  'c': "What tools would you use to keep track of tasks, timelines, and responsibilities for a team project?"
                }}
              />

              <ConceptualCheck
                title="Public Relations Challenge"
                choice={app.publicRelationsQuestionChoice}
                answer={app.publicRelationsQuestionAnswer}
                questions={{
                    'a': "How would you handle negative feedback about the club on social media?",
                    'b': "Draft a short press release for an upcoming club event.",
                    'c': "What strategies would you use to increase the club's visibility on campus?"
                }}
              />

              <ConceptualCheck
                title="Outreach Challenge"
                choice={app.outreachQuestionChoice}
                answer={app.outreachQuestionAnswer}
                questions={{
                  'a': "How would you build and maintain relationships with other tech clubs or organizations?",
                  'b': "Draft an outreach email to a potential sponsor for a hackathon.",
                  'c': "What metrics would you track to measure the success of an outreach campaign?"
                }}
              />
              
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
