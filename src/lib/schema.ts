import { z } from 'zod';

export const skillsSchema = z.object({
  python: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
  cpp: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
  java: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
  javascript: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
  r: z.enum(['None', 'Basic', 'Comfortable', 'Expert']),
});

export const applicationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  usn: z.string().min(1, "USN / ID is required").trim(),
  department: z.string().min(1, "Department is required"),
  year: z.string().min(1, "Year is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "A valid phone number is required"),
  roles: z.array(z.string()).min(1, "Please select at least one role"),
  experienceLevel: z.string().min(1, "Please select your experience level"),
  projects: z.string().min(10, "Please describe your projects"),
  techQuestionChoice: z.enum(['a', 'b', 'c'], { required_error: "Please choose a question" }),
  techQuestionAnswer: z.string().min(10, "Please answer the selected question"),
  motivation: z.string().min(10, "Please tell us your motivation"),
  skills: skillsSchema,
});

export type ApplicationSchema = z.infer<typeof applicationSchema>;
