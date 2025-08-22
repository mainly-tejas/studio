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
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { careerSuggestion } from "@/ai/flows/career-suggestion";
import { useToast } from "@/hooks/use-toast";
import type { UserBackground } from "@/lib/types";

const formSchema = z.object({
  projects: z.string().min(10, "Please describe at least one project."),
  interests: z.string().min(5, "Please list at least one interest."),
});

type FormValues = z.infer<typeof formSchema>;

export function BackgroundForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [background, setBackground] = useState<UserBackground | null>(null);

  useEffect(() => {
    const storedBackground = localStorage.getItem("userBackground");
    if (storedBackground) {
      setBackground(JSON.parse(storedBackground));
    } else {
      router.push("/start");
    }
  }, [router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projects: background?.projects || "",
      interests: background?.interests || "",
    },
  });
  
  useEffect(() => {
    if (background) {
      form.reset({
        projects: background.projects || "",
        interests: background.interests || "",
      });
    }
  }, [background, form]);

  async function onSubmit(values: FormValues) {
    if (!background) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "User background not found. Please start over.",
      });
      router.push('/start');
      return;
    }

    setLoading(true);

    const fullBackground: UserBackground = {
      ...background,
      ...values,
    };

    localStorage.setItem("userBackground", JSON.stringify(fullBackground));

    try {
      const suggestions = await careerSuggestion({
        education: fullBackground.education,
        skills: fullBackground.skills.join(', '),
        projects: fullBackground.projects,
        interests: fullBackground.interests,
      });
      localStorage.setItem("careerSuggestions", JSON.stringify(suggestions));
      router.push("/careers");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to get career suggestions. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }
  
  if (!background) {
    return <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Textarea
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
        <div className="flex justify-between">
           <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Button type="submit" disabled={loading} size="lg">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Find My Career Path
          </Button>
        </div>
      </form>
    </Form>
  );
}
