'use client';

import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Award, Terminal, Brain, Palette, ClipboardCheck, Megaphone, Contact, Link2, Info, Sparkles, Code } from 'lucide-react';
import type { ApplicationSchema } from '@/lib/schema';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const beginnerTechQuestions = {
  a: "Implement a Breadth-First Search (BFS) or Depth-First Search (DFS) algorithm to find a path in a given maze.",
  b: "Build a simple command-line tool that fetches data from a public API and displays it formatted.",
  c: "Write a script to scrape the headlines from a news website and save them to a CSV file."
};

const intermediateTechQuestions = {
  a: "Develop a simple REST API (Flask/Express) that serves predictions from a pre-trained ML model.",
  b: "Build and containerize a simple data processing pipeline using Docker with CSV transformations.",
  c: "Create a basic chatbot using rule-based logic or a simple NLP library for a specific knowledge base."
};

const advancedTechQuestions = {
  a: "Implement a Q-Learning agent from scratch or optimize a pre-trained model for a specific edge case.",
  b: "Set up a basic distributed task queue that can handle a mock AI workload.",
  c: "Build a retrieval-augmented generation (RAG) pipeline that uses a vector database or knowledge graph."
};

const designQuestions = {
  a: "Describe your design process for a recent project.",
  b: "Pick a popular app. What is one UI/UX improvement you would make and why?",
  c: "How would you design a poster for an AI workshop?"
};

const operationsQuestions = {
  a: "Describe how you would plan and execute a 100-person workshop, from budget to feedback.",
  b: "A key speaker for an event cancels last minute. What's your immediate action plan?",
  c: "What tools would you use to keep track of tasks and timelines for a team project?"
};

const publicRelationsQuestions = {
  a: "How would you handle negative feedback about the club on social media?",
  b: "Draft a short press release for an upcoming club event.",
  c: "What strategies would you use to increase the club's visibility on campus?"
};

const outreachQuestions = {
  a: "How would you build and maintain relationships with other tech clubs or organizations?",
  b: "Draft an outreach email to a potential sponsor for a hackathon.",
  c: "What metrics would you track to measure the success of an outreach campaign?"
};

const TECHNICAL_ROLES = ["Tech"];
const DESIGN_ROLES = ["Design"];
const OPERATIONS_ROLES = ["Operations"];
const PUBLIC_RELATIONS_ROLES = ["Public Relations"];
const OUTREACH_ROLES = ["Outreach"];

