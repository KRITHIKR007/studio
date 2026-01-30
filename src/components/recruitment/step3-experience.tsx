'use client';

import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Award, Terminal, Brain, Palette, ClipboardCheck, Megaphone, Contact } from 'lucide-react';
import type { ApplicationSchema } from '@/lib/schema';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';

const beginnerTechQuestions = {
    a: "Implement a Breadth-First Search (BFS) or Depth-First Search (DFS) algorithm in your preferred language to find a path in a given maze (represented as a 2D array).",
    b: "Build a simple command-line tool that fetches data from a public API (e.g., the GitHub API to get user repos) and displays it in a user-friendly format.",
    c: "Write a script to scrape the headlines from a news website (like BBC News) and save them to a CSV file."
};

const intermediateTechQuestions = {
    a: "Develop a simple REST API (using Flask, FastAPI, or Express.js) that serves predictions from a pre-trained machine learning model (you can use a simple model from scikit-learn).",
    b: "Build and containerize a simple data processing pipeline using Docker. The pipeline should read a CSV, perform a simple transformation (e.g., filter rows), and write the output to a new file.",
    c: "Create a basic chatbot using rule-based logic or a simple NLP library that can answer questions about a specific topic (e.g., your university)."
};

const advancedTechQuestions = {
    a: "Implement a Q-Learning agent from scratch to solve a simple environment, or optimize a pre-trained model for a specific edge case.",
    b: "Set up a basic distributed task queue or a containerized environment that can handle a mock AI workload.",
    c: "Build a retrieval-augmented generation (RAG) pipeline that uses a Knowledge Graph to answer complex queries."
};

const designQuestions = {
    a: "Describe your design process for a recent project.",
    b: "Pick a popular app. What is one UI/UX improvement you would make and why?",
    c: "How would you design a poster for an AI workshop?"
};

