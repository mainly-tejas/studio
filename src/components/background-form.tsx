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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { careerSuggestion } from "@/ai/flows/career-suggestion";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  education: z
    .string()
    .min(10, "Please provide more details about your education."),
  skills: z.string().min(5, "Please list at least one skill."),
  projects: z.string().min(10, "Please describe at least one project."),
  interests: z.string().min(5, "Please list at least one interest."),
});

type FormValues = z.infer<typeof formSchema>;

export function BackgroundForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      education: "",
      skills: "",
      projects: "",
      interests: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const suggestions = await careerSuggestion(values);
      localStorage.setItem("careerSuggestions", JSON.stringify(suggestions));
      localStorage.setItem("userBackground", JSON.stringify(values));
      router.push("/careers");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to get career suggestions. Please try again.",
      });
      setLoading(false);
    }
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
                <Input
                  placeholder="e.g., Bachelor's in Computer Science, self-taught developer"
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
        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-headline">Skills</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Python, React, UI/UX Design, Public Speaking"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Comma-separated list of your technical and soft skills.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projects"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-headline">Projects</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe any personal, academic, or professional projects you've worked on."
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                What have you built? This helps us understand your practical
                experience.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-headline">Interests</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Artificial Intelligence, Gaming, Sustainable Tech"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                What topics or industries are you passionate about?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} size="lg">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Find My Career Path
        </Button>
      </form>
    </Form>
  );
}
