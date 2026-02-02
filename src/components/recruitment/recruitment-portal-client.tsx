'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, ChevronRight, ChevronLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { applicationSchema, type ApplicationSchema } from '@/lib/schema';
import { Step1PersonalDetails } from './step1-personal-details';
import { Step2RoleAndSkills } from './step2-role-and-skills';
import { Step3Experience } from './step3-experience';
import { SubmissionSuccess } from './submission-success';
import { AdminDashboard } from './admin-dashboard';
import { FormSection } from './form-section';
import { Navbar } from './navbar';
import { ProgressStepper } from './progress-stepper';
import { useToast } from '@/hooks/use-toast';
import { signInAnonymously } from 'firebase/auth';
import { useAuth, useUser, useFirestore, FirestorePermissionError, errorEmitter } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
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
import { Input } from '@/components/ui/input';
import { verifyAdminPassword } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { LandingPage } from './landing-page';
import { Footer } from './footer';


export function RecruitmentPortalClient() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [validatedData, setValidatedData] = useState<ApplicationSchema | null>(null);
  const { toast } = useToast();

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const signingInRef = useRef(false);

  const methods = useForm<ApplicationSchema>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: '',
      usn: '',
      department: '',
      year: '',
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
      publicRelationsQuestionChoice: 'a',
      publicRelationsQuestionAnswer: '',
      outreachQuestionChoice: 'a',
      outreachQuestionAnswer: '',
    },
    mode: 'onTouched',
    shouldUnregister: false,
  });

  const formErrors = methods.formState.errors;

  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      console.log('Form Validation Errors:', formErrors);
    }
  }, [formErrors]);

  useEffect(() => {
    if (auth && !user && !isUserLoading && !signingInRef.current) {
      signingInRef.current = true;
      signInAnonymously(auth)
        .then(() => {
          signingInRef.current = false;
        })
        .catch((error) => {
          signingInRef.current = false;
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
    const fieldsToValidate: any = {
      1: ['fullName', 'usn', 'department', 'year', 'phone', 'email'],
      2: ['roles', 'skills'],
      3: ['experienceLevel', 'projects', 'motivation']
    };

    const isStepValid = await methods.trigger(fieldsToValidate[step]);

    if (isStepValid) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast({
        variant: "destructive",
        title: "Incomplete Details",
        description: "Please fill in all required fields before proceeding.",
      });
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = (data: ApplicationSchema) => {
    setValidatedData(data);
    setShowConfirmDialog(true);
  };

  const handleConfirmedSubmit = async () => {
    if (!validatedData) return;

    if (!user) {
      toast({
        variant: 'destructive',
        title: "Not Authenticated",
        description: "Please refresh the page and try again.",
      });
      setShowConfirmDialog(false);
      return;
    }
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Database not available',
        description: 'Please refresh and try again.',
      });
      setShowConfirmDialog(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const collectionRef = collection(firestore, 'artifacts', firebaseConfig.appId, 'public', 'data', 'recruitment_applications');

      await addDoc(collectionRef, {
        ...validatedData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        status: 'pending'
      });

      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error: any) {
      const collectionRef = collection(firestore, 'artifacts', firebaseConfig.appId, 'public', 'data', 'recruitment_applications');
      const permissionError = new FirestorePermissionError({
        path: collectionRef.path,
        operation: 'create',
        requestResourceData: validatedData,
      });
      errorEmitter.emit('permission-error', permissionError);

      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Could not save your application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  const handleAdminLogin = async () => {
    if (isVerifying) return;
    setIsVerifying(true);
    try {
      const isValid = await verifyAdminPassword(adminPassword.trim());
      if (isValid) {
        setShowAdmin(true);
        setShowAdminLogin(false);
        setAdminPassword('');
      } else {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "The password you entered is incorrect.",
        });
        setAdminPassword('');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while verifying the password.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogoClick = () => {
    setShowForm(false);
    setShowAdmin(false);
    setShowAdminLogin(false);
    setStep(1);
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSectionClick = (section: string) => {
    if (showForm || showAdmin || submitted) {
      setShowForm(false);
      setShowAdmin(false);
      setSubmitted(false);
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* View Content Branching */}
      {showAdmin ? (
        <AdminDashboard onExit={() => setShowAdmin(false)} />
      ) : submitted ? (
        <SubmissionSuccess submittedData={validatedData} />
      ) : !showForm ? (
        <div className="bg-white">
          <Navbar
            onAdminClick={() => setShowAdminLogin(true)}
            onLogoClick={handleLogoClick}
            onSectionClick={handleSectionClick}
          />
          <LandingPage onStart={() => setShowForm(true)} />
        </div>
      ) : (
        <>
          <Navbar
            onAdminClick={() => setShowAdminLogin(true)}
            onLogoClick={handleLogoClick}
            onSectionClick={handleSectionClick}
          />

          <div className="max-w-4xl mx-auto px-4 pt-20 pb-24">
            <div className="mb-12 text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold tracking-[0.2em] text-primary uppercase animate-glow">
                Application Workspace
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
                Design your <span className="text-gradient">Legacy</span>
              </h1>
              <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                Fill out the details below to complete your candidate profile. Precision and honesty are key.
              </p>
            </div>

            <div className="mb-12">
              <ProgressStepper step={step} totalSteps={3} />
            </div>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-12">
                <div className="animate-fade-in transition-all duration-500">
                  {step === 1 && (
                    <FormSection
                      id="personal"
                      index={1}
                      title="Candidate Identity"
                      description="Foundational data. Essential for secure communication and identification."
                    >
                      <Step1PersonalDetails />
                    </FormSection>
                  )}
                  {step === 2 && (
                    <FormSection
                      id="roles"
                      index={2}
                      title="Specialization"
                      description="Operational sectors. Define your tactical expertise and role preferences."
                    >
                      <Step2RoleAndSkills />
                    </FormSection>
                  )}
                  {step === 3 && (
                    <FormSection
                      id="experience"
                      index={3}
                      title="Execution Portfolio"
                      description="Strategic evidence. Showcase past implementations and tackle a sector-specific challenge."
                    >
                      <Step3Experience />
                    </FormSection>
                  )}
                </div>

                <div className="pt-8 flex items-center justify-between border-t border-slate-100">
                  <Button
                    type="button"
                    onClick={prevStep}
                    disabled={step === 1}
                    variant="ghost"
                    className={cn(
                      "h-14 px-8 rounded-2xl hover:bg-slate-100 transition-all font-semibold text-slate-600",
                      step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    )}
                  >
                    <ChevronLeft size={20} className="mr-2" /> Previous Step
                  </Button>

                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="h-14 px-10 rounded-2xl primary-gradient text-white hover:opacity-90 transition-all font-bold shadow-lg shadow-primary/25"
                    >
                      Continue Journey <ChevronRight size={20} className="ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting || isUserLoading}
                      className="h-14 px-10 rounded-2xl primary-gradient text-white hover:opacity-90 transition-all font-bold shadow-lg shadow-primary/25 border-none"
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <Send size={18} className="mr-2" />
                      )}
                      {isSubmitting ? 'Transmitting...' : 'Finish Transmission'}
                    </Button>
                  )}
                </div>
              </form>
            </FormProvider>
          </div>
        </>
      )}

      {/* Global Persistence Components */}
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

      <AlertDialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Admin Access</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter the admin password to view the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Manager Authentication Key"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="h-12 bg-white border-slate-200 rounded-xl pr-12 focus:border-primary/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAdminLogin();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAdminPassword('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAdminLogin} disabled={isVerifying}>
              {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isVerifying ? 'Verifying...' : 'Enter'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
