'use server';

/**
 * @fileOverview Provides AI-powered skill suggestions based on a student's educational background.
 *
 * - `skillSuggestion` - A function that takes a student's education and returns a list of suggested skills.
 * - `SkillSuggestionInput` - The input type for the `skillSuggestion` function.
 * - `SkillSuggestionOutput` - The return type for the `skillSuggestion` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SkillSuggestionInputSchema = z.object({
  education: z.string().describe("The student's educational background."),
});

export type SkillSuggestionInput = z.infer<typeof SkillSuggestionInputSchema>;

const SkillSuggestionOutputSchema = z.object({
    skills: z.array(z.string()).describe('A list of suggested skills based on the education provided.')
});

export type SkillSuggestionOutput = z.infer<typeof SkillSuggestionOutputSchema>;


export async function skillSuggestion(input: SkillSuggestionInput): Promise<SkillSuggestionOutput> {
  return skillSuggestionFlow(input);
}

const skillSuggestionPrompt = ai.definePrompt({
  name: 'skillSuggestionPrompt',
  input: { schema: SkillSuggestionInputSchema },
  output: { schema: SkillSuggestionOutputSchema },
  prompt: `You are an expert career advisor. Based on the provided educational background, predict a list of relevant technical and soft skills. Provide a comprehensive list of at least 30 skills.

  Education: {{{education}}}

  Format the output as a JSON object with a "skills" array.
  `,
});

const skillSuggestionFlow = ai.defineFlow(
  {
    name: 'skillSuggestionFlow',
    inputSchema: SkillSuggestionInputSchema,
    outputSchema: SkillSuggestionOutputSchema,
  },
  async input => {
    const { output } = await skillSuggestionPrompt(input);
    return output!;
  }
);
