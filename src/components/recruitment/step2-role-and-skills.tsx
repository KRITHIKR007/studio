'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Cpu, Code, Palette, Briefcase, Megaphone, Contact, Sparkles } from 'lucide-react';
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
    <div className="space-y-12 animate-fade-in">
      {/* Role Selection */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-primary animate-pulse" size={20} />
          <h3 className="text-xl font-semibold text-white/90">Preferred Roles</h3>
        </div>
        <FormField
          control={control}
          name="roles"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ROLES.map((role) => (
                  <FormField
                    key={role.id}
                    control={control}
                    name="roles"
                    render={({ field }) => {
                      const isActive = field.value?.includes(role.id);
                      return (
                        <FormItem
                          className={cn(
                            "relative flex flex-col items-start p-6 rounded-3xl border transition-all duration-300 cursor-pointer group",
                            isActive
                              ? "bg-primary/10 border-primary/50 ring-1 ring-primary/20"
                              : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]"
                          )}
                          onClick={() => {
                            const newValue = isActive
                              ? field.value.filter(v => v !== role.id)
                              : [...(field.value || []), role.id];
                            field.onChange(newValue);
                          }}
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors",
                            isActive ? "bg-primary text-primary-foreground" : "bg-white/10 text-white/70 group-hover:text-white"
                          )}>
                            <role.icon size={24} />
                          </div>
                          <div className="space-y-1">
                            <FormLabel className="text-base font-bold text-white cursor-pointer">{role.id}</FormLabel>
                            <p className="text-xs text-white/50 leading-relaxed">{role.description}</p>
                          </div>
                          <FormControl className="hidden">
                            <Checkbox checked={isActive} />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage className="pt-2" />
            </FormItem>
          )}
        />
      </div>

      {/* Proficiency Grids */}
      {Object.entries(SKILL_GROUPS).map(([key, group]) => {
        const isVisible = selectedRoles.some(role => group.roles.includes(role));
        if (!isVisible) return null;

        return (
          <div key={key} className="space-y-6 animate-fade-in border-t border-white/5 pt-12">
            <div className="flex items-center gap-3">
              <group.icon className="text-primary" size={20} />
              <h3 className="text-xl font-semibold text-white/90">{group.title}</h3>
            </div>

            <div className="space-y-4">
              {/* Header for the grid */}
              <div className="hidden md:grid grid-cols-5 items-center gap-4 px-4 text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">
                <div className="col-span-1">Skillset</div>
                {PROFICIENCY_LEVELS.map(level => (
                  <div key={level} className="text-center">{level}</div>
                ))}
              </div>

              {group.skills.map(skill => (
                <FormField
                  key={skill}
                  control={control}
                  name={`skills.${skill}`}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                      <FormLabel className="col-span-1 text-sm font-medium text-white/80 group-hover:text-white capitalize truncate">
                        {skillToLabel(skill)}
                      </FormLabel>
                      <div className="col-span-4">
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-4 w-full"
                        >
                          {PROFICIENCY_LEVELS.map(level => (
                            <FormItem key={level} className="flex flex-col items-center justify-center space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  value={level}
                                  className="w-6 h-6 border-white/20 text-primary focus:ring-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                              </FormControl>
                              <span className="md:hidden text-[10px] text-white/40 mt-1">{level}</span>
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
  );
}
