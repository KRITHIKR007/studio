'use client';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { firebaseConfig } from '@/firebase/config';
import type { Application } from '@/lib/types';

export function useApplications() {
  const firestore = useFirestore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firestore) {
        setLoading(false);
        return;
    }
    const appId = firebaseConfig.appId;
    if (!appId) {
        console.error("Firebase App ID is not configured.");
        setLoading(false);
        return;
    }
    const collectionRef = collection(firestore, 'artifacts', appId, 'public', 'data', 'recruitment_applications');
    const q = query(collectionRef);
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Manually convert to a plain object to avoid passing class instances to Server Components.
        const app = {
          id: doc.id,
          ...data,
        };

        if (app.createdAt && typeof (app.createdAt as any).toDate === 'function') {
          app.createdAt = {
            seconds: (app.createdAt as any).seconds,
            nanoseconds: (app.createdAt as any).nanoseconds,
          };
        }

        return app as Application;
      });
      
      apps.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      setApplications(apps);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching applications:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore]);

  return { applications, loading };
}
