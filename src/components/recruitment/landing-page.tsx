'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Code, Palette, Users, Zap, Terminal, Globe, Rocket } from 'lucide-react';
import Image from 'next/image';
import logo from '@/assets/logo/logo.jpg';

interface LandingPageProps {
    onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
    return (
        <div id="home" className="relative overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 md:pt-32 md:pb-48">
                <div className="container px-4 mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold tracking-wider text-primary uppercase mb-8 animate-fade-in">
                        <Zap size={14} className="fill-primary" />
                        Recruitment Phase 2025 is Live
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tight text-slate-900 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        Engineering the <br />
                        <span className="text-gradient">Unknown.</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 mb-12 animate-fade-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
                        The Turing Club is where visionaries, architects, and creators converge to build the future of technology. Join our elite engineering community.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <Button
                            onClick={onStart}
                            size="lg"
                            className="h-14 px-10 rounded-2xl primary-gradient text-lg font-bold shadow-xl shadow-primary/25 hover:scale-105 transition-transform"
                        >
                            Apply to the Club <ChevronRight size={20} className="ml-2" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-14 px-10 rounded-2xl border-slate-200 text-lg font-semibold hover:bg-slate-50 transition-colors"
                            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Explore Mission
                        </Button>
                    </div>
                </div>

                {/* Floating Code Snippet / UI Element for Aesthetic */}
                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-3xl rounded-full" />
                <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full" />
            </section>

            {/* About Section */}
            <section id="about" className="py-24 bg-white border-y border-slate-100">
                <div className="container px-4 mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Our Mission
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                                Beyond Code. <br />
                                Beyond Design.
                            </h2>
                            <p className="text-lg text-slate-500 leading-relaxed">
                                The Turing Club is not just another technical community. We are a startup-style ecosystem dedicated to identifying and nurturing the most talented student developers and designers.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <Rocket size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Impact First</h4>
                                        <p className="text-sm text-slate-500">We build software that solves real-world problems.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
                                        <Globe size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Global Network</h4>
                                        <p className="text-sm text-slate-500">Connect with industry leaders and global innovators.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="glass p-8 rounded-3xl relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="space-y-4 font-mono text-sm">
                                    <p className="text-primary">const turingClub = &#123;</p>
                                    <p className="pl-6 text-slate-600">innovation: true,</p>
                                    <p className="pl-6 text-slate-600">design: "fluid",</p>
                                    <p className="pl-6 text-slate-600">member: "elite",</p>
                                    <p className="pl-6 text-slate-600">motto: "Engineering the Unknown"</p>
                                    <p className="text-primary">&#125;;</p>
                                    <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                                        <div className="px-2 py-1 rounded bg-slate-100 text-xs text-slate-400">READY</div>
                                        <div className="px-2 py-1 rounded bg-primary/10 text-xs text-primary font-bold">LIVE</div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-3xl -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Roles Section */}
            <section id="roles" className="py-24 bg-[#f8fafc]">
                <div className="container px-4 mx-auto text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Choose Your Path</h2>
                    <p className="text-slate-500 max-w-xl mx-auto">We are looking for individuals who are passionate about their craft, regardless of their background.</p>
                </div>

                <div className="container px-4 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Tech", icon: Code, desc: "Build robust backends and stunning frontends." },
                            { title: "Design", icon: Palette, desc: "Craft intuitive UI and visual identities." },
                            { title: "Operations", icon: Users, desc: "Strategize, plan and execute large scale events." },
                            { title: "PR & Marketing", icon: Zap, desc: "Spread our vision and manage the club brand." },
                            { title: "Outreach", icon: Globe, desc: "Collaborate with industry partners and sponsors." }
                        ].map((role, idx) => (
                            <div key={idx} className="group p-8 rounded-3xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <role.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{role.title}</h3>
                                <p className="text-slate-500">{role.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer / CTA */}
            <section id="experience" className="py-24 bg-white">
                <div className="container px-4 mx-auto max-w-4xl text-center">
                    <div className="p-12 md:p-20 rounded-[3rem] bg-slate-900 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] -ml-32 -mb-32" />

                        <div className="relative z-10 space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black text-white">Ready to join?</h2>
                            <p className="text-slate-400 text-lg max-w-xl mx-auto">
                                Applications for the 2025 cohort are closing soon. Don't miss your chance to be part of something legendary.
                            </p>
                            <Button
                                onClick={onStart}
                                size="lg"
                                className="h-16 px-12 rounded-2xl primary-gradient text-xl font-bold hover:scale-105 transition-transform"
                            >
                                Start Application Now
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
