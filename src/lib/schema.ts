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
  fullName: z.string().trim().min(1, 'Full name is required.'),
  usn: z.string().trim().min(1, 'USN is required.'),
  department: z.string().trim().min(1, 'Department is required.'),
  year: z.string().trim().min(1, 'Year is required.'),
  email: z.string().min(1, "Email is required.").email("Invalid email address."),
  phone: z.string().trim().min(1, 'Phone number is required.'),
  roles: z.array(z.string()).min(1, 'Please select at least one role.'),
  experienceLevel: z.string().trim().min(1, 'Please select your experience level.'),
  projects: z.string().optional(),
  motivation: z.string().trim().min(1, 'Please tell us your motivation.'),
  skills: skillsSchema.partial(),
  techQuestionChoice: z.enum(['a', 'b', 'c']).optional(),
  techQuestionAnswer: z.string().optional(),
  designQuestionChoice: z.enum(['a', 'b', 'c']).optional(),
  designQuestionAnswer: z.string().optional(),
  operationsQuestionChoice: z.enum(['a', 'b', 'c']).optional(),
  operationsQuestionAnswer: z.string().optional(),
  publicRelationsQuestionChoice: z.enum(['a', 'b', 'c']).optional(),
  publicRelationsQuestionAnswer: z.string().optional(),
  outreachQuestionChoice: z.enum(['a', 'b', 'c']).optional(),
  outreachQuestionAnswer: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.roles.includes('Tech')) {
        if (!data.techQuestionChoice) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Please choose a take-home assignment.',
                path: ['techQuestionChoice'],
            });
        }
        if (!data.techQuestionAnswer || data.techQuestionAnswer.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'A link to your Git repository is required.',
                path: ['techQuestionAnswer'],
            });
        } else {
             const urlCheck = z.string().url("Please provide a valid URL to your Git repository.").safeParse(data.techQuestionAnswer);
             if (!urlCheck.success) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: urlCheck.error.issues[0].message,
                    path: ['techQuestionAnswer'],
                });
             }
        }
    }
    if (data.roles.includes('Design') && (!data.designQuestionAnswer || data.designQuestionAnswer.trim() === '')) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Answer for Design role is required.',
            path: ['designQuestionAnswer'],
        });
    }
    if (data.roles.includes('Operations') && (!data.operationsQuestionAnswer || data.operationsQuestionAnswer.trim() === '')) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Answer for Operations role is required.',
            path: ['operationsQuestionAnswer'],
        });
    }
    if (data.roles.includes('Public Relations') && (!data.publicRelationsQuestionAnswer || data.publicRelationsQuestionAnswer.trim() === '')) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Answer for Public Relations role is required.',
            path: ['publicRelationsQuestionAnswer'],
        });
    }
    if (data.roles.includes('Outreach') && (!data.outreachQuestionAnswer || data.outreachQuestionAnswer.trim() === '')) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Answer for Outreach role is required.',
            path: ['outreachQuestionAnswer'],
        });
    }
});


export type ApplicationSchema = z.infer<typeof applicationSchema>;
