'use server';

import { rankCandidates, type RankCandidatesOutput, type RankCandidatesInput } from '@/ai/flows/rank-candidates';
import type { Application } from '@/lib/types';

export async function getRankedCandidates(applications: Application[]): Promise<{ success: boolean; data?: RankCandidatesOutput; error?: string }> {
  try {
    if (!applications || applications.length === 0) {
      return { success: true, data: [] };
    }
    
    const candidateData: RankCandidatesInput['candidateData'] = applications.map(data => {
      return {
        fullName: data.fullName || '',
        usn: data.usn || '',
        department: data.department || '',
        year: data.year || '',
        roles: data.roles || [],
        experienceLevel: data.experienceLevel || '',
        projects: data.projects || '',
        techQuestionChoice: data.techQuestionChoice || '',
        techQuestionAnswer: data.techQuestionAnswer || '',
        designQuestionChoice: data.designQuestionChoice || '',
        designQuestionAnswer: data.designQuestionAnswer || '',
        publicRelationsQuestionChoice: data.publicRelationsQuestionChoice || '',
        publicRelationsQuestionAnswer: data.publicRelationsQuestionAnswer || '',
        operationsQuestionChoice: data.operationsQuestionChoice || '',
        operationsQuestionAnswer: data.operationsQuestionAnswer || '',
        outreachQuestionChoice: data.outreachQuestionChoice || '',
        outreachQuestionAnswer: data.outreachQuestionAnswer || '',
        motivation: data.motivation || '',
        skills: data.skills || {},
      };
    });

    const rankedCandidates = await rankCandidates({ candidateData });

    return { success: true, data: rankedCandidates };

  } catch (error: any) {
    console.error('Error ranking candidates:', error);
    return { success: false, error: error.message || 'Failed to get AI-powered ranking.' };
  }
}
