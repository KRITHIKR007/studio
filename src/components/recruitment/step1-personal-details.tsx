'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { ApplicationSchema } from '@/lib/schema';

export function Step1PersonalDetails() {
  const { control } = useFormContext<ApplicationSchema>();

  const fields = [
    { name: 'fullName', label: 'Full Legal Name', placeholder: 'e.g. Alan Turing', type: 'text' },
    { name: 'usn', label: 'University Serial Number (USN)', placeholder: 'e.g. 1RV22CS000', type: 'text' },
    { name: 'email', label: 'Academic Email Address', placeholder: 'e.g. alan.cs22@rvce.edu.in', type: 'email' },
    { name: 'phone', label: 'Contact Number', placeholder: 'e.g. +91 9876543210', type: 'tel' },
    { name: 'department', label: 'Department / Branch', placeholder: 'e.g. Computer Science', type: 'text' },
    { name: 'year', label: 'Current Year of Study', placeholder: 'e.g. 2nd Year', type: 'text' },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 py-6 animate-fade-in">
      {fields.map((field) => (
        <FormField
          key={field.name}
          control={control}
          name={field.name as any}
          render={({ field: formField }) => (
            <FormItem className="space-y-3 group">
              <FormLabel className="text-sm font-bold text-slate-700 tracking-tight group-focus-within:text-primary transition-colors">
                {field.label}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...formField}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="h-14 bg-white border-slate-200 rounded-2xl px-6 focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all duration-300 text-slate-800 placeholder:text-slate-400 font-medium"
                  />
                  <div className="absolute inset-0 rounded-2xl pointer-events-none group-hover:border-slate-300 transition-colors border border-transparent" />
                </div>
              </FormControl>
              <FormMessage className="text-xs font-medium text-red-500" />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
