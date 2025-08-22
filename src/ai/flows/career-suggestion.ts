// This file uses server-side code.
'use server';

/**
 * @fileOverview Provides personalized career suggestions based on a student's background and interests.
 *
 * - `careerSuggestion` - A function that takes student information and returns a list of career suggestions with fit scores, skill gaps, and other relevant information.
 * - `CareerSuggestionInput` - The input type for the `careerSuggestion` function.
 * - `CareerSuggestionOutput` - The return type for the `careerSuggestion` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CareerSuggestionInputSchema = z.object({
  education: z.string().describe('The student\'s educational background.'),
  skills: z.string().describe('A comma-separated list of the student\'s skills.'),
  projects: z.string().describe('A description of the student\'s projects.'),
  interests: z.string().describe('The student\'s interests.'),
});

export type CareerSuggestionInput = z.infer<typeof CareerSuggestionInputSchema>;

const CareerSuggestionOutputSchema = z.array(z.object({
  career: z.string().describe('The suggested career path.'),
  fitScore: z.number().describe('A score indicating how well the career matches the student\'s profile (0-100).'),
  skillGaps: z.string().describe('A description of the skills the student needs to develop to pursue this career.'),
  starterRoles: z.string().describe('Entry-level roles for this career path.'),
  salaryRange: z.string().describe('The typical salary range for this career path.'),
}));

export type CareerSuggestionOutput = z.infer<typeof CareerSuggestionOutputSchema>;

export async function careerSuggestion(input: CareerSuggestionInput): Promise<CareerSuggestionOutput> {
  return careerSuggestionFlow(input);
}

const careerSuggestionPrompt = ai.definePrompt({
  name: 'careerSuggestionPrompt',
  input: {schema: CareerSuggestionInputSchema},
  output: {schema: CareerSuggestionOutputSchema},
  prompt: `You are a career counselor providing personalized career suggestions to students.

  Based on the student's background, skills, projects, and interests, suggest potential career paths that align with their profile.  Provide a fit score (0-100), skill gaps, starter roles, and salary ranges for each suggestion.

  Education: {{{education}}}
  Skills: {{{skills}}}
  Projects: {{{projects}}}
  Interests: {{{interests}}}

  Format the output as a JSON array of career suggestions.
  `,
});

const careerSuggestionFlow = ai.defineFlow(
  {
    name: 'careerSuggestionFlow',
    inputSchema: CareerSuggestionInputSchema,
    outputSchema: CareerSuggestionOutputSchema,
  },
  async input => {
    const {output} = await careerSuggestionPrompt(input);
    return output!;
  }
);
