"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { PlusCircle, Trash } from "lucide-react";

const educationSchema = z.object({
  description: z.string().min(10, "Please provide more details."),
});

const formSchema = z.object({
  educations: z.array(educationSchema).nonempty("Please add at least one education entry."),
});

type FormValues = z.infer<typeof formSchema>;

export function EducationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      educations: [{ description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educations",
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    const educationDescriptions = values.educations.map(e => e.description).join("\n\n");
    const userBackground: Partial<UserBackground> = {
      education: educationDescriptions,
    };
    localStorage.setItem("userBackground", JSON.stringify(userBackground));
    router.push("/start/skills");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`educations.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-lg font-headline">
                      Education #{index + 1}
                    </FormLabel>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Bachelor's in Computer Science from University of Example, or Self-taught developer with courses on..."
                      className="resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ description: "" })}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Another Education
        </Button>
        
        <FormDescription>
          Your educational background, including degrees, certifications,
          and online courses.
        </FormDescription>

        <Button type="submit" disabled={loading} size="lg">
          Next: AI Skill Suggestions
        </Button>
      </form>
    </Form>
  );
}
