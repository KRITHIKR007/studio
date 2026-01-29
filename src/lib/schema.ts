import { z } from 'zod';

export const skillsSchema = z.object({
  python: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
  cpp: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
  java: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
  javascript: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
  r: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
});

export const applicationSchema = z.object({
  fullName: z.string(),
  usn: z.string().trim(),
  department: z.string(),
  year: z.string(),
  email: z.string().email("Invalid email address").or(z.literal('')),
  phone: z.string(),
  roles: z.array(z.string()),
  experienceLevel: z.string(),
  projects: z.string(),
  techQuestionChoice: z.enum(['a', 'b', 'c']),
  techQuestionAnswer: z.string(),
  motivation: z.string(),
  skills: skillsSchema,
});

export type ApplicationSchema = z.infer<typeof applicationSchema>;
