'use server';

/**
 * @fileOverview AI-powered candidate ranking flow.
 *
 * - rankCandidates - A function that ranks candidates based on their qualifications, experience, and preferred roles.
 * - RankCandidatesInput - The input type for the rankCandidates function.
 * - RankCandidatesOutput - The return type for the rankCandidates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RankCandidatesInputSchema = z.object({
  candidateData: z.array(
    z.object({
      fullName: z.string(),
      usn: z.string(),
      department: z.string(),
      year: z.string(),
      roles: z.array(z.string()),
      experienceLevel: z.string(),
      projects: z.string(),
      techQuestionChoice: z.string(),
      techQuestionAnswer: z.string(),
      designQuestionChoice: z.string().optional(),
      designQuestionAnswer: z.string().optional(),
      motivation: z.string(),
      skills: z.object({
        python: z.string().optional(),
        cpp: z.string().optional(),
        java: z.string().optional(),
        javascript: z.string().optional(),
        r: z.string().optional(),
        figma: z.string().optional(),
        photoshop: z.string().optional(),
        illustrator: z.string().optional(),
        afterEffects: z.string().optional(),
      }).optional(),
    })
  ).describe('Array of candidate data objects.'),
  jobDescription: z.string().optional().describe('Optional job description for context.'),
});
export type RankCandidatesInput = z.infer<typeof RankCandidatesInputSchema>;

const RankCandidatesOutputSchema = z.array(
  z.object({
    fullName: z.string(),
    usn: z.string(),
    rankingScore: z.number().describe('A score representing the candidate ranking.'),
    reasoning: z.string().describe('The AI reasoning behind the ranking score.'),
  })
);
export type RankCandidatesOutput = z.infer<typeof RankCandidatesOutputSchema>;

export async function rankCandidates(input: RankCandidatesInput): Promise<RankCandidatesOutput> {
  return rankCandidatesFlow(input);
}

const rankCandidatesPrompt = ai.definePrompt({
  name: 'rankCandidatesPrompt',
  input: {schema: RankCandidatesInputSchema},
  output: {schema: RankCandidatesOutputSchema},
  prompt: `You are an AI recruitment assistant tasked with ranking candidates for a university AI club.

  Analyze the provided candidate data and assign a ranking score to each candidate from 0 to 100, where 100 is an ideal match.
  Provide a brief explanation for each score.
  
  - For 'Tech' roles, focus on technical skills (Python, C++, etc.), projects, and the answer to the conceptual tech question.
  - For 'Design' roles, focus on design tool proficiency (Figma, Photoshop, etc.) and their response to the design challenge question.
  - For all roles, consider their motivation, experience level, and projects.

  ${'{{#if jobDescription}}'}Consider the following job description when ranking candidates: {{jobDescription}}${'{{/if}}'}

  Output the rankings in JSON format, including the candidate's full name, USN, the ranking score, and your reasoning.

  Candidate Data: {{{JSONstringify candidateData}}}
  `,
});

const rankCandidatesFlow = ai.defineFlow(
  {
    name: 'rankCandidatesFlow',
    inputSchema: RankCandidatesInputSchema,
    outputSchema: RankCandidatesOutputSchema,
  },
  async input => {
    const {output} = await rankCandidatesPrompt(input);
    return output!;
  }
);
