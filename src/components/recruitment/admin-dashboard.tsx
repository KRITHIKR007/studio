'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, Database, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApplicationCard } from './application-card';
import { useApplications } from '@/hooks/use-applications';
import { getRankedCandidates } from '@/lib/actions';
import type { Application, RankedCandidate } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

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

  useEffect(() => {
    setRankedApplications(initialApplications);
  }, [initialApplications]);

  const handleRankCandidates = async () => {
    setIsRanking(true);
    const result = await getRankedCandidates();
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
        <div className="flex items-center gap-2">
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
    </div>
  );
}
