'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Award, Terminal, Brain, Palette, ClipboardCheck } from 'lucide-react';
import type { ApplicationSchema } from '@/lib/schema';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const techQuestions = {
    a: "What is overfitting and how do you fight it?",
    b: "What is the difference between Transformers and RNNs?",
    c: "Why do we need Batch Normalization?"
};

const designQuestions = {
    a: "Describe your design process for a recent project.",
    b: "Pick a popular app. What is one UI/UX improvement you would make and why?",
    c: "How would you design a poster for an AI workshop?"
};

const coreQuestions = {
    a: "You're leading a project that's falling behind schedule. What are the first three steps you would take?",
    b: "Describe a time you had to explain a complex topic to a non-technical audience. How did you approach it?",
    c: "Propose an idea for a new workshop or event for the AI Club. Outline the key objectives and target audience."
};

const TECHNICAL_ROLES = ["Tech"];
const DESIGN_ROLES = ["Design"];
const CORE_ROLES = ["Core"];

export function Step3Experience() {
  const { control, watch } = useFormContext<ApplicationSchema>();
  const selectedRoles = watch('roles', []);
  const showConceptualCheck = selectedRoles.some(role => TECHNICAL_ROLES.includes(role));
  const showDesignChallenge = selectedRoles.some(role => DESIGN_ROLES.includes(role));
  const showCoreChallenge = selectedRoles.some(role => CORE_ROLES.includes(role));

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
                    <SelectItem value="Research">Research/Expert (Publications, SOTA impl)</SelectItem>
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
              <Brain className="text-primary" size={24} /> Conceptual Check
            </CardTitle>
          </CardHeader>
          <CardContent>
              <FormField
                  control={control}
                  name="techQuestionChoice"
                  render={({ field }) => (
                      <FormItem className="space-y-3 mb-4">
                          <FormLabel>Choose a question to answer</FormLabel>
                          <FormControl>
                              <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
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
                      <FormLabel>Your Answer</FormLabel>
                      <FormControl>
                          <Textarea
                              rows={3}
                              placeholder="Explain simply..."
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

      {showCoreChallenge && (
        <Card className="bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="text-primary" size={24} /> Situational Judgement
            </CardTitle>
          </CardHeader>
          <CardContent>
              <FormField
                  control={control}
                  name="coreQuestionChoice"
                  render={({ field }) => (
                      <FormItem className="space-y-3 mb-4">
                          <FormLabel>Choose a question to answer</FormLabel>
                          <FormControl>
                              <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                              >
                                  {Object.entries(coreQuestions).map(([key, value]) => (
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
                  name="coreQuestionAnswer"
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
