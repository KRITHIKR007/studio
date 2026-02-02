'use client';

import React from 'react';

interface FormSectionProps {
    id: string;
    title: string;
    description: string;
    children: React.ReactNode;
    index: number;
}

export function FormSection({ id, title, description, children, index }: FormSectionProps) {
    return (
        <section id={id} className="py-20 first:pt-32 last:pb-32">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-start gap-6 mb-10 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl primary-gradient flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                        {index}
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-gradient">{title}</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="glass p-8 md:p-12 rounded-3xl animate-glow relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}
