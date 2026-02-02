'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ApplicationSchema } from '@/lib/schema';

export function Step1PersonalDetails() {
  const { control } = useFormContext<ApplicationSchema>();

  return (
    <div className="space-y-8 animate-fade-in text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          control={control}
          name="fullName"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-semibold tracking-wider uppercase text-white/70">Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Ada Lovelace"
                  className="h-14 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs font-medium text-destructive/90" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="usn"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-semibold tracking-wider uppercase text-white/70">USN / ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 23Btrcl000"
                  className="h-14 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs font-medium text-destructive/90" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="department"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-semibold tracking-wider uppercase text-white/70">Department</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Computer Science & Engineering"
                  className="h-14 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs font-medium text-destructive/90" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="year"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-semibold tracking-wider uppercase text-white/70">Year of Study</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-14 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all">
                    <SelectValue placeholder="Select your year" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-zinc-900 border-white/10">
                  {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(year => (
                    <SelectItem key={year} value={year} className="focus:bg-primary/20 focus:text-white transition-colors">{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs font-medium text-destructive/90" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-semibold tracking-wider uppercase text-white/70">Email (College ID)</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@college.edu"
                  className="h-14 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs font-medium text-destructive/90" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-semibold tracking-wider uppercase text-white/70">Phone (WhatsApp)</FormLabel>
              <FormControl>
                <Input
                  placeholder="+91 XXXXX XXXXX"
                  className="h-14 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs font-medium text-destructive/90" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
