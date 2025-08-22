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

const JobListingSchema = z.object({
  title: z.string().describe('The job title.'),
  company: z.string().describe('The company hiring for the role.'),
  location: z.string().describe('The location of the job.'),
  url: z.string().url().describe('The URL to the job posting.'),
});

// Mock tool to simulate fetching job listings from an API.
const getJobListings = ai.defineTool(
  {
    name: 'getJobListings',
    description: 'Get a list of current job listings for a given career role.',
    inputSchema: z.object({
      role: z.string().describe('The career role to search for jobs.'),
    }),
    outputSchema: z.array(JobListingSchema),
  },
  async ({role}) => {
    // In a real application, this would call a job board API.
    // For this demo, we'll return some mock data.
    console.log(`Fetching mock job listings for: ${role}`);
    const mockJobs = {
      'Software Engineer': [
        {title: 'Frontend Engineer', company: 'Google', location: 'Bengaluru, KA', url: 'https://careers.google.com/'},
        {title: 'Backend Developer', company: 'Amazon', location: 'Hyderabad, TS', url: 'https://www.amazon.jobs/'},
        {title: 'Full Stack Developer', company: 'Microsoft', location: 'Noida, UP', url: 'https://careers.microsoft.com/'},
      ],
      'Data Scientist': [
        {title: 'Data Scientist, Machine Learning', company: 'Flipkart', location: 'Bengaluru, KA', url: 'https://www.flipkartcareers.com/'},
        {title: 'AI/ML Engineer', company: 'Tata CLiQ', location: 'Mumbai, MH', url: 'https://www.tatacliq.com/careers'},
        {title: 'Data Analyst', company: 'Zomato', location: 'Gurugram, HR', url: 'https://www.zomato.com/careers'},
      ],
      'Product Manager': [
        {title: 'Product Manager', company: 'Paytm', location: 'Noida, UP', url: 'https://paytm.com/careers/'},
        {title: 'Associate Product Manager', company: 'Swiggy', location: 'Bengaluru, KA', url: 'https://careers.swiggy.com/'},
      ],
      'UX/UI Designer': [
        {title: 'UX Designer', company: 'Myntra', location: 'Bengaluru, KA', url: 'https://careers.myntra.com/'},
        {title: 'UI/Visual Designer', company: 'PhonePe', location: 'Pune, MH', url: 'https://www.phonepe.com/careers/'},
      ],
    };
    const key = Object.keys(mockJobs).find(k => role.toLowerCase().includes(k.toLowerCase()));
    return (mockJobs as any)[key || 'Software Engineer'] || [];
  }
);

const CareerSuggestionInputSchema = z.object({
  education: z.string().describe("The student's educational background."),
  skills: z.string().describe("A comma-separated list of the student's skills."),
  projects: z.string().describe("A description of the student's projects."),
  interests: z.string().describe("A description of the student's interests."),
});

export type CareerSuggestionInput = z.infer<typeof CareerSuggestionInputSchema>;

const CareerSuggestionOutputSchema = z.array(z.object({
  career: z.string().describe('The suggested career path.'),
  fitScore: z.number().describe('A score indicating how well the career matches the student\'s profile (0-100).'),
  skillGaps: z.string().describe('A description of the skills the student needs to develop to pursue this career.'),
  starterRoles: z.string().describe('Entry-level roles for this career path.'),
  salaryRange: z.string().describe('The typical salary range for this career path in Indian Rupees (INR).'),
  futureOutlook: z.string().describe('A brief description of the future outlook for this career path.'),
  jobListings: z.array(JobListingSchema).optional().describe('A list of relevant live job listings.'),
}));

export type CareerSuggestionOutput = z.infer<typeof CareerSuggestionOutputSchema>;

export async function careerSuggestion(input: CareerSuggestionInput): Promise<CareerSuggestionOutput> {
  return careerSuggestionFlow(input);
}

const careerSuggestionPrompt = ai.definePrompt({
  name: 'careerSuggestionPrompt',
  input: {schema: CareerSuggestionInputSchema},
  output: {schema: CareerSuggestionOutputSchema},
  tools: [getJobListings],
  prompt: `You are a career counselor providing personalized career suggestions to students.

  Based on the student's background, skills, projects, and interests, suggest potential career paths that align with their profile. Provide a fit score (0-100), skill gaps, starter roles, salary ranges in INR, and a future outlook for each suggestion.

  For each suggested career, use the getJobListings tool to find a few relevant, live job openings. Include these in your response.

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
