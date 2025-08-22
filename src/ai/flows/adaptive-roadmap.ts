'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating an adaptive roadmap based on a student's quiz performance.
 *
 * The flow takes the student's background and quiz results as input and uses an AI model to refine
 * the student's capability vector and dynamically adjust the roadmap.
 *
 * @exports adaptiveRoadmap - A function that triggers the adaptive roadmap generation flow.
 * @exports AdaptiveRoadmapInput - The input type for the adaptiveRoadmap function.
 * @exports AdaptiveRoadmapOutput - The return type for the adaptiveRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the adaptive roadmap flow.
const AdaptiveRoadmapInputSchema = z.object({
  background: z
    .string()
    .describe(
      'The student background information including education, skills, projects, and interests.'
    ),
  quizResults: z
    .string()
    .describe(
      'The results of the quiz taken by the student. Should contain the score of each quiz taken.'
    ),
});
export type AdaptiveRoadmapInput = z.infer<typeof AdaptiveRoadmapInputSchema>;

// Define the output schema for the adaptive roadmap flow.
const AdaptiveRoadmapOutputSchema = z.object({
  refinedCapabilityVector: z
    .string()
    .describe('The refined capability vector of the student.'),
  adjustedRoadmap: z.string().describe('The dynamically adjusted roadmap.'),
});
export type AdaptiveRoadmapOutput = z.infer<typeof AdaptiveRoadmapOutputSchema>;

// Define the prompt for generating the adaptive roadmap.
const adaptiveRoadmapPrompt = ai.definePrompt({
  name: 'adaptiveRoadmapPrompt',
  input: {schema: AdaptiveRoadmapInputSchema},
  output: {schema: AdaptiveRoadmapOutputSchema},
  prompt: `You are an AI career coach that specializes in creating personalized roadmaps for students.

Based on the student's background and quiz results, you will refine the student's capability vector and dynamically adjust the roadmap to align with their skills and progress.

Student Background: {{{background}}}
Quiz Results: {{{quizResults}}}

Refined Capability Vector:
Adjusted Roadmap:`,
});

// Define the adaptive roadmap flow.
const adaptiveRoadmapFlow = ai.defineFlow(
  {
    name: 'adaptiveRoadmapFlow',
    inputSchema: AdaptiveRoadmapInputSchema,
    outputSchema: AdaptiveRoadmapOutputSchema,
  },
  async input => {
    const {output} = await adaptiveRoadmapPrompt(input);
    return output!;
  }
);

/**
 * Generates an adaptive roadmap based on the provided input.
 *
 * @param input - The input containing student background and quiz results.
 * @returns A promise that resolves to the adaptive roadmap output.
 */
export async function adaptiveRoadmap(input: AdaptiveRoadmapInput): Promise<AdaptiveRoadmapOutput> {
  return adaptiveRoadmapFlow(input);
}
