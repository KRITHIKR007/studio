'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Award, Terminal, Brain, Palette, ClipboardCheck, Megaphone, Contact, Link2, Info, Sparkles, Code, CheckCircle2, Star } from 'lucide-react';
import type { ApplicationSchema } from '@/lib/schema';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const EXPERIENCE_LEVELS = [
  { id: 'Beginner', label: 'Novice', desc: 'Focusing on core concepts and basic implementations.', icon: Brain },
  { id: 'Intermediate', label: 'Practitioner', desc: 'Active developer with several deployed projects.', icon: Terminal },
  { id: 'Advanced', label: 'Specialist', desc: 'Deep technical expertise and systems design.', icon: Award }
];

const beginnerTechQuestions = {
  a: "Describe the biggest technical challenge you've faced so far. How did you break down the problem and what was the resolution?",
  b: "Explain a concept you recently learned in technology. How would you explain it to a non-technical person?",
};

const intermediateTechQuestions = {
  a: "Explain the architecture of a complex project you've built. What were the key design decisions and trade-offs made?",
  b: "How do you approach learning a new technology or framework? Provide specific examples from your experience.",
};

const beginnerDesignQuestions = {
  a: "Select a product (digital or physical) with excellent design. Analyze what makes it effective and what you would improve.",
  b: "Walk us through your creative process. How do you go from a blank canvas to a finished design?",
};

const advancedDesignQuestions = {
  a: "Redesign a common UI element (e.g., a date picker). Explain your reasoning for the changes and the user problems you solved.",
  b: "How do you balance aesthetic appeal with functional usability and accessibility in your designs?",
};

