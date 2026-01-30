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
  fullName: z.string().trim(),
  usn: z.string().trim(),
  department: z.string().trim(),
  year: z.string().trim(),
  email: z.string().email("Invalid email address.").or(z.literal('')),
  phone: z.string().trim(),
  roles: z.array(z.string()).default([]),
  experienceLevel: z.string().trim(),
  projects: z.string().optional(),
  techQuestionChoice: z.enum(['a', 'b', 'c']).optional(),
  techQuestionAnswer: z.string().optional(),
  motivation: z.string().trim(),
  skills: skillsSchema.partial(),
  designQuestionChoice: z.enum(['a', 'b', 'c']).optional(),
  designQuestionAnswer: z.string().optional(),
  operationsQuestionChoice: z.enum(['a', 'b', 'c']).optional(),
  operationsQuestionAnswer: z.string().optional(),
  publicRelationsQuestionChoice: z.enum(['a', 'b', 'c']).optional(),
  publicRelationsQuestionAnswer: z.string().optional(),
  outreachQuestionChoice: z.enum(['a', 'b', 'c']).optional(),
  outreachQuestionAnswer: z.string().optional(),
}).superRefine((data, ctx) => {
    if (!data.fullName) {
      ctx.addIssue({ code: 'custom', message: 'Full name is required.', path: ['fullName'] });
    }
    if (!data.usn) {
      ctx.addIssue({ code: 'custom', message: 'USN is required.', path: ['usn'] });
    }
    if (!data.department) {
      ctx.addIssue({ code: 'custom', message: 'Department is required.', path: ['department'] });
    }
    if (!data.year) {
      ctx.addIssue({ code: 'custom', message: 'Year is required.', path: ['year'] });
    }
    if (!data.email) {
      ctx.addIssue({ code: 'custom', message: 'Email is required.', path: ['email'] });
    }
    if (!data.phone) {
      ctx.addIssue({ code: 'custom', message: 'Phone number is required.', path: ['phone'] });
    }
    if (data.roles.length === 0) {
      ctx.addIssue({ code: 'custom', message: 'Please select at least one role.', path: ['roles'] });
    }
    if (!data.experienceLevel) {
      ctx.addIssue({ code: 'custom', message: 'Please select your experience level.', path: ['experienceLevel'] });
    }
    if (!data.motivation) {
      ctx.addIssue({ code: 'custom', message: 'Please tell us your motivation.', path: ['motivation'] });
    }
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
    if (data.roles.includes('Outreach') && (!data.outreachQuestionAnswer || data.outreachQuestionAnswer.trim().length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Answer to outreach question is required.',
            path: ['outreachQuestionAnswer'],
        });
    }
});


export type ApplicationSchema = z.infer<typeof applicationSchema>;
