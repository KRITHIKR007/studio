'use server';

import { rankCandidates, type RankCandidatesOutput, type RankCandidatesInput } from '@/ai/flows/rank-candidates';
import type { Application } from '@/lib/types';

export async function getRankedCandidates(applications: Application[]): Promise<{ success: boolean; data?: RankCandidatesOutput; error?: string }> {
  try {
    if (!applications || applications.length === 0) {
      return { success: true, data: [] };
    }
    
    // Create a clean candidate data object for the AI, only including fields that have values.
    const candidateData = applications.map((app): RankCandidatesInput['candidateData'][number] => {
      const candidate: RankCandidatesInput['candidateData'][number] = {
        fullName: app.fullName || '',
        usn: app.usn || '',
        department: app.department || '',
        year: app.year || '',
        roles: app.roles || [],
        experienceLevel: app.experienceLevel || '',
        motivation: app.motivation || '',
      };

      if (app.projects) candidate.projects = app.projects;
      if (app.skills) candidate.skills = app.skills;
      if (app.techQuestionChoice) candidate.techQuestionChoice = app.techQuestionChoice;
      if (app.techQuestionAnswer) candidate.techQuestionAnswer = app.techQuestionAnswer;
      if (app.designQuestionChoice) candidate.designQuestionChoice = app.designQuestionChoice;
      if (app.designQuestionAnswer) candidate.designQuestionAnswer = app.designQuestionAnswer;
      if (app.publicRelationsQuestionChoice) candidate.publicRelationsQuestionChoice = app.publicRelationsQuestionChoice;
      if (app.publicRelationsQuestionAnswer) candidate.publicRelationsQuestionAnswer = app.publicRelationsQuestionAnswer;
      if (app.operationsQuestionChoice) candidate.operationsQuestionChoice = app.operationsQuestionChoice;
      if (app.operationsQuestionAnswer) candidate.operationsQuestionAnswer = app.operationsQuestionAnswer;
      if (app.outreachQuestionChoice) candidate.outreachQuestionChoice = app.outreachQuestionChoice;
      if (app.outreachQuestionAnswer) candidate.outreachQuestionAnswer = app.outreachQuestionAnswer;
      
      return candidate;
    });

    const rankedCandidates = await rankCandidates({ candidateData });

    return { success: true, data: rankedCandidates };

  } catch (error: any) {
    console.error('Error ranking candidates:', error);
    return { success: false, error: error.message || 'Failed to get AI-powered ranking.' };
  }
}
