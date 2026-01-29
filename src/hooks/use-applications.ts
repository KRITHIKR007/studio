'use client';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db, appId } from '@/lib/firebase';
import type { Application } from '@/lib/types';

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appId) {
        console.error("Firebase App ID is not configured.");
        setLoading(false);
        return;
    }
    const collectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'recruitment_applications');
    const q = query(collectionRef);
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Application));
      
      // Per user instruction, sort in memory
      apps.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      setApplications(apps);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching applications:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { applications, loading };
}
