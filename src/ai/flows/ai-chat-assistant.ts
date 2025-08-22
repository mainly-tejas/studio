'use server';

/**
 * @fileOverview An AI-powered chat assistant for career roadmap modification and question answering.
 *
 * - aiChatAssistant - A function that handles the chat assistant process.
 * - AIChatAssistantInput - The input type for the aiChatAssistant function.
 * - AIChatAssistantOutput - The return type for the aiChatAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatAssistantInputSchema = z.object({
  query: z.string().describe('The user query or message.'),
  roadmap: z.string().optional().describe('The current career roadmap as a string, if available.'),
  background: z.string().optional().describe('The student background information, if available.'),
});
export type AIChatAssistantInput = z.infer<typeof AIChatAssistantInputSchema>;

const AIChatAssistantOutputSchema = z.object({
  response: z.string().describe('The AI assistant response to the user query.'),
});
export type AIChatAssistantOutput = z.infer<typeof AIChatAssistantOutputSchema>;

export async function aiChatAssistant(input: AIChatAssistantInput): Promise<AIChatAssistantOutput> {
  return aiChatAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatAssistantPrompt',
  input: {schema: AIChatAssistantInputSchema},
  output: {schema: AIChatAssistantOutputSchema},
  prompt: `You are a helpful AI career advisor assistant. Your goal is to help students modify their career roadmaps and answer any questions they have about the plan.

  You have access to the student's current career roadmap (if available), their background information (if available), and their current query.

  Use this information to provide helpful and informative responses. If the roadmap is provided, help the student modify it based on their query. If the background information is provided, use it to tailor your responses to the student's specific situation.

  If the student asks a question, answer it to the best of your ability.

  Roadmap:
  {{#if roadmap}}
  {{{roadmap}}}
  {{else}}
  Not available.
  {{/if}}

  Background Information:
  {{#if background}}
  {{{background}}}
  {{else}}
  Not available.
  {{/if}}

  Query: {{{query}}}

  Response: `,
});

const aiChatAssistantFlow = ai.defineFlow(
  {
    name: 'aiChatAssistantFlow',
    inputSchema: AIChatAssistantInputSchema,
    outputSchema: AIChatAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
