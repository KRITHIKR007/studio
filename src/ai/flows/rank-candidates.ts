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
- **Outreach Role** maps to the **Partnerships & Sponsorship Lead** part of **Community & Growth Leadership**.

Your task is to analyze the provided candidate data and rank each candidate based on their fit for the roles they've applied for. Assign a score from 0 to 100 and provide your reasoning.

**Crucial for ALL roles, evaluate for an owner-mindset:**
- **Ownership & Reliability:** Gauge consistency, proactiveness, and clear communication from their motivation and situational answers. Do they sound like someone who will see things through?
- **Team Behavior & Leadership:** Evaluate potential for low-ego collaboration, conflict handling, and mentoring. This is a leadership role, so look for leadership potential.
- **Initiative:** Identify past self-driven projects, events, or leadership in any domain. This is a strong indicator of an 'owner-mindset'.

**Role-Specific Evaluation:**

---

**If the candidate applied for the 'Tech' role:**
- **Technical Depth:** Assess algorithms, coding, debugging, version control from their \`skills\`, \`projects\`, and \`techQuestionAnswer\`. Note their ability to learn new stacks fast based on the variety in their projects.

---

**If the candidate applied for the 'Design' role:**
- **Design Acumen:** Assess proficiency in design tools from their \`skills\`. Evaluate their design process and thinking from their \`designQuestionAnswer\`.

---

**If the candidate applied for the 'Core' role:**
- **Execution & Strategic Thinking:** Look for evidence of breaking down tasks, meeting deadlines, and strategic planning in their \`projects\`, \`experienceLevel\`, and \`coreQuestionAnswer\`. Skills like \`projectManagement\`, \`publicSpeaking\`, \`contentWriting\`, and \`eventManagement\` are highly relevant.

---

**If the candidate applied for the 'Outreach' role, use this detailed evaluation:**

This role is for the **Outreach / Partnerships & Sponsorship Lead**. It owns:
- External relationships (industry, startups, labs, other clubs).
- Speaker and mentor outreach.
- Sponsorships and in-kind support for events.
- Representing the club professionally in all external communication.

Evaluate them on the following dimensions:
1.  **Communication:** Look for clear, polite, and concise writing in their answers. Professionalism is key.
2.  **Networking:** Do they show comfort with initiating conversations with seniors or industry professionals? Look for examples in their answers, like reaching out to professors, companies, or speakers.
3.  **Negotiation & Persuasion:** Can they pitch the club and ask for support? A drafted email to a sponsor is strong evidence.
4.  **Professionalism & Reliability:** Does their application give the impression they are reliable and will represent the club well? Consider their stated time commitment.
5.  **Planning & Tracking:** Do their answers show evidence of structured thinking or planning for outreach campaigns?

**Scoring for Outreach Candidates:**
Give a higher score to candidates who provide concrete past examples of outreach, organizing, or sponsorships. A strong candidate will have both real examples and well-structured, professional answers to the hypothetical questions. A resilient mindset towards rejection is a plus.

---

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
