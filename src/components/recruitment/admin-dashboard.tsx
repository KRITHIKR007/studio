'use client';

import React, { useState, useMemo } from 'react';
import { Loader2, Database, Search, ArrowUp, ArrowDown, Download, Trash2, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { Navbar } from './navbar';

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
    if (filteredAndSortedApplications.length === 0) return;

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
      if (cellData === null || cellData === undefined) return '';
      const stringData = String(cellData);
      if (stringData.includes('"') || stringData.includes(',') || stringData.includes('\n') || stringData.includes('\r')) {
        return `"${stringData.replace(/"/g, '""')}"`;
      }
      return stringData;
    };

    const csvRows = [headers.join(',')];

    filteredAndSortedApplications.forEach(app => {
      const skillsData = skillHeaders.map(skill => app.skills?.[skill as keyof typeof app.skills] || 'None');
      const row = [
        app.id, app.fullName, app.usn, app.department, app.year, app.email, app.phone,
        app.roles.join(' | '), app.experienceLevel, app.motivation, app.projects, app.status,
        app.createdAt ? new Date(app.createdAt.seconds * 1000).toISOString() : '',
        app.techQuestionChoice, app.techQuestionAnswer,
        app.designQuestionChoice, app.designQuestionAnswer,
        app.operationsQuestionChoice, app.operationsQuestionAnswer,
        app.publicRelationsQuestionChoice, app.publicRelationsQuestionAnswer,
        app.outreachQuestionChoice, app.outreachQuestionAnswer,
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
    link.setAttribute('download', `the-turing-club-applications-${date}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = async () => {
    if (!firestore || initialApplications.length === 0) return;
    setIsClearing(true);
    try {
      const batch = writeBatch(firestore);
      initialApplications.forEach(app => {
        const docRef = doc(firestore, 'artifacts', firebaseConfig.appId, 'public', 'data', 'recruitment_applications', app.id);
        batch.delete(docRef);
      });
      await batch.commit();
      toast({ title: 'Success', description: 'All application data has been cleared.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not clear data.' });
    } finally {
      setIsClearing(false);
      setShowClearConfirm(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: initialApplications.length,
      tech: initialApplications.filter(a => a.roles.includes('Tech')).length,
      design: initialApplications.filter(a => a.roles.includes('Design')).length,
      ops: initialApplications.filter(a => a.roles.includes('Operations')).length,
      impact: initialApplications.filter(a => (a.experienceLevel === 'Advanced' || a.experienceLevel === 'Pro')).length,
    };
  }, [initialApplications]);

  return (
    <div className="min-h-screen bg-[#f8fafc] selection:bg-primary/10 selection:text-primary">
      <Navbar onAdminClick={() => { }} onLogoClick={onExit} />

      {/* Neural Core Background Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[5%] w-[30%] h-[30%] bg-primary/[0.03] blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-blue-500/[0.03] blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">

        {/* Elite Stat Matrix */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {[
            { label: 'Total Identities', value: stats.total, color: 'slate' },
            { label: 'Tech Sector', value: stats.tech, color: 'primary' },
            { label: 'Design Ops', value: stats.design, color: 'blue' },
            { label: 'Operational', value: stats.ops, color: 'indigo' },
            { label: 'High Impact', value: stats.impact, color: 'emerald' },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 group-hover:text-slate-600 transition-colors">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
              </div>
              <div className={cn(
                "absolute -right-2 -bottom-2 w-16 h-16 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity",
                stat.color === 'primary' ? 'bg-primary' :
                  stat.color === 'blue' ? 'bg-blue-500' :
                    stat.color === 'indigo' ? 'bg-indigo-500' :
                      stat.color === 'emerald' ? 'bg-emerald-500' : 'bg-slate-500'
              )} />
            </div>
          ))}
        </div>

        {/* Intelligence Control Header */}
        <div className="bg-white border border-slate-100 rounded-[3.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/40 mb-10 relative overflow-hidden group/header">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/[0.02] rounded-full blur-3xl -mr-48 -mt-48 transition-transform duration-1000 group-hover/header:scale-110" />

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-[1.5rem] bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-900/20 rotate-3 group-hover/header:rotate-0 transition-transform duration-500">
                  <Database size={28} />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Intelligence Center</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Neural Link Active • {stats.total} Identities Synced
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <Button
                onClick={handleDownloadCsv}
                variant="outline"
                className="h-14 px-8 rounded-2xl border-slate-200 font-black text-slate-600 hover:bg-slate-50 gap-2 flex-1 lg:flex-none transition-all hover:scale-[1.02] active:scale-[0.98]"
                disabled={applicationsLoading || filteredAndSortedApplications.length === 0}
              >
                <Download size={18} /> Export Intel
              </Button>
              <Button
                onClick={() => setShowClearConfirm(true)}
                className="h-14 px-8 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 border-none font-black gap-2 flex-1 lg:flex-none transition-all hover:scale-[1.02] active:scale-[0.98]"
                disabled={applicationsLoading || initialApplications.length === 0}
              >
                <Trash2 size={18} /> Wipe Memory
              </Button>
              <Button
                onClick={onExit}
                variant="ghost"
                className="h-14 px-8 rounded-2xl font-black text-slate-400 hover:text-slate-900 gap-2 hover:bg-slate-50"
              >
                <X size={18} /> Disconnect
              </Button>
            </div>
          </div>
        </div>

        {/* Global Search Interface */}
        <div className="mb-10 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={22} />
            <Input
              placeholder="Search by identity, sector, or USN code..."
              className="h-16 pl-16 pr-8 bg-white border-slate-100 rounded-3xl shadow-sm focus:border-primary/20 focus:ring-[6px] focus:ring-primary/5 transition-all text-slate-800 font-bold text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 p-2 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="px-5 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-r border-slate-100">
              <Filter size={14} /> Sort Core
            </div>
            <Button
              variant="ghost"
              onClick={() => toggleSort('createdAt')}
              className={cn(
                "h-12 px-6 rounded-2xl text-xs font-black gap-2 transition-all",
                sortKey === 'createdAt' ? "bg-slate-900 text-white shadow-xl rotate-1" : "text-slate-500 hover:text-slate-900"
              )}
            >
              Temporal Stamp
              {sortKey === 'createdAt' && (sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}
            </Button>
          </div>
        </div>

        {/* Neural Transmission Feed */}
        {applicationsLoading ? (
          <div className="flex flex-col items-center justify-center p-40 space-y-6">
            <div className="relative">
              <Loader2 className="animate-spin text-primary" size={64} />
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Syncing Database Core...</p>
          </div>
        ) : filteredAndSortedApplications.length === 0 ? (
          <div className="text-center p-40 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 mb-8">
              <Search size={48} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Zero Transmissions Detected</h3>
            <p className="text-slate-500 font-bold">The search parameters returned no identifiable results.</p>
            <Button
              variant="link"
              onClick={() => setSearchTerm('')}
              className="mt-6 text-primary font-black uppercase tracking-widest text-xs"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {filteredAndSortedApplications.map((app, i) => (
              <div
                key={app.id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <ApplicationCard application={app} />
              </div>
            ))}
          </div>
        )}

        {/* Modals and Overlays */}
        <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
          <AlertDialogContent className="rounded-[3rem] border-none p-12 shadow-2xl max-w-lg">
            <AlertDialogHeader className="space-y-6 text-center">
              <div className="w-20 h-20 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
                <Trash2 size={40} />
              </div>
              <div className="space-y-2">
                <AlertDialogTitle className="text-3xl font-black text-slate-900 tracking-tight">System Purge Protocol</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-500 font-bold leading-relaxed text-base">
                  WARNING: This action will permanently erase all candidate records from the Neural Core. This implementation is non-recoverable.
                </AlertDialogDescription>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3 mt-12 flex-col sm:flex-row">
              <AlertDialogCancel className="h-16 flex-1 rounded-2xl border-slate-200 font-black text-slate-500 hover:bg-slate-50 transition-all">Abort Protocol</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearData}
                disabled={isClearing}
                className="h-16 flex-1 rounded-2xl bg-red-600 text-white hover:bg-red-700 font-black border-none shadow-xl shadow-red-600/20 transition-all hover:scale-[1.02]"
              >
                {isClearing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Trash2 size={20} className="mr-2" />}
                {isClearing ? 'Purging Core...' : 'Execute Wipe'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
