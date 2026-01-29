import { z } from 'zod';

export const skillsSchema = z.object({
  python: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
  cpp: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
  java: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
  javascript: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
  r: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
  figma: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
  photoshop: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
  illustrator: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
  afterEffects: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
  projectManagement: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
  publicSpeaking: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
  contentWriting: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
  eventManagement: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
});

export const applicationSchema = z.object({
  fullName: z.string().optional(),
  usn: z.string().trim().optional(),
  department: z.string().optional(),
  year: z.string().optional(),
  email: z.string().email("Invalid email address").or(z.literal('')).optional(),
  phone: z.string().optional(),
  roles: z.array(z.string()).default([]),
  experienceLevel: z.string().optional(),
  projects: z.string().optional(),
  techQuestionChoice: z.enum(['a', 'b', 'c']).optional(),
  techQuestionAnswer: z.string().optional(),
  motivation: z.string().optional(),
  skills: skillsSchema.partial(),
  designQuestionChoice: z.enum(['a', 'b', 'c']).optional(),
  designQuestionAnswer: z.string().optional(),
  coreQuestionChoice: z.enum(['a', 'b', 'c']).optional(),
  coreQuestionAnswer: z.string().optional(),
});

export type ApplicationSchema = z.infer<typeof applicationSchema>;
