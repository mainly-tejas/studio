"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, PlusCircle, X } from "lucide-react";
import { skillSuggestion } from "@/ai/flows/skill-suggestion";
import { useToast } from "@/hooks/use-toast";
import type { UserBackground } from "@/lib/types";
import { Badge } from "./ui/badge";

const formSchema = z.object({
  skills: z.array(z.string()).nonempty("Please select at least one skill."),
  newSkill: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function SkillsForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const { toast } = useToast();
  const [background, setBackground] = useState<Partial<UserBackground> | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: [],
      newSkill: "",
    },
  });

  useEffect(() => {
    const storedBackground = localStorage.getItem("userBackground");
    if (storedBackground) {
        const bg = JSON.parse(storedBackground);
        setBackground(bg);
        if (bg.education) {
            fetchSkills(bg.education);
        } else {
             router.push('/start');
        }
    } else {
      router.push("/start");
    }
  }, [router]);

  const fetchSkills = async (education: string) => {
    setLoading(true);
    try {
      const result = await skillSuggestion({ education });
      setSuggestedSkills(result.skills);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to get skill suggestions. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSkill = (skill: string) => {
    const currentSkills = form.getValues("skills");
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter((s) => s !== skill)
      : [...currentSkills, skill];
    form.setValue("skills", newSkills);
  };

  const handleAddSkill = () => {
    const newSkill = form.getValues("newSkill")?.trim();
    if (newSkill && !form.getValues("skills").includes(newSkill)) {
      form.setValue("skills", [...form.getValues("skills"), newSkill]);
      form.setValue("newSkill", "");
    }
  };

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    const updatedBackground: UserBackground = {
        ...background,
        education: background?.education || '',
        skills: values.skills,
        projects: background?.projects || '',
        interests: background?.interests || '',
    };
    localStorage.setItem("userBackground", JSON.stringify(updatedBackground));
    router.push("/start/projects");
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Our AI is analyzing your education to suggest skills...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="skills"
          render={() => (
            <FormItem>
              <FormLabel className="text-lg font-headline">AI Suggested Skills</FormLabel>
              <div className="flex flex-wrap gap-2 pt-2">
                {suggestedSkills.map((skill) => (
                  <Button
                    key={skill}
                    type="button"
                    variant={form.watch("skills").includes(skill) ? "default" : "secondary"}
                    onClick={() => handleToggleSkill(skill)}
                    className="rounded-full"
                  >
                    {skill}
                  </Button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
             <FormLabel className="text-lg font-headline">Your Skills</FormLabel>
             <div className="flex flex-wrap gap-2 pt-2">
                {form.watch('skills').map(skill => (
                    <Badge key={skill} variant="secondary" className="text-base py-1 px-3">
                        {skill}
                        <button type="button" onClick={() => handleToggleSkill(skill)} className="ml-2">
                            <X className="h-4 w-4"/>
                        </button>
                    </Badge>
                ))}
             </div>
        </div>

        <FormField
          control={form.control}
          name="newSkill"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-headline">Add Missing Skills</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input placeholder="e.g., Public Speaking" {...field} />
                </FormControl>
                <Button type="button" variant="outline" size="icon" onClick={handleAddSkill}>
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-between">
           <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Button type="submit" disabled={submitting} size="lg">
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Next: Add Projects
          </Button>
        </div>
      </form>
    </Form>
  );
}