const operationsQuestions = {
    a: "Describe how you would plan and execute a 100-person workshop, from budget to feedback collection.",
    b: "A key speaker for an event cancels last minute. What's your immediate action plan?",
    c: "What tools would you use to keep track of tasks, timelines, and responsibilities for a team project?"
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
    setValue('techQuestionAnswer', '');
  }, [experienceLevel, setValue]);

  const getTechQuestions = (level: string | undefined) => {
    switch(level) {
        case 'Beginner':
            return beginnerTechQuestions;
        case 'Intermediate':
            return intermediateTechQuestions;
        case 'Advanced':
        case 'Research/Expert':
            return advancedTechQuestions;
        default:
            return null;
    }
  }

  const techQuestions = getTechQuestions(experienceLevel);
  const showConceptualCheck = selectedRoles.some(role => TECHNICAL_ROLES.includes(role));
  const showDesignChallenge = selectedRoles.some(role => DESIGN_ROLES.includes(role));
  const showOperationsChallenge = selectedRoles.some(role => OPERATIONS_ROLES.includes(role));
  const showPublicRelationsChallenge = selectedRoles.some(role => PUBLIC_RELATIONS_ROLES.includes(role));
  const showOutreachChallenge = selectedRoles.some(role => OUTREACH_ROLES.includes(role));

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="text-primary" size={24} /> Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="experienceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select your experience level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select a level..." /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner (Intro course completed)</SelectItem>
                    <SelectItem value="Intermediate">Intermediate (Built 2-5 personal projects)</SelectItem>
                    <SelectItem value="Advanced">Advanced (End-to-end projects, deployed models)</SelectItem>
                    <SelectItem value="Research/Expert">Research/Expert (Publications, SOTA impl)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="text-primary" size={24} /> Project Portfolio
          </CardTitle>
          <CardDescription>Paste GitHub/Kaggle links. Describe your tech stack and role.</CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="projects"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    rows={5}
                    className="font-mono text-sm"
                    placeholder="I built a CNN for plant disease detection using TensorFlow..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {showConceptualCheck && (
        <Card className="bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="text-primary" size={24} /> Take-Home Coding Challenge
            </CardTitle>
            <CardDescription>
                Your assignment is based on your selected experience level. Choose one of the following. Submit a link to a public Git repository with your solution and a README.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              {!techQuestions ? (
                <div className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-md">
                    Please select your experience level first to see the assignments.
                </div>
              ) : (
                <>
                  <FormField
                      control={control}
                      name="techQuestionChoice"
                      render={({ field }) => (
                          <FormItem className="space-y-3">
                              <FormLabel>Choose your assignment ({experienceLevel})</FormLabel>
                              <FormControl>
                                  <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex flex-col space-y-1"
                                  >
                                      {Object.entries(techQuestions).map(([key, value]) => (
                                          <FormItem key={key} className="flex items-center space-x-3 space-y-0">
                                              <FormControl><RadioGroupItem value={key} /></FormControl>
                                              <FormLabel className="font-normal">{value}</FormLabel>
                                          </FormItem>
                                      ))}
                                  </RadioGroup>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={control}
                      name="techQuestionAnswer"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Git Repository Link</FormLabel>
                          <FormControl>
                              <Input
                                  placeholder="https://github.com/your-username/repo-name"
                                  {...field}
                              />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                </>
              )}
          </CardContent>
        </Card>
      )}

      {showDesignChallenge && (
        <Card className="bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="text-primary" size={24} /> Design Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
              <FormField
                  control={control}
                  name="designQuestionChoice"
                  render={({ field }) => (
                      <FormItem className="space-y-3 mb-4">
                          <FormLabel>Choose a question to answer</FormLabel>
                          <FormControl>
                              <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                              >
                                  {Object.entries(designQuestions).map(([key, value]) => (
                                      <FormItem key={key} className="flex items-center space-x-3 space-y-0">
                                          <FormControl><RadioGroupItem value={key} /></FormControl>
                                          <FormLabel className="font-normal">{value}</FormLabel>
                                      </FormItem>
                                  ))}
                              </RadioGroup>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )}
              />
              <FormField
                  control={control}
                  name="designQuestionAnswer"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Your Answer</FormLabel>
                      <FormControl>
                          <Textarea
                              rows={3}
                              placeholder="Describe your process and reasoning..."
                              {...field}
                          />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
              />
          </CardContent>
        </Card>
      )}

      {showOperationsChallenge && (
        <Card className="bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="text-primary" size={24} /> Operations Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
              <FormField
                  control={control}
                  name="operationsQuestionChoice"
                  render={({ field }) => (
                      <FormItem className="space-y-3 mb-4">
                          <FormLabel>Choose a question to answer</FormLabel>
                          <FormControl>
                              <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                              >
                                  {Object.entries(operationsQuestions).map(([key, value]) => (
                                      <FormItem key={key} className="flex items-center space-x-3 space-y-0">
                                          <FormControl><RadioGroupItem value={key} /></FormControl>
                                          <FormLabel className="font-normal">{value}</FormLabel>
                                      </FormItem>
                                  ))}
                              </RadioGroup>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )}
              />
              <FormField
                  control={control}
                  name="operationsQuestionAnswer"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Your Answer</FormLabel>
                      <FormControl>
                          <Textarea
                              rows={3}
                              placeholder="Explain your thought process..."
                              {...field}
                          />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
              />
          </CardContent>
        </Card>
      )}

      {showPublicRelationsChallenge && (
        <Card className="bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="text-primary" size={24} /> Public Relations Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
              <FormField
                  control={control}
                  name="publicRelationsQuestionChoice"
                  render={({ field }) => (
                      <FormItem className="space-y-3 mb-4">
                          <FormLabel>Choose a question to answer</FormLabel>
                          <FormControl>
                              <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                              >
                                  {Object.entries(publicRelationsQuestions).map(([key, value]) => (
                                      <FormItem key={key} className="flex items-center space-x-3 space-y-0">
                                          <FormControl><RadioGroupItem value={key} /></FormControl>
                                          <FormLabel className="font-normal">{value}</FormLabel>
                                      </FormItem>
                                  ))}
                              </RadioGroup>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )}
              />
              <FormField
                  control={control}
                  name="publicRelationsQuestionAnswer"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Your Answer</FormLabel>
                      <FormControl>
                          <Textarea
                              rows={3}
                              placeholder="Explain your thought process..."
                              {...field}
                          />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
              />
          </CardContent>
        </Card>
      )}

      {showOutreachChallenge && (
        <Card className="bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Contact className="text-primary" size={24} /> Outreach Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
              <FormField
                  control={control}
                  name="outreachQuestionChoice"
                  render={({ field }) => (
                      <FormItem className="space-y-3 mb-4">
                          <FormLabel>Choose a question to answer</FormLabel>
                          <FormControl>
                              <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                              >
                                  {Object.entries(outreachQuestions).map(([key, value]) => (
                                      <FormItem key={key} className="flex items-center space-x-3 space-y-0">
                                          <FormControl><RadioGroupItem value={key} /></FormControl>
                                          <FormLabel className="font-normal">{value}</FormLabel>
                                      </FormItem>
                                  ))}
                              </RadioGroup>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )}
              />
              <FormField
                  control={control}
                  name="outreachQuestionAnswer"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Your Answer</FormLabel>
                      <FormControl>
                          <Textarea
                              rows={3}
                              placeholder="Explain your thought process..."
                              {...field}
                          />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
              />
          </CardContent>
        </Card>
      )}

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
            <CardTitle>Why join the club?</CardTitle>
        </CardHeader>
        <CardContent>
            <FormField
                control={control}
                name="motivation"
                render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Textarea
                            rows={3}
                            placeholder="I want to build real systems, collaborate with peers..."
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </CardContent>
      </Card>
    </div>
  );
}
