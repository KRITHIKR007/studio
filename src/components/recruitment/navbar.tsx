'use client';

import React from 'react';
import Image from 'next/image';
import { Lock, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo/logo.jpg';

interface NavbarProps {
    onAdminClick: () => void;
}

export function Navbar({ onAdminClick }: NavbarProps) {
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3 glass-darker border-b' : 'py-6 bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="relative overflow-hidden rounded-full w-10 h-10 border border-white/20 group-hover:border-primary/50 transition-colors">
                        <Image
                            src={logo}
                            alt="Turing Club Logo"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-lg tracking-tight leading-none text-gradient">TURING CLUB</span>
                        <span className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">Recruitment 2025</span>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#personal" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Personal</a>
                    <a href="#roles" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Roles</a>
                    <a href="#experience" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Experience</a>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={onAdminClick}
                        variant="ghost"
                        size="sm"
                        className="hidden sm:flex items-center gap-2 hover:bg-white/5 border border-transparent hover:border-white/10"
                    >
                        <Lock size={14} className="text-primary" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Admin Portal</span>
                    </Button>

                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu size={20} />
                    </Button>
                </div>
            </div>
        </nav>
    );
}
