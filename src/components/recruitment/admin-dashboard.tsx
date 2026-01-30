'use client';

import React, { useState, useMemo } from 'react';
import { Loader2, Database, Search, ArrowUp, ArrowDown, Download, Trash2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { ApplicationCard } from './application-card';
import { useApplications } from '@/hooks/use-applications';
import { Input } from '@/components/ui/input';
import type { Application } from '@/lib/types';
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
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { writeBatch, doc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

type SortKey = 'createdAt';
type SortDirection = 'asc' | 'desc';

export function AdminDashboard({ onExit }: { onExit: () => void }) {
  const { applications: initialApplications, loading: applicationsLoading } = useApplications();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const filteredAndSortedApplications: Application[] = useMemo(() => {
    let apps = [...initialApplications];
    
    if (searchTerm) {
      apps = apps.filter(app => 
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.usn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    apps.sort((a, b) => {
      let valA, valB;

      if (sortKey === 'createdAt') {
        valA = a.createdAt?.seconds || 0;
        valB = b.createdAt?.seconds || 0;
      } else {
        valA = a[sortKey as keyof Application] || '';
        valB = b[sortKey as keyof Application] || '';
      }
      
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return apps;
  }, [initialApplications, searchTerm, sortKey, sortDirection]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };
  
  const handleDownloadCsv = () => {
    if (filteredAndSortedApplications.length === 0) {
      return;
    }

    const skillHeaders = [
        'python', 'cpp', 'java', 'javascript', 'r', 'figma', 'photoshop',
        'illustrator', 'afterEffects', 'projectManagement', 'publicSpeaking',
        'contentWriting', 'eventManagement'
    ];

    const headers = [
      'ID', 'Full Name', 'USN', 'Department', 'Year', 'Email', 'Phone',
      'Roles', 'Experience Level', 'Motivation', 'Projects', 'Status', 'Submitted At',
      'Tech Question Choice', 'Tech Question Answer',
      'Design Question Choice', 'Design Question Answer',
      'Operations Question Choice', 'Operations Question Answer',
      'Public Relations Question Choice', 'Public Relations Question Answer',
      'Outreach Question Choice', 'Outreach Question Answer',
      ...skillHeaders
    ];
    
    const escapeCsvCell = (cellData: any) => {
        if (cellData === null || cellData === undefined) {
            return '';
        }
        const stringData = String(cellData);
        // If the string contains a comma, newline, or double quote, wrap it in double quotes.
        if (stringData.includes('"') || stringData.includes(',') || stringData.includes('\n') || stringData.includes('\r')) {
            // Escape any existing double quotes by doubling them.
            return `"${stringData.replace(/"/g, '""')}"`;
        }
        return stringData;
    };

    const csvRows = [headers.join(',')];

    filteredAndSortedApplications.forEach(app => {
      const skillsData = skillHeaders.map(skill => app.skills?.[skill as keyof typeof app.skills] || 'None');
      
      const row = [
        app.id,
        app.fullName,
        app.usn,
        app.department,
        app.year,
        app.email,
        app.phone,
        app.roles.join(' | '),
        app.experienceLevel,
        app.motivation,
        app.projects,
        app.status,
        app.createdAt ? new Date(app.createdAt.seconds * 1000).toISOString() : '',
        app.techQuestionChoice,
        app.techQuestionAnswer,
        app.designQuestionChoice,
        app.designQuestionAnswer,
        app.operationsQuestionChoice,
        app.operationsQuestionAnswer,
        app.publicRelationsQuestionChoice,
        app.publicRelationsQuestionAnswer,
        app.outreachQuestionChoice,
        app.outreachQuestionAnswer,
        ...skillsData
      ].map(escapeCsvCell);
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `turing-club-applications-${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleClearData = async () => {
    if (!firestore || initialApplications.length === 0) return;

    setIsClearing(true);
    try {
      // Firestore limits batch writes to 500 documents.
      // If you expect more, this would need to be split into multiple batches.
      const batch = writeBatch(firestore);
      initialApplications.forEach(app => {
        const docRef = doc(firestore, 'artifacts', firebaseConfig.appId, 'public', 'data', 'recruitment_applications', app.id);
        batch.delete(docRef);
      });
      await batch.commit();
      toast({
        title: 'Success',
        description: 'All application data has been cleared.',
      });
    } catch (error) {
      console.error("Error clearing data: ", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not clear application data. Please try again.',
      });
    } finally {
      setIsClearing(false);
      setShowClearConfirm(false);
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
        <div className="flex items-center gap-2">
          <Button onClick={handleDownloadCsv} variant="outline" disabled={applicationsLoading || filteredAndSortedApplications.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Download CSV
          </Button>
          <Button onClick={() => setShowClearConfirm(true)} variant="destructive" disabled={applicationsLoading || initialApplications.length === 0}>
              <Trash2 className="mr-2 h-4 w-4" />
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

      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              {initialApplications.length > 0 && ` ${initialApplications.length}`} applications from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearData} disabled={isClearing} className={buttonVariants({ variant: "destructive" })}>
              {isClearing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              {isClearing ? 'Clearing...' : 'Yes, Clear Data'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
