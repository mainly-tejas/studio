'use server';

/**
 * @fileOverview Defines a Genkit flow for generating a personalized career roadmap.
 *
 * This flow takes a student's chosen career and their background information as input.
 * It uses an AI model to generate a detailed, multi-phase roadmap with specific modules,
 * tasks, resources, and checkpoints tailored to the user's profile.
 *
 * @exports generateRoadmap - A function that triggers the roadmap generation flow.
 * @exports GenerateRoadmapInput - The input type for the `generateRoadmap` function.
 * @exports GenerateRoadmapOutput - The return type for the `generateRoadmap` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the input schema for the roadmap generation flow.
const GenerateRoadmapInputSchema = z.object({
  career: z.string().describe('The chosen career path for which to generate the roadmap.'),
  background: z.string().describe("The student's background information including education, skills, projects, and interests."),
});
export type GenerateRoadmapInput = z.infer<typeof GenerateRoadmapInputSchema>;

// Define the output schema for the roadmap generation flow.
const RoadmapModuleSchema = z.object({
    title: z.string().describe('The title of the module.'),
    tasks: z.array(z.string()).describe('A list of daily or weekly tasks to complete for this module.'),
    resources: z.array(z.string()).describe('A list of curated resources (e.g., courses, books, articles) for this module.'),
    checkpoint: z.string().describe('A measurable goal or project that marks the completion of this module.'),
});

const RoadmapPhaseSchema = z.object({
    title: z.string().describe('The title of the phase, including a suggested timeframe (e.g., "Phase 1: Foundations (Months 1-3)").'),
    modules: z.array(RoadmapModuleSchema).describe('A list of modules within this phase.'),
});

const GenerateRoadmapOutputSchema = z.object({
  phases: z.array(RoadmapPhaseSchema).describe('The multi-phase career roadmap.'),
  raw: z.string().optional().describe('Raw string output, in case structured generation fails.'),
});

export type GenerateRoadmapOutput = z.infer<typeof GenerateRoadmapOutputSchema>;

// Define the prompt for generating the roadmap.
const roadmapGenerationPrompt = ai.definePrompt({
  name: 'roadmapGenerationPrompt',
  input: { schema: GenerateRoadmapInputSchema },
  output: { schema: GenerateRoadmapOutputSchema },
  prompt: `You are a world-class AI career consultant. Your task is to create a highly personalized, structured, and actionable career roadmap for a student.

  The roadmap should be broken down into logical phases. Each phase should have a title that includes a suggested timeframe (e.g., "Phase 1: Foundations (Months 1-3)").
  
  Within each phase, create several modules. Each module must have:
  - A clear, concise title.
  - A list of specific daily or weekly tasks. These should be practical and actionable.
  - A list of curated, high-quality learning resources.
  - A single, measurable checkpoint or project to validate learning for that module.

  Base the entire roadmap on the user's specific background and their chosen career path. Personalize the tasks and resource suggestions to align with their existing skills and fill their identified gaps.

  **Student Profile:**
  {{{background}}}

  **Chosen Career:**
  {{{career}}}

  Generate a roadmap with at least 3 phases.
  `,
});

// Define the roadmap generation flow.
const roadmapGenerationFlow = ai.defineFlow(
  {
    name: 'roadmapGenerationFlow',
    inputSchema: GenerateRoadmapInputSchema,
    outputSchema: GenerateRoadmapOutputSchema,
  },
  async (input) => {
    const { output } = await roadmapGenerationPrompt(input);
    return output!;
  }
);

/**
 * Generates a personalized career roadmap.
 *
 * @param input - The input containing the chosen career and student background.
 * @returns A promise that resolves to the generated roadmap.
 */
export async function generateRoadmap(input: GenerateRoadmapInput): Promise<GenerateRoadmapOutput> {
  return roadmapGenerationFlow(input);
}
