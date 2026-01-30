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
  fullName: z.string().min(1, { message: "Full name is required." }),
  usn: z.string().trim().min(1, { message: "USN / ID is required." }),
  department: z.string().min(1, { message: "Please enter your department." }),
  year: z.string().min(1, { message: "Please select your year." }),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(1, { message: "Phone number is required." }),
  roles: z.array(z.string()).min(1, { message: "Please select at least one role." }),
  experienceLevel: z.string().min(1, { message: "Please select your experience level." }),
  projects: z.string().optional(),
  techQuestionChoice: z.enum(['a', 'b', 'c']).optional(),
  techQuestionAnswer: z.string().optional(),
  motivation: z.string().min(10, { message: "Motivation must be at least 10 characters." }),
  skills: skillsSchema.partial(),
  designQuestionChoice: z.enum(['a', 'b', 'c']).optional(),
  designQuestionAnswer: z.string().optional(),
  operationsQuestionChoice: z.enum(['a', 'b', 'c']).optional(),
  operationsQuestionAnswer: z.string().optional(),
  publicRelationsQuestionChoice: z.enum(['a', 'b', 'c']).optional(),
  publicRelationsQuestionAnswer: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.roles.includes('Tech') && (!data.techQuestionAnswer || data.techQuestionAnswer.trim().length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Answer to technical question is required.',
            path: ['techQuestionAnswer'],
        });
    }
    if (data.roles.includes('Design') && (!data.designQuestionAnswer || data.designQuestionAnswer.trim().length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Answer to design question is required.',
            path: ['designQuestionAnswer'],
        });
    }
    if (data.roles.includes('Operations') && (!data.operationsQuestionAnswer || data.operationsQuestionAnswer.trim().length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Answer to operations question is required.',
            path: ['operationsQuestionAnswer'],
        });
    }
    if (data.roles.includes('Public Relations') && (!data.publicRelationsQuestionAnswer || data.publicRelationsQuestionAnswer.trim().length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Answer to public relations question is required.',
            path: ['publicRelationsQuestionAnswer'],
        });
    }
});


export type ApplicationSchema = z.infer<typeof applicationSchema>;
