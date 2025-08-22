"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UserBackground } from "@/lib/types";

const formSchema = z.object({
  education: z
    .string()
    .min(10, "Please provide more details about your education."),
});

type FormValues = z.infer<typeof formSchema>;

export function EducationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      education: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    const userBackground: Partial<UserBackground> = { 
        education: values.education 
    };
    localStorage.setItem("userBackground", JSON.stringify(userBackground));
    router.push("/start/skills");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-headline">Education</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Bachelor's in Computer Science from University of Example, or Self-taught developer with courses on..."
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your educational background, including degrees, certifications,
                and online courses.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} size="lg">
          Next: AI Skill Suggestions
        </Button>
      </form>
    </Form>
  );
}
