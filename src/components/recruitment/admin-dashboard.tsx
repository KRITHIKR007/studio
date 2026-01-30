'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, Database, Search, ArrowUp, ArrowDown, Trash2, TestTube } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { ApplicationCard } from './application-card';
import { useApplications } from '@/hooks/use-applications';
import { getRankedCandidates } from '@/lib/actions';
import type { Application, RankedCandidate } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useFirestore, useUser } from '@/firebase';
import { doc, deleteDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';


type SortKey = 'createdAt' | 'rankingScore';
type SortDirection = 'asc' | 'desc';

export function AdminDashboard({ onExit }: { onExit: () => void }) {
  const { applications: initialApplications, loading: applicationsLoading } = useApplications();
  const [isRanking, setIsRanking] = useState(false);
  const [rankedApplications, setRankedApplications] = useState<Application[]>([]);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const firestore = useFirestore();
  const { user } = useUser();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingData, setIsAddingData] = useState(false);

  useEffect(() => {
    setRankedApplications(initialApplications);
  }, [initialApplications]);

  const handleAddDummyData = async () => {
    if (!firestore || !user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Cannot add dummy data. Please ensure you are connected.',
      });
      return;
    }

    setIsAddingData(true);

    const dummyApplications = [
      {
        fullName: "Alex Turing",
        usn: "23BTEXP001",
        department: "AI & ML",
        year: "3rd Year",
        email: "alex.turing@college.edu",
        phone: "1111111111",
        roles: ["Tech"],
        experienceLevel: "Research/Expert",
        projects: "Published a paper on novel transformer architectures at NeurIPS. Link: https://arxiv.org/abs/1706.03762. Implemented a distributed training framework for large language models. GitHub: https://github.com/example/dist-train",
        techQuestionChoice: 'b',
        techQuestionAnswer: "Transformers use self-attention to process all tokens in a sequence simultaneously, allowing for parallelization and capturing long-range dependencies. RNNs process sequences token-by-token, maintaining a hidden state, which makes them prone to vanishing gradients and less efficient for long sequences.",
        motivation: "I am passionate about pushing the boundaries of AI and believe my research experience can contribute significantly to the club's advanced projects. I want to mentor junior members and foster a culture of innovation.",
        skills: { python: 'Expert', cpp: 'Comfortable', javascript: 'Basic', java: 'None', r: 'None', figma: 'None', photoshop: 'None', illustrator: 'None', afterEffects: 'None', projectManagement: 'None', publicSpeaking: 'None', contentWriting: 'None', eventManagement: 'None' },
      },
      {
        fullName: "Brenda Laurel",
        usn: "23BTDES002",
        department: "Interaction Design",
        year: "2nd Year",
        email: "brenda.laurel@college.edu",
        phone: "2222222222",
        roles: ["Design", "Public Relations"],
        experienceLevel: "Advanced",
        projects: "Designed a full mobile app for a local startup, including user flow, wireframes, and high-fidelity mockups in Figma. Behance portfolio: https://www.behance.net/example",
        designQuestionChoice: 'b',
        designQuestionAnswer: "For Spotify, I would improve the podcast discovery feature. Currently, it's heavily skewed towards popular shows. I'd introduce a 'community playlist' for podcasts, allowing users to create and share themed episode lists. This would improve discoverability for niche content through social curation.",
        publicRelationsQuestionChoice: 'b',
        publicRelationsQuestionAnswer: "Headline: Turing Club Launches 'AI for All' Workshop Series to Demystify Artificial Intelligence for Students. The series will feature hands-on coding sessions and expert talks, making AI accessible to all disciplines.",
        motivation: "I believe great technology needs great design to be effective. I want to help the Turing Club create beautiful, intuitive interfaces for its projects and build a strong visual brand.",
        skills: { figma: 'Expert', photoshop: 'Comfortable', contentWriting: 'Comfortable', python: 'None', cpp: 'None', java: 'None', javascript: 'None', r: 'None', illustrator: 'None', afterEffects: 'None', projectManagement: 'None', publicSpeaking: 'None', eventManagement: 'None' },
      },
      {
        fullName: "Charles Babbage",
        usn: "23BTOPS003",
        department: "Mechanical Engineering",
        year: "3rd Year",
        email: "charles.babbage@college.edu",
        phone: "3333333333",
        roles: ["Operations", "Outreach"],
        experienceLevel: "Intermediate",
        projects: "Organized a department-level technical fest for 500+ attendees. Managed budget, logistics, and a team of 20 volunteers. I also secured two corporate sponsorships for the event.",
        operationsQuestionChoice: 'a',
        operationsQuestionAnswer: "For a 100-person workshop, I'd start with a detailed budget covering venue, materials, speaker fees, and marketing. I'd use Trello for task management, assign owners for each vertical (logistics, marketing, content), and set clear deadlines. For feedback, I'd use a QR code at the end linking to a Google Form, incentivizing responses with a chance to win swag.",
        outreachQuestionChoice: 'a',
        outreachQuestionAnswer: "Building relationships requires consistent engagement. I'd propose joint events, a shared newsletter segment, and regular meetings with leaders of other clubs. For long-term health, we need to show mutual value, not just ask for things.",
        motivation: "I excel at making things happen and bringing people together. I want to apply my organizational and networking skills to help the Turing Club grow its impact and run smoothly.",
        skills: { projectManagement: 'Expert', eventManagement: 'Comfortable', publicSpeaking: 'Comfortable', python: 'None', cpp: 'None', java: 'None', javascript: 'None', r: 'None', figma: 'None', photoshop: 'None', illustrator: 'None', afterEffects: 'None', contentWriting: 'None' },
      },
      {
        fullName: "Grace Hopper",
        usn: "23BTBEG004",
        department: "Computer Science & Engineering",
        year: "1st Year",
        email: "grace.hopper@college.edu",
        phone: "4444444444",
        roles: ["Tech", "Operations"],
        experienceLevel: "Beginner",
        projects: "Completed the CS50 course and built a small web-based calculator using HTML, CSS, and JavaScript. It's simple, but I'm proud of it! GitHub: https://github.com/example/calculator",
        techQuestionChoice: 'a',
        techQuestionAnswer: "Overfitting is when a model learns the training data too well, including the noise, so it performs poorly on new, unseen data. To fight it, you can use techniques like getting more data, data augmentation, regularization (like L1/L2), or dropout, which randomly turns off neurons during training to prevent co-dependency.",
        operationsQuestionChoice: 'b',
        operationsQuestionAnswer: "First, don't panic. I would immediately contact my team lead. While they handle communication with the audience, I'd access our pre-compiled list of backup local speakers and start making calls. We could also quickly pivot to a panel discussion with existing speakers if a replacement isn't found.",
        motivation: "I'm new to AI but I'm a fast learner and incredibly excited about the field. I'm eager to contribute in any way I can, learn from senior members, and I'm not afraid to take on the less glamorous tasks that are essential to keep the club running.",
        skills: { python: 'Basic', javascript: 'Basic', projectManagement: 'Basic', cpp: 'None', java: 'None', r: 'None', figma: 'None', photoshop: 'None', illustrator: 'None', afterEffects: 'None', publicSpeaking: 'None', contentWriting: 'None', eventManagement: 'None' },
      }
    ];

    try {
      const collectionRef = collection(firestore, 'artifacts', firebaseConfig.appId, 'public', 'data', 'recruitment_applications');
      const addPromises = dummyApplications.map(app => {
        return addDoc(collectionRef, {
          ...app,
          userId: user.uid,
          createdAt: serverTimestamp(),
          status: 'pending'
        });
      });
      await Promise.all(addPromises);

      toast({
        title: 'Dummy Data Added',
        description: `Successfully added ${dummyApplications.length} applications.`,
      });
    } catch (error) {
      console.error("Error adding dummy data:", error);
      toast({
        variant: 'destructive',
        title: 'Adding Data Failed',
        description: 'An error occurred while adding dummy applications.',
      });
    } finally {
      setIsAddingData(false);
    }
  };

  const handleRankCandidates = async () => {
    setIsRanking(true);
    const result = await getRankedCandidates(initialApplications);
    if (result.success && result.data) {
      const rankingMap = new Map<string, RankedCandidate>();
      result.data.forEach(rank => rankingMap.set(rank.usn, rank));

      setRankedApplications(prev =>
        prev.map(app => {
          const rank = rankingMap.get(app.usn);
          return rank ? { ...app, rankingScore: rank.rankingScore, reasoning: rank.reasoning } : app;
        })
      );
      
      setSortKey('rankingScore');
      setSortDirection('desc');
      toast({
        title: "Ranking Complete",
        description: "Candidates have been ranked by AI.",
      });
    } else {
      toast({
        variant: 'destructive',
        title: "Ranking Failed",
        description: result.error || "An unknown error occurred.",
      });
    }
    setIsRanking(false);
  };
  
  const handleClearData = async () => {
    if (!firestore || initialApplications.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not clear data. Database not available or no applications to clear.',
      });
      return;
    }
    setIsDeleting(true);
    try {
      const deletePromises = initialApplications.map(app => {
        const docRef = doc(firestore, 'artifacts', firebaseConfig.appId, 'public', 'data', 'recruitment_applications', app.id);
        return deleteDoc(docRef);
      });
      await Promise.all(deletePromises);
      toast({
        title: 'Data Cleared',
        description: `Successfully deleted ${initialApplications.length} applications.`,
      });
    } catch (error) {
      console.error("Error clearing data:", error);
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: 'An error occurred while clearing the applications.',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const filteredAndSortedApplications = useMemo(() => {
    let apps = [...rankedApplications];
    
    if (searchTerm) {
      apps = apps.filter(app => 
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.usn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    apps.sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if(sortKey === 'createdAt') {
        valA = a.createdAt?.seconds || 0;
        valB = b.createdAt?.seconds || 0;
      }
      
      if (valA === undefined) valA = -1;
      if (valB === undefined) valB = -1;

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return apps;
  }, [rankedApplications, searchTerm, sortKey, sortDirection]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const SortButton = ({ K, label }: { K: SortKey, label: string}) => (
    <Button variant={sortKey === K ? 'secondary' : 'ghost'} onClick={() => toggleSort(K)}>
        {label}
        {sortKey === K && (sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
    </Button>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Database className="text-primary" />
          Application Dashboard
        </h2>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Button
            onClick={handleAddDummyData}
            disabled={isAddingData || applicationsLoading}
            variant="outline"
          >
            {isAddingData ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <TestTube className="mr-2 h-4 w-4" />
            )}
            Add Dummy Data
          </Button>
          <Button
            onClick={handleRankCandidates}
            disabled={isRanking || applicationsLoading || initialApplications.length === 0}
            variant="outline"
          >
            {isRanking ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
            )}
            {isRanking ? 'Ranking...' : 'Rank Candidates with AI'}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting || applicationsLoading || initialApplications.length === 0}
          >
            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Clear Data
          </Button>
          <Button onClick={onExit} variant="link">Exit Admin</Button>
        </div>
      </div>
      
      <div className="mb-6 bg-card p-4 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                      placeholder="Search by name, USN, role..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <div className="col-span-2 flex items-center justify-start md:justify-end gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <SortButton K="createdAt" label="Date Submitted" />
                <SortButton K="rankingScore" label="AI Score" />
              </div>
          </div>
      </div>

      {applicationsLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : filteredAndSortedApplications.length === 0 ? (
        <div className="text-center p-12 bg-card rounded-xl border border-dashed text-muted-foreground">
          {searchTerm ? 'No applications match your search.' : 'No applications received yet.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedApplications.map(app => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all {initialApplications.length} applications from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearData}
              disabled={isDeleting}
              className={buttonVariants({ variant: "destructive" })}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isDeleting ? 'Deleting...' : 'Yes, delete all'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    