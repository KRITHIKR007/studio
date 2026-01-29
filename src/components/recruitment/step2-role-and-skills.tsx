'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Cpu, Code, Palette, Briefcase } from 'lucide-react';
import type { ApplicationSchema } from '@/lib/schema';

const ROLES = ["Tech", "Design", "Core", "Outreach"];
const SKILLS = ['python', 'cpp', 'java', 'javascript', 'r'] as const;
const DESIGN_SKILLS = ['figma', 'photoshop', 'illustrator', 'afterEffects'] as const;
const CORE_SKILLS = ['projectManagement', 'publicSpeaking', 'contentWriting', 'eventManagement'] as const;
const PROFICIENCY_LEVELS = ['None', 'Basic', 'Comfortable', 'Expert'];
const TECHNICAL_ROLES = ["Tech"];
const DESIGN_ROLES = ["Design"];
const CORE_ROLES = ["Core"];

export function Step2RoleAndSkills() {
  const { control, watch } = useFormContext<ApplicationSchema>();
  const selectedRoles = watch('roles', []);

  const showProficiency = selectedRoles.some(role => TECHNICAL_ROLES.includes(role));
  const showDesignProficiency = selectedRoles.some(role => DESIGN_ROLES.includes(role));
  const showCoreProficiency = selectedRoles.some(role => CORE_ROLES.includes(role));

  const skillToLabel = (skill: string) => {
    return {
      'afterEffects': 'After Effects',
      'projectManagement': 'Project Management',
      'publicSpeaking': 'Public Speaking',
      'contentWriting': 'Content Writing',
      'eventManagement': 'Event Management',
    }[skill] || skill;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="text-primary" size={24} /> Preferred Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="roles"
            render={() => (
              <FormItem>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ROLES.map((role) => (
                    <FormField
                      key={role}
                      control={control}
                      name="roles"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 hover:bg-accent/10 transition-colors">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(role)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), role])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== role
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal w-full cursor-pointer">{role}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage className="pt-2" />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {showProficiency && (
        <Card className="bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="text-primary" size={24} /> Proficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-5 items-center gap-4 px-2 text-sm text-muted-foreground">
                <div className="col-span-1 font-medium text-foreground">Language</div>
                {PROFICIENCY_LEVELS.map(level => (
                  <div key={level} className="text-center">{level}</div>
                ))}
              </div>
              {SKILLS.map(skill => (
                <FormField
                  key={skill}
                  control={control}
                  name={`skills.${skill}`}
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4 px-2 py-2 rounded-md hover:bg-muted/50">
                      <FormLabel className="col-span-1 capitalize font-medium">{skill}</FormLabel>
                      <FormControl className="col-span-4">
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-4"
                        >
                          {PROFICIENCY_LEVELS.map(level => (
                            <FormItem key={level} className="flex items-center justify-center">
                              <FormControl>
                                <RadioGroupItem value={level} />
                              </FormControl>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showDesignProficiency && (
        <Card className="bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="text-primary" size={24} /> Design Proficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-5 items-center gap-4 px-2 text-sm text-muted-foreground">
                <div className="col-span-1 font-medium text-foreground">Tool</div>
                {PROFICIENCY_LEVELS.map(level => (
                  <div key={level} className="text-center">{level}</div>
                ))}
              </div>
              {DESIGN_SKILLS.map(skill => (
                <FormField
                  key={skill}
                  control={control}
                  name={`skills.${skill}`}
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4 px-2 py-2 rounded-md hover:bg-muted/50">
                      <FormLabel className="col-span-1 capitalize">{skillToLabel(skill)}</FormLabel>
                      <FormControl className="col-span-4">
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-4"
                        >
                          {PROFICIENCY_LEVELS.map(level => (
                            <FormItem key={level} className="flex items-center justify-center">
                              <FormControl>
                                <RadioGroupItem value={level} />
                              </FormControl>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showCoreProficiency && (
        <Card className="bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="text-primary" size={24} /> Core Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-5 items-center gap-4 px-2 text-sm text-muted-foreground">
                <div className="col-span-1 font-medium text-foreground">Skill</div>
                {PROFICIENCY_LEVELS.map(level => (
                  <div key={level} className="text-center">{level}</div>
                ))}
              </div>
              {CORE_SKILLS.map(skill => (
                <FormField
                  key={skill}
                  control={control}
                  name={`skills.${skill}`}
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4 px-2 py-2 rounded-md hover:bg-muted/50">
                      <FormLabel className="col-span-1 capitalize">{skillToLabel(skill)}</FormLabel>
                      <FormControl className="col-span-4">
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-4"
                        >
                          {PROFICIENCY_LEVELS.map(level => (
                            <FormItem key={level} className="flex items-center justify-center">
                              <FormControl>
                                <RadioGroupItem value={level} />
                              </FormControl>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
