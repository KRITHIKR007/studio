'use client';

import React from 'react';
import Image from 'next/image';
import { Lock, Menu, X, Home, Users, Rocket, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo/logo.jpg';
import { cn } from '@/lib/utils';

interface NavbarProps {
    onAdminClick: () => void;
    onLogoClick: () => void;
    onSectionClick?: (section: string) => void;
}

export function Navbar({ onAdminClick, onLogoClick, onSectionClick }: NavbarProps) {
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                isScrolled
                    ? "py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm"
                    : "py-6 bg-transparent border-b border-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo & Brand */}
                <div
                    className="flex items-center gap-3 group cursor-pointer"
                    onClick={onLogoClick}
                >
                    <div className="relative w-10 h-10 transition-transform duration-500 group-hover:scale-110">
                        <Image
                            src={logo}
                            alt="The Turing Club Logo"
                            fill
                            className="object-contain mix-blend-multiply"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-extrabold text-xl tracking-tight leading-none text-slate-900">THE TURING <span className="text-primary">CLUB</span></span>
                        <span className="text-[9px] font-black tracking-[0.25em] text-slate-400 uppercase">Engineering Elite</span>
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {[
                        { name: 'Home', section: 'home', icon: Home },
                        { name: 'About', section: 'about', icon: Info },
                        { name: 'Roles', section: 'roles', icon: Users },
                        { name: 'Execute', section: 'experience', icon: Rocket },
                    ].map((item) => (
                        <button
                            key={item.name}
                            onClick={() => onSectionClick ? onSectionClick(item.section) : onLogoClick()}
                            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-all duration-300 relative group"
                        >
                            <item.icon size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            <span>{item.name}</span>
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Button
                        onClick={onAdminClick}
                        variant="ghost"
                        size="sm"
                        className="hidden sm:flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl px-4 h-10 border border-slate-200"
                    >
                        <Lock size={14} className="text-primary" />
                        <span className="text-xs font-black uppercase tracking-wider">Gatekeeper</span>
                    </Button>

                    <Button variant="ghost" size="icon" className="md:hidden bg-white border border-slate-100 rounded-xl shadow-sm">
                        <Menu size={20} className="text-slate-600" />
                    </Button>
                </div>
            </div>
        </nav>
    );
}
