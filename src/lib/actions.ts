'use server';

import { collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, appId } from './firebase-server';
import { rankCandidates, type RankCandidatesOutput, type RankCandidatesInput } from '@/ai/flows/rank-candidates';

export async function getRankedCandidates(): Promise<{ success: boolean; data?: RankCandidatesOutput; error?: string }> {
  try {
    const collectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'recruitment_applications');
    const snapshot = await getDocs(collectionRef);
    
    if (snapshot.empty) {
      return { success: true, data: [] };
    }
    
    const candidateData: RankCandidatesInput['candidateData'] = snapshot.docs.map(doc => {
      const data = doc.data();
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
