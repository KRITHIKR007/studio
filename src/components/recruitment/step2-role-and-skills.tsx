'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Cpu, Code, Palette, Briefcase, Megaphone, Contact, Sparkles, CheckCircle2 } from 'lucide-react';
import type { ApplicationSchema } from '@/lib/schema';
import { cn } from '@/lib/utils';

const ROLES = [
  { id: "Tech", icon: Code, description: "Build, code and maintain club projects." },
  { id: "Design", icon: Palette, description: "Create visual identities and UI/UX." },
  { id: "Public Relations", icon: Megaphone, description: "Manage communication and brand." },
  { id: "Operations", icon: Briefcase, description: "Coordinate events and logistics." },
  { id: "Outreach", icon: Contact, description: "Connect with partners and sponsors." },
];

const SKILL_GROUPS = {
  technical: {
    roles: ["Tech"],
    skills: ['python', 'cpp', 'java', 'javascript', 'r'] as const,
    icon: Code,
    title: "Technical Stack"
  },
  design: {
    roles: ["Design"],
    skills: ['figma', 'photoshop', 'illustrator', 'afterEffects'] as const,
    icon: Palette,
    title: "Creative Suite"
  },
  pr: {
    roles: ["Public Relations"],
    skills: ['publicSpeaking', 'contentWriting'] as const,
    icon: Megaphone,
    title: "Communication Skills"
  },
  operations: {
    roles: ["Operations"],
    skills: ['projectManagement', 'eventManagement'] as const,
    icon: Briefcase,
    title: "Management Skills"
  },
  outreach: {
    roles: ["Outreach"],
    skills: ['publicSpeaking', 'contentWriting', 'eventManagement'] as const,
    icon: Contact,
    title: "Outreach Skills"
  }
};

const PROFICIENCY_LEVELS = ['None', 'Basic', 'Comfortable', 'Expert'];

export function Step2RoleAndSkills() {
  const { control, watch } = useFormContext<ApplicationSchema>();
  const selectedRoles = watch('roles', []);

  const skillToLabel = (skill: string) => {
    return {
      'afterEffects': 'After Effects',
      'projectManagement': 'Proj. Management',
      'publicSpeaking': 'Public Speaking',
      'contentWriting': 'Content Writing',
      'eventManagement': 'Event Management',
      'python': 'Python',
      'cpp': 'C++',
      'java': 'Java',
      'javascript': 'JavaScript',
      'r': 'R Language',
      'figma': 'Figma',
      'photoshop': 'Photoshop',
      'illustrator': 'Illustrator',
    }[skill] || skill;
  }

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Role Selection */}
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles size={22} className="animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Operational Sectors</h3>
        </div>

        <FormField
          control={control}
          name="roles"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ROLES.map((role) => {
                  const isActive = field.value?.includes(role.id);
                  return (
                    <div
                      key={role.id}
                      className={cn(
                        "relative flex flex-col items-start p-8 rounded-[2rem] border-2 transition-all duration-500 cursor-pointer group overflow-hidden",
                        isActive
                          ? "bg-primary/[0.03] border-primary shadow-xl shadow-primary/5 scale-[1.02]"
                          : "bg-white border-slate-100 opacity-60 grayscale-[0.8] hover:opacity-100 hover:grayscale-0 hover:border-slate-300 hover:bg-slate-50/50"
                      )}
                      onClick={() => {
                        const newValue = isActive
                          ? field.value.filter((v: string) => v !== role.id)
                          : [...(field.value || []), role.id];
                        field.onChange(newValue);
                      }}
                    >
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500",
                        isActive
                          ? "bg-primary text-white rotate-6"
                          : "bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary group-hover:-rotate-3"
                      )}>
                        <role.icon size={28} />
                      </div>
                      <div className="space-y-2 relative z-10">
                        <span className="text-xl font-bold text-slate-900 flex items-center gap-2">
                          {role.id}
                          {isActive && <CheckCircle2 size={18} className="text-primary animate-in zoom-in" />}
                        </span>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">{role.description}</p>
                      </div>

                      {/* Decorative Background Icon */}
                      <role.icon className={cn(
                        "absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.03] transition-transform duration-700",
                        isActive ? "scale-125 opacity-[0.05]" : "scale-100"
                      )} />
                    </div>
                  );
                })}
              </div>
              <FormMessage className="pt-4 font-semibold text-red-500" />
            </FormItem>
          )}
        />
      </div>

      {/* Proficiency Grids */}
      <div className="space-y-12">
        {Object.entries(SKILL_GROUPS).map(([key, group]) => {
          const isVisible = selectedRoles.some(role => group.roles.includes(role));
          if (!isVisible) return null;

          return (
            <div key={key} className="space-y-8 animate-in slide-in-from-bottom-10 duration-700 group/section">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover/section:bg-primary/10 group-hover/section:text-primary transition-colors">
                  <group.icon size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">{group.title}</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Header for the grid */}
                <div className="hidden md:grid grid-cols-12 items-center gap-4 px-6 mb-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  <div className="col-span-4">Technical Proficiency</div>
                  {PROFICIENCY_LEVELS.map(level => (
                    <div key={level} className="col-span-2 text-center">{level}</div>
                  ))}
                </div>

                {group.skills.map(skill => (
                  <FormField
                    key={skill}
                    control={control}
                    name={`skills.${skill}` as any}
                    render={({ field }) => (
                      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-5 rounded-3xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/[0.02] transition-all group/item">
                        <FormLabel className="col-span-4 text-base font-bold text-slate-700 group-hover/item:text-slate-900 transition-colors capitalize">
                          {skillToLabel(skill)}
                        </FormLabel>
                        <div className="col-span-8">
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-4 w-full"
                          >
                            {PROFICIENCY_LEVELS.map(level => (
                              <FormItem key={level} className="flex flex-col items-center justify-center space-y-0 relative">
                                <FormControl>
                                  <RadioGroupItem
                                    value={level}
                                    className="w-10 h-10 border-slate-200 text-primary focus:ring-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all hover:border-primary/50"
                                  />
                                </FormControl>
                                <span className="md:hidden text-[10px] font-bold text-slate-500 mt-2">{level}</span>
                                {field.value === level && (
                                  <div className="hidden md:block absolute -bottom-4 w-1 h-1 rounded-full bg-primary animate-pulse" />
                                )}
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>
                    )}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
