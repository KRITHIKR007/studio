'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Cpu, Code } from 'lucide-react';
import type { ApplicationSchema } from '@/lib/schema';

const ROLES = ["Tech / ML Engineering", "Research & Experimentation", "Deployment & MLOps", "Data Engineering", "UI/UX for AI Tools", "Content & Outreach"];
const SKILLS = ['python', 'cpp', 'java', 'javascript', 'r'] as const;
const PROFICIENCY_LEVELS = ['None', 'Basic', 'Comfortable', 'Expert'];

export function Step2RoleAndSkills() {
  const { control } = useFormContext<ApplicationSchema>();

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
                                  ? field.onChange([...field.value, role])
                                  : field.onChange(field.value?.filter((value) => value !== role));
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

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="text-primary" size={24} /> Proficiency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Language</TableHead>
                  {PROFICIENCY_LEVELS.map(level => (
                    <TableHead key={level} className="text-center">{level}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {SKILLS.map(skill => (
                  <FormField
                    key={skill}
                    control={control}
                    name={`skills.${skill}`}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        asChild
                      >
                        <TableRow>
                          <TableCell className="font-medium capitalize">{skill}</TableCell>
                          {PROFICIENCY_LEVELS.map(level => (
                            <TableCell key={level} className="text-center">
                              <FormItem className="flex items-center justify-center">
                                <FormControl>
                                  <RadioGroupItem value={level} />
                                </FormControl>
                              </FormItem>
                            </TableCell>
                          ))}
                        </TableRow>
                      </RadioGroup>
                    )}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