export function Step3Experience() {
  const { control, watch, setValue } = useFormContext<ApplicationSchema>();
  const experienceLevel = watch('experienceLevel');
  const selectedRoles = watch('roles', []);

  useEffect(() => {
    setValue('techQuestionChoice', 'a');
  }, [experienceLevel, setValue]);

  const getTechQuestions = (level: string | undefined) => {
    switch (level) {
      case 'Beginner': return beginnerTechQuestions;
      case 'Intermediate': return intermediateTechQuestions;
      case 'Advanced':
      case 'Research/Expert': return advancedTechQuestions;
      default: return null;
    }
  }

  const techQuestions = getTechQuestions(experienceLevel);
  const showTechChallenge = selectedRoles.some(role => TECHNICAL_ROLES.includes(role));
  const showDesignChallenge = selectedRoles.some(role => DESIGN_ROLES.includes(role));
  const showOperationsChallenge = selectedRoles.some(role => OPERATIONS_ROLES.includes(role));
  const showPublicRelationsChallenge = selectedRoles.some(role => PUBLIC_RELATIONS_ROLES.includes(role));
  const showOutreachChallenge = selectedRoles.some(role => OUTREACH_ROLES.includes(role));

  return (
    <div className="space-y-12 animate-fade-in text-white">
      {/* Experience Level */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Award className="text-primary" size={20} />
          <h3 className="text-xl font-semibold text-white/90">Experience Level</h3>
        </div>
        <FormField
          control={control}
          name="experienceLevel"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-14 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all">
                    <SelectValue placeholder="Select a level..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-zinc-900 border-white/10">
                  <SelectItem value="Beginner" className="focus:bg-primary/20">Beginner (Intro course completed)</SelectItem>
                  <SelectItem value="Intermediate" className="focus:bg-primary/20">Intermediate (Built 2-5 personal projects)</SelectItem>
                  <SelectItem value="Advanced" className="focus:bg-primary/20">Advanced (End-to-end projects)</SelectItem>
                  <SelectItem value="Research/Expert" className="focus:bg-primary/20">Research/Expert (Publications/SOTA)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-xs font-medium text-destructive/90" />
            </FormItem>
          )}
        />
      </div>

      {/* Portfolio */}
      <div className="space-y-6 border-t border-white/5 pt-12">
        <div className="flex items-center gap-3">
          <Terminal className="text-primary" size={20} />
          <h3 className="text-xl font-semibold text-white/90">Project Portfolio</h3>
        </div>
        <FormField
          control={control}
          name="projects"
          render={({ field }) => (
            <FormItem>
              <FormDescription className="text-white/40 mb-3">
                Paste GitHub/Kaggle links. Briefly describe your tech stack and role.
              </FormDescription>
              <FormControl>
                <Textarea
                  rows={4}
                  className="bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all font-mono text-sm leading-relaxed"
                  placeholder="e.g., I built a real-time face mask detector using OpenCV and PyTorch..."
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs font-medium text-destructive/90" />
            </FormItem>
          )}
        />
      </div>

      {/* Challenges Section */}
      {(showTechChallenge || showDesignChallenge || showOperationsChallenge || showPublicRelationsChallenge || showOutreachChallenge) && (
        <div className="space-y-12 border-t border-white/5 pt-12">
          <div className="flex items-center gap-3">
            <Brain className="text-primary" size={20} />
            <h3 className="text-xl font-semibold text-white/90">Role-Specific Challenges</h3>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {/* Tech Challenge */}
            {showTechChallenge && (
              <div className="space-y-6 animate-fade-in p-6 rounded-3xl bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-3">
                  <Code className="text-primary" size={18} />
                  <span className="font-bold text-sm tracking-widest uppercase text-primary/80">Coding Task</span>
                </div>
                {!techQuestions ? (
                  <div className="flex items-center gap-2 text-sm text-white/40 italic p-4 bg-black/20 rounded-xl">
                    <Info size={14} /> Please select your experience level above.
                  </div>
                ) : (
                  <div className="space-y-6">
                    <FormField
                      control={control}
                      name="techQuestionChoice"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-1 gap-3">
                            {Object.entries(techQuestions).map(([key, value]) => (
                              <div key={key} className={cn(
                                "relative flex items-center p-4 rounded-xl border transition-all cursor-pointer",
                                field.value === key ? "bg-white/10 border-white/20" : "bg-white/5 border-transparent hover:border-white/10"
                              )} onClick={() => field.onChange(key)}>
                                <FormControl><RadioGroupItem value={key} className="mr-3" /></FormControl>
                                <span className="text-sm font-medium leading-relaxed">{value}</span>
                              </div>
                            ))}
                          </RadioGroup>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="techQuestionAnswer"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">Git Repository Link</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                              <Input
                                placeholder="https://github.com/..."
                                className="h-12 pl-11 bg-black/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs font-medium text-destructive/90" />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Design Challenge */}
            {showDesignChallenge && (
              <div className="space-y-6 animate-fade-in p-6 rounded-3xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <Palette className="text-primary" size={18} />
                  <span className="font-bold text-sm tracking-widest uppercase text-white/40">Design Task</span>
                </div>
                <FormField
                  control={control}
                  name="designQuestionChoice"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-1 gap-3">
                        {Object.entries(designQuestions).map(([key, value]) => (
                          <div key={key} className={cn(
                            "relative flex items-center p-4 rounded-xl border transition-all cursor-pointer",
                            field.value === key ? "bg-white/10 border-white/20" : "bg-white/5 border-transparent hover:border-white/10"
                          )} onClick={() => field.onChange(key)}>
                            <FormControl><RadioGroupItem value={key} className="mr-3" /></FormControl>
                            <span className="text-sm font-medium">{value}</span>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="designQuestionAnswer"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          rows={3}
                          className="bg-black/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                          placeholder="Write your response here..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Other Challenges (Simplified) */}
            {[
              { id: 'operations', icon: ClipboardCheck, questions: operationsQuestions, show: showOperationsChallenge, label: 'Operations Task' },
              { id: 'publicRelations', icon: Megaphone, questions: publicRelationsQuestions, show: showPublicRelationsChallenge, label: 'PR Task' },
              { id: 'outreach', icon: Contact, questions: outreachQuestions, show: showOutreachChallenge, label: 'Outreach Task' }
            ].map(challenge => challenge.show && (
              <div key={challenge.id} className="space-y-6 animate-fade-in p-6 rounded-3xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <challenge.icon className="text-primary" size={18} />
                  <span className="font-bold text-sm tracking-widest uppercase text-white/40">{challenge.label}</span>
                </div>
                <FormField
                  control={control}
                  name={`${challenge.id}QuestionChoice` as any}
                  render={({ field }) => (
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-1 gap-3">
                      {Object.entries(challenge.questions).map(([key, value]) => (
                        <div key={key} className={cn(
                          "relative flex items-center p-4 rounded-xl border transition-all cursor-pointer",
                          field.value === key ? "bg-white/10 border-white/20" : "bg-white/5 border-transparent hover:border-white/10"
                        )} onClick={() => field.onChange(key)}>
                          <FormControl><RadioGroupItem value={key} className="mr-3" /></FormControl>
                          <span className="text-sm font-medium">{value}</span>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
                <FormField
                  control={control}
                  name={`${challenge.id}QuestionAnswer` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          rows={3}
                          className="bg-black/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                          placeholder="Write your response here..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivation */}
      <div className="space-y-6 border-t border-white/5 pt-12">
        <div className="flex items-center gap-3">
          <Sparkles className="text-primary" size={20} />
          <h3 className="text-xl font-semibold text-white/90">Why join us?</h3>
        </div>
        <FormField
          control={control}
          name="motivation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  rows={3}
                  className="bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all"
                  placeholder="Tell us what excites you about the Turing Club..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