export function Step3Experience() {
  const { control, watch } = useFormContext<ApplicationSchema>();
  const experienceLevel = watch('experienceLevel');
  const selectedRoles = watch('roles', []);

  // Helper to get questions based on experience and role
  const getQuestions = (role: string) => {
    if (role === 'Tech') {
      return experienceLevel === 'Beginner' ? beginnerTechQuestions : intermediateTechQuestions;
    }
    if (role === 'Design') {
      return experienceLevel === 'Beginner' ? beginnerDesignQuestions : advancedDesignQuestions;
    }
    // For other roles, provide standard high-quality questions
    return {
      a: `What is a project or initiative you've led or been a part of in the ${role} domain? What was the outcome?`,
      b: `How would you handle a situation where a major project deadline is approaching and the team is behind schedule?`,
    };
  };

  const getRoleIcon = (role: string) => {
    return {
      'Tech': Code,
      'Design': Palette,
      'Operations': ClipboardCheck,
      'Public Relations': Megaphone,
      'Outreach': Contact
    }[role] || Info;
  };

  const toCamelCase = (str: string) => {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  };

  return (
    <div className="space-y-20 animate-fade-in">
      {/* Experience Level Selection */}
      <div className="space-y-10">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Star size={24} className="fill-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-900">Experience Archetype</h3>
            <p className="text-slate-500 font-medium">Define your current technical or creative standing.</p>
          </div>
        </div>

        <FormField
          control={control}
          name="experienceLevel"
          render={({ field }) => (
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {EXPERIENCE_LEVELS.map((level) => {
                const isActive = field.value === level.id;
                return (
                  <FormItem key={level.id} className="space-y-0">
                    <FormControl>
                      <RadioGroupItem value={level.id} className="sr-only" />
                    </FormControl>
                    <FormLabel
                      className={cn(
                        "flex flex-col items-start p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-500 h-full relative overflow-hidden group",
                        isActive
                          ? "bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.05]"
                          : "bg-white border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-500",
                        isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-500 group-hover:text-primary group-hover:bg-primary/10"
                      )}>
                        <level.icon size={24} />
                      </div>
                      <div className="space-y-2 relative z-10">
                        <span className={cn("text-xl font-black block tracking-tight transition-colors", isActive ? "text-white" : "text-slate-900")}>
                          {level.label}
                        </span>
                        <p className={cn("text-xs leading-relaxed font-medium transition-colors", isActive ? "text-slate-400" : "text-slate-500")}>
                          {level.desc}
                        </p>
                      </div>

                      {isActive && (
                        <div className="absolute right-6 top-6 animate-in zoom-in spin-in-90 duration-500">
                          <CheckCircle2 size={24} className="text-primary" />
                        </div>
                      )}

                      <level.icon className={cn(
                        "absolute -bottom-8 -right-8 w-32 h-32 opacity-[0.03] transition-transform duration-1000",
                        isActive ? "scale-150 rotate-12 opacity-[0.07]" : "scale-100"
                      )} />
                    </FormLabel>
                  </FormItem>
                );
              })}
            </RadioGroup>
          )}
        />
      </div>

      {/* Portfolio Section */}
      <div className="space-y-10 group/section">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6 group-hover/section:border-primary/20 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover/section:bg-primary/10 group-hover/section:text-primary transition-all duration-500">
            <Link2 size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-900">Strategic Portfolio</h3>
            <p className="text-slate-500 font-medium">Documentation of past projects and implementations.</p>
          </div>
        </div>

        <FormField
          control={control}
          name="projects"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-sm font-bold text-slate-700">Project Links & Descriptions</FormLabel>
              <FormControl>
                <div className="relative group">
                  <Textarea
                    placeholder="Provide links to your GitHub, Portfolio, or specific project documentations. Structure them with brief explanations."
                    className="min-h-[220px] bg-white border-2 border-slate-100 rounded-[2rem] p-8 text-slate-700 leading-loose focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-mono"
                    {...field}
                  />
                  <div className="absolute bottom-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 text-[10px] font-black text-slate-400 tracking-widest uppercase border border-slate-100 pointer-events-none">
                    Markdown Supported
                  </div>
                </div>
              </FormControl>
              <FormMessage className="font-semibold text-red-500" />
            </FormItem>
          )}
        />
      </div>

      {/* Conditional Role Challenges */}
      {selectedRoles.length > 0 && experienceLevel && (
        <div className="space-y-16 py-10">
          <div className="space-y-2 text-center">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Active Sector Challenges</h3>
            <p className="text-slate-500 font-medium">Please address the prompts for each of your selected areas.</p>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {selectedRoles.map((role) => {
              const RoleIcon = getRoleIcon(role);
              const prefix = toCamelCase(role);
              const questions = getQuestions(role);
              const choiceField = `${prefix}QuestionChoice` as any;
              const answerField = `${prefix}QuestionAnswer` as any;

              return (
                <div key={role} className="relative p-10 md:p-14 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 group/card overflow-hidden transition-all hover:scale-[1.01]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 group-hover/card:bg-primary/5 transition-colors duration-700" />

                  <div className="relative z-10 flex flex-col md:flex-row gap-12">
                    <div className="md:w-1/3 space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl primary-gradient flex items-center justify-center text-white shadow-xl shadow-primary/20 rotate-3 group-hover/card:rotate-0 transition-transform duration-500">
                          <RoleIcon size={28} />
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">{role} Domain</h4>
                      </div>

                      <div className="space-y-4">
                        <p className="text-sm font-bold text-slate-500 tracking-widest uppercase pb-2 border-b border-slate-100">Select Question</p>
                        <FormField
                          control={control}
                          name={choiceField}
                          render={({ field }) => (
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-4"
                            >
                              <FormItem className="relative">
                                <FormControl>
                                  <RadioGroupItem value="a" className="sr-only" />
                                </FormControl>
                                <FormLabel
                                  className={cn(
                                    "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer",
                                    field.value === 'a' ? "bg-slate-900 border-slate-900 text-white" : "border-slate-100 hover:border-slate-200"
                                  )}
                                >
                                  <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary font-bold">1</span>
                                  <span className="text-sm font-bold">Question Alpha</span>
                                </FormLabel>
                              </FormItem>
                              <FormItem className="relative">
                                <FormControl>
                                  <RadioGroupItem value="b" className="sr-only" />
                                </FormControl>
                                <FormLabel
                                  className={cn(
                                    "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer",
                                    field.value === 'b' ? "bg-slate-900 border-slate-900 text-white" : "border-slate-100 hover:border-slate-200"
                                  )}
                                >
                                  <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary font-bold">2</span>
                                  <span className="text-sm font-bold">Question Beta</span>
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          )}
                        />
                      </div>
                    </div>

                    <div className="md:w-2/3 space-y-6">
                      <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-100 min-h-[100px] flex items-center animate-in fade-in slide-in-from-right-10 duration-500">
                        <p className="text-lg font-bold text-slate-800 leading-relaxed italic">
                          "{(getQuestions(role) as any)[watch(choiceField) || 'a']}"
                        </p>
                      </div>

                      <FormField
                        control={control}
                        name={answerField}
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <FormControl>
                              <Textarea
                                placeholder="Your detailed analysis starts here..."
                                className="min-h-[250px] bg-white border-2 border-slate-200 rounded-[2rem] p-8 text-slate-700 leading-loose focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="font-semibold text-red-500" />
                          </FormItem>
                        )}
                      />

                      {role === 'Tech' && (
                        <div className="space-y-6 pt-6 border-t border-slate-100">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-100 text-[10px] font-black text-orange-600 tracking-wider uppercase inline-flex">
                            CRITICAL: Engineering Link Required
                          </div>
                          <FormField
                            control={control}
                            name="techQuestionAnswer"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel className="text-sm font-bold text-slate-700">Git Repository Link</FormLabel>
                                <FormControl>
                                  <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                      <Code size={20} />
                                    </div>
                                    <Input
                                      placeholder="https://github.com/username/repository"
                                      className="h-16 pl-14 pr-6 bg-white border-2 border-slate-200 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-mono text-slate-800"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="font-semibold text-red-500" />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Motivation Section */}
      <div className="space-y-10 group/section">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6 group-hover/section:border-primary/20 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover/section:bg-primary/10 group-hover/section:text-primary transition-all duration-500">
            <Award size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-900">Personal Manifesto</h3>
            <p className="text-slate-500 font-medium">Why do you want to join the cohort?</p>
          </div>
        </div>

        <FormField
          control={control}
          name="motivation"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-sm font-bold text-slate-700">Statement of Purpose</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Explain your drive, your vision, and what you bring to the table."
                  className="min-h-[200px] bg-white border-2 border-slate-100 rounded-[2rem] p-8 text-slate-700 leading-loose focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-semibold text-red-500" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
