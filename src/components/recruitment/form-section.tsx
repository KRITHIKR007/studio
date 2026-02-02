'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface FormSectionProps {
    id: string;
    title: string;
    description: string;
    children: React.ReactNode;
    index: number;
}

export function FormSection({ id, title, description, children, index }: FormSectionProps) {
    return (
        <section id={id} className="py-24 first:pt-10 scroll-mt-32">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-start gap-8 mb-12 group">
                    <div className="flex-shrink-0 w-16 h-16 rounded-3xl primary-gradient flex items-center justify-center font-black text-2xl text-white shadow-2xl shadow-primary/30 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-700">
                        {index.toString().padStart(2, '0')}
                    </div>
                    <div className="space-y-3 pt-2">
                        <h2 className="text-4xl font-black tracking-tight text-slate-900 leading-none">
                            {title}
                        </h2>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl border-l-4 border-primary/20 pl-6">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-8 md:p-14 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group/content transition-all duration-700 hover:shadow-primary/5">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/[0.02] rounded-full blur-[100px] -mr-48 -mt-48 group-hover/content:bg-primary/[0.04] transition-colors duration-700" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/[0.01] rounded-full blur-[80px] -ml-32 -mb-32" />

                    <div className="relative z-10 transition-transform duration-500">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}
