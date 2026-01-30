'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Send, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { applicationSchema, type ApplicationSchema } from '@/lib/schema';
import { Step1PersonalDetails } from './step1-personal-details';
import { Step2RoleAndSkills } from './step2-role-and-skills';
import { Step3Experience } from './step3-experience';
import { SubmissionSuccess } from './submission-success';
import { AdminDashboard } from './admin-dashboard';
import { ProgressStepper } from './progress-stepper';
import { useToast } from '@/hooks/use-toast';
import { signInAnonymously } from 'firebase/auth';
import { useAuth, useUser, useFirestore, FirestorePermissionError, errorEmitter } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import Image from 'next/image';
import logo from '@/assets/logo/logo.jpg';
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


export function RecruitmentPortalClient() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [validatedData, setValidatedData] = useState<ApplicationSchema | null>(null);
  const { toast } = useToast();

  const methods = useForm<ApplicationSchema>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: '',
      usn: '',
      department: 'CSE',
      year: '1st Year',
      phone: '',
      email: '',
      roles: [],
      experienceLevel: '',
      projects: '',
      techQuestionChoice: 'a',
      techQuestionAnswer: '',
      motivation: '',
      skills: {
        python: 'None',
        cpp: 'None',
        java: 'None',
        javascript: 'None',
        r: 'None',
        figma: 'None',
        photoshop: 'None',
        illustrator: 'None',
        afterEffects: 'None',
        projectManagement: 'None',
        publicSpeaking: 'None',
        contentWriting: 'None',
        eventManagement: 'None',
      },
      designQuestionChoice: 'a',
      designQuestionAnswer: '',
      operationsQuestionChoice: 'a',
      operationsQuestionAnswer: '',
      outreachQuestionChoice: 'a',
      outreachQuestionAnswer: '',
      publicRelationsQuestionChoice: 'a',
      publicRelationsQuestionAnswer: '',
    },
  });

  useEffect(() => {
    if (auth && !user && !isUserLoading) {
        signInAnonymously(auth).catch((error) => {
        console.error("Anonymous sign-in failed:", error);
        toast({
            variant: 'destructive',
            title: "Authentication Error",
            description: "Could not connect to the service. Please refresh the page.",
        });
        });
    }
  }, [auth, user, isUserLoading, toast]);


  const nextStep = async () => {
    const fieldsToValidate: (keyof ApplicationSchema)[][] = [
        ['fullName', 'usn', 'department', 'year', 'email', 'phone'],
        ['roles']
    ];
    
    const fieldsForStep = fieldsToValidate[step-1] || [];
    const isValid = await methods.trigger(fieldsForStep as any);

    if (isValid) {
      setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const onSubmit = async (data: ApplicationSchema) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: "Not Authenticated",
        description: "Please refresh the page and try again.",
      });
      return;
    }
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Database not available',
        description: 'Please refresh and try again.',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const validation = applicationSchema.safeParse(data);
    if (!validation.success) {
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Validation Failed",
        description: "Please check your form for errors.",
      });
      console.error("Validation error on submit", validation.error.flatten());
      return;
    }

    try {
      const collectionRef = collection(firestore, 'artifacts', firebaseConfig.appId, 'public', 'data', 'recruitment_applications');
      
      await addDoc(collectionRef, {
        ...validation.data,
        userId: user.uid,
        createdAt: serverTimestamp(),
        status: 'pending'
      });

      setIsSubmitting(false);
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error: any) {
      setIsSubmitting(false);
      const collectionRef = collection(firestore, 'artifacts', firebaseConfig.appId, 'public', 'data', 'recruitment_applications');
      const permissionError = new FirestorePermissionError({
        path: collectionRef.path,
        operation: 'create',
        requestResourceData: validation.data,
      });
      errorEmitter.emit('permission-error', permissionError);
      
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Could not save your application. Please try again.",
      });
    }
  };
  
  const handlePreSubmit = (data: ApplicationSchema) => {
    setValidatedData(data);
    setShowConfirmDialog(true);
  };

  const handleConfirmedSubmit = async () => {
    if (validatedData) {
      await onSubmit(validatedData);
    }
    setShowConfirmDialog(false);
  };

  if (isUserLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  if (showAdmin) {
    return <AdminDashboard onExit={() => setShowAdmin(false)} />;
  }

  if (submitted) {
    return <SubmissionSuccess onReset={() => {
        setSubmitted(false);
        setStep(1);
        methods.reset();
    }} />;
  }

  const steps = [
    <Step1PersonalDetails />,
    <Step2RoleAndSkills />,
    <Step3Experience />,
  ];

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <header className="mb-8 text-center space-y-2 relative">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-4 border border-primary/20">
          <Image
            src={logo}
            alt="Turing Club Logo"
            width="64"
            height="64"
            className="rounded-full"
          />
          <span className="font-bold text-primary tracking-wider ml-2">TURING CLUB RECRUITMENT 2025</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Turing Club Application</h1>
        <Button
          onClick={() => setShowAdmin(true)}
          className="absolute top-0 right-0"
          variant="ghost"
          size="icon"
          title="Admin Login"
        >
          <Lock size={16} />
        </Button>
      </header>
      
      <ProgressStepper step={step} totalSteps={3} />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handlePreSubmit)} className="mb-12">
          <div className="animate-fade-in">{steps[step - 1]}</div>

          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              variant="outline"
              className={`transition-opacity ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <ChevronLeft size={18} className="mr-1" /> Back
            </Button>

            {step < 3 ? (
              <Button type="button" onClick={nextStep}>
                Next Step <ChevronRight size={18} className="ml-1" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting || isUserLoading}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send size={16} className="mr-2" />}
                {isSubmitting ? 'Saving...' : 'Submit Application'}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your application? You won't be able to make changes after this.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmedSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <footer className="text-center text-muted-foreground text-sm pb-8">
        &copy; 2025 Turing Club. Securely powered by Firebase.
      </footer>
    </div>
  );
}
