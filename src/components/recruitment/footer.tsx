import React from 'react';
import { Globe, Users, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    {/* Brand & Mission */}
                    <div className="space-y-6">
                        <div className="text-xl font-black tracking-tighter text-slate-900 group cursor-default">
                            THE TURING <span className="text-primary group-hover:animate-pulse">CLUB</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-medium">
                            A startup-style ecosystem dedicated to identifying and nurturing the most talented student developers and designers. Engineering the Unknown.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://theturingclub.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                            >
                                <Globe size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Developers */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Engineering Team</h4>
                        <div className="space-y-4">
                            <div className="group">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">Primary Head</p>
                                <p className="text-slate-900 font-bold">Krithik.R</p>
                            </div>
                            <div className="group">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">Secondary Head</p>
                                <p className="text-slate-900 font-bold">Sahil Patil</p>
                            </div>
                        </div>
                    </div>

                    {/* Action */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">External Pulse</h4>
                        <div className="space-y-4">
                            <a
                                href="https://theturingclub.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-slate-500 hover:text-primary transition-colors group"
                            >
                                <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-primary/10 transition-colors">
                                    <Globe size={16} />
                                </div>
                                <span className="text-sm font-bold">Main Identity Node</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        &copy; 2026 THE TURING CLUB SYSTEMS. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Made with <Heart size={10} className="text-red-500 fill-red-500 animate-pulse" /> for the next generation
                    </div>
                </div>
            </div>
        </footer>
    );
}
