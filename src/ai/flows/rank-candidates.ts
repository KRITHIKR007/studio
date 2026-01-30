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
      projects: z.string().optional(),
      techQuestionChoice: z.string().optional(),
      techQuestionAnswer: z.string().optional(),
      designQuestionChoice: z.string().optional(),
      designQuestionAnswer: z.string().optional(),
      publicRelationsQuestionChoice: z.string().optional(),
      publicRelationsQuestionAnswer: z.string().optional(),
      operationsQuestionChoice: z.string().optional(),
      operationsQuestionAnswer: z.string().optional(),
      outreachQuestionChoice: z.string().optional(),
      outreachQuestionAnswer: z.string().optional(),
      motivation: z.string(),
      skills: z.record(z.string()).optional(),
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

const PromptInputSchema = z.object({
  jobDescription: z.string().optional().describe('Optional job description for context.'),
  candidateDataJSON: z.string(),
});

const rankCandidatesPrompt = ai.definePrompt({
  name: 'rankCandidatesPrompt',
  input: {schema: PromptInputSchema},
  output: {schema: RankCandidatesOutputSchema},
  prompt: `You are an expert recruiter and evaluator helping select members for a high-functioning, university-level AI/tech club. Your goal is to select people with an owner-mindset who can reliably run the club for a full year.

The club has several role clusters. The candidate has applied for one or more of the following roles: Tech, Design, Public Relations, Operations, Outreach. Here is how they map to our leadership structure:
- **Tech Role** maps to **Technical Leadership** (Tech Lead, ML/AI Lead, Full-stack/Platform Lead).
- **Design Role** maps to the design part of **Community & Growth Leadership** (Content & Design Lead).
- **Public Relations Role** maps to the PR part of **Community & Growth Leadership** (Content & PR Lead).
- **Operations Role** maps to **Product & Program Leadership** (Events Lead) and **Operations & Governance** (President, General Secretary, Finance).
- **Outreach Role** maps to **Community & Growth Leadership** (Sponsorships, Collaborations).

Your task is to analyze the provided candidate data and rank each candidate based on their fit for the roles they've applied for. Assign a score from 0 to 100 and provide your reasoning.

**Crucial for ALL roles, evaluate for an owner-mindset:**
- **Ownership & Reliability:** Gauge consistency, proactiveness, and clear communication from their motivation and situational answers. Do they sound like someone who will see things through?
- **Team Behavior & Leadership:** Evaluate potential for low-ego collaboration, conflict handling, and mentoring. This is a leadership role, so look for leadership potential.
- **Initiative:** Identify past self-driven projects, events, or leadership in any domain. This is a strong indicator of an 'owner-mindset'.

**Candidate Experience Level:**
- **Give significant weight to candidates with 'Research/Expert' experience.** Their experience with publications and state-of-the-art implementations is a strong positive signal for any role, but especially for 'Tech'. This demonstrates deep commitment and expertise.
- **'Advanced' candidates** with end-to-end projects are also highly valuable.
- **'Intermediate' and 'Beginner' candidates** should be evaluated on their potential, passion (from 'motivation'), and the quality of their answers, as they are the future of the club.

**Role-Specific Evaluation:**

---

**If the candidate applied for the 'Tech' role:**
- **Technical Depth & Experience:** Assess algorithms, coding, debugging, and version control from their \`skills\`, \`projects\`, \`experienceLevel\`, and \`techQuestionAnswer\`. A candidate with 'Research/Expert' experience is extremely valuable. Note their ability to learn new stacks fast based on the variety in their projects.

---

**If the candidate applied for the 'Design' role:**
- **Design Acumen:** Assess proficiency in design tools from their \`skills\`. Evaluate their design process and thinking from their \`designQuestionAnswer\`.

---

**If the candidate applied for the 'Public Relations' role:**
- **Communication & PR Strategy:** Assess their clarity, professionalism, and strategic thinking from their \`publicRelationsQuestionAnswer\`. Evaluate their writing and crisis management skills. Skills like \`publicSpeaking\` and \`contentWriting\` are key.

---

**If the candidate applied for the 'Operations' role:**
- **Execution & Planning:** Look for evidence of project planning, problem-solving, and organizational skills in their \`projects\`, \`experienceLevel\`, and \`operationsQuestionAnswer\`. Skills like \`projectManagement\` and \`eventManagement\` are highly relevant.

---

**If the candidate applied for the 'Outreach' role:**
- **Relationship Building & Strategy:** Evaluate their thinking on building partnerships and handling sponsorships from their \`outreachQuestionAnswer\`. Skills like \`publicSpeaking\` and professional writing are important here.

---

{{#if jobDescription}}Consider the following job description when ranking candidates: {{jobDescription}}{{/if}}

Output the rankings in JSON format, including the candidate's full name, USN, the ranking score, and your reasoning based on the dimensions above.

Candidate Data: {{{candidateDataJSON}}}
`,
});

const rankCandidatesFlow = ai.defineFlow(
  {
    name: 'rankCandidatesFlow',
    inputSchema: RankCandidatesInputSchema,
    outputSchema: RankCandidatesOutputSchema,
  },
  async input => {
    const promptInput = {
      jobDescription: input.jobDescription,
      candidateDataJSON: JSON.stringify(input.candidateData),
    };
    const {output} = await rankCandidatesPrompt(promptInput);
    return output!;
  }
);
