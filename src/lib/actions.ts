'use server';

import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, appId } from '@/lib/firebase';
import { applicationSchema, type ApplicationSchema } from '@/lib/schema';
import { rankCandidates, type RankCandidatesOutput, type RankCandidatesInput } from '@/ai/flows/rank-candidates';

export async function submitApplication(data: ApplicationSchema, userId: string): Promise<{ success: boolean; error?: string | object }> {
  const validation = applicationSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.flatten() };
  }

  if (!userId) {
    return { success: false, error: 'User is not authenticated.' };
  }
  
  try {
    const collectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'recruitment_applications');
    await addDoc(collectionRef, {
      ...validation.data,
      userId,
      createdAt: serverTimestamp(),
      status: 'pending'
    });
    return { success: true };
  } catch (error) {
    console.error("Error submitting form:", error);
    return { success: false, error: 'Failed to submit application to the database.' };
  }
}

export async function getRankedCandidates(): Promise<{ success: boolean; data?: RankCandidatesOutput; error?: string }> {
  try {
    const collectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'recruitment_applications');
    const snapshot = await getDocs(collectionRef);
    
    if (snapshot.empty) {
      return { success: true, data: [] };
    }
    
    // Ensure the data matches the expected schema for the AI flow
    const candidateData = snapshot.docs.map(doc => {
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
