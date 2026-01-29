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
      coreQuestionChoice: z.string().optional(),
      coreQuestionAnswer: z.string().optional(),
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
        projectManagement: z.string().optional(),
        publicSpeaking: z.string().optional(),
        contentWriting: z.string().optional(),
        eventManagement: z.string().optional(),
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
  prompt: `You are an expert recruiter and evaluator helping select members for a high-functioning, university-level AI/tech club. Your goal is to select people with an owner-mindset who can reliably run the club for a full year.

The club has several role clusters. The candidate has applied for one or more of the following roles: Tech, Design, Core, Outreach. Here is how they map to our leadership structure:
- **Tech Role** maps to **Technical Leadership** (Tech Lead, ML/AI Lead, Full-stack/Platform Lead).
- **Design Role** maps to the design part of **Community & Growth Leadership** (Content & Design Lead).
- **Core Role** maps to **Product & Program Leadership** (Product Lead, Events Lead) and **Operations & Governance** (President, General Secretary, Finance).
- **Outreach Role** maps to the community and partnerships part of **Community & Growth Leadership** (Community Lead, Partnerships Lead).

Your task is to analyze the provided candidate data and rank each candidate based on their fit for the roles they've applied for. Assign a score from 0 to 100 and provide your reasoning.

Evaluate each candidate across these dimensions, weighting them based on the roles they selected:

1.  **Technical Depth (Primary for 'Tech' roles):**
    - Assess algorithms, coding, debugging, version control from their \`skills\`, \`projects\`, and \`techQuestionAnswer\`.
    - Note their ability to learn new stacks fast based on the variety in their projects.

2.  **Design Acumen (Primary for 'Design' roles):**
    - Assess proficiency in design tools from their \`skills\`.
    - Evaluate their design process and thinking from their \`designQuestionAnswer\`.

3.  **Execution & Strategic Thinking (Primary for 'Core' and 'Outreach' roles):**
    - Look for evidence of breaking down tasks, meeting deadlines, and strategic planning in their \`projects\`, \`experienceLevel\`, and \`coreQuestionAnswer\`.
    - Skills like \`projectManagement\`, \`publicSpeaking\`, \`contentWriting\`, and \`eventManagement\` are highly relevant.

4.  **Ownership & Reliability (Crucial for ALL roles):**
    - This is a critical filter. Gauge consistency, proactiveness, and clear communication from their \`motivation\` and \`coreQuestionAnswer\`. Do they sound like someone who will see things through?

5.  **Team Behavior & Leadership (Crucial for ALL roles):**
    - Evaluate potential for low-ego collaboration, conflict handling, and mentoring. Look for this in their \`motivation\` and situational answers. This is a leadership role, so look for leadership potential.

6.  **Initiative (Crucial for ALL roles):**
    - Identify past self-driven projects, events, or leadership in any domain from their \`projects\` and \`experienceLevel\`. This is a strong indicator of an 'owner-mindset'.

{{#if jobDescription}}Consider the following job description when ranking candidates: {{jobDescription}}{{/if}}

Output the rankings in JSON format, including the candidate's full name, USN, the ranking score, and your reasoning based on the dimensions above.

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
