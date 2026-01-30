import type { ApplicationSchema, skillsSchema } from './schema';
import { z } from 'zod';

export type Skills = z.infer<typeof skillsSchema>;

export type ApplicationData = ApplicationSchema;

export type Application = ApplicationData & {
  id: string;
  createdAt: { seconds: number; nanoseconds: number };
  status: 'pending' | 'reviewed' | 'accepted';
}
