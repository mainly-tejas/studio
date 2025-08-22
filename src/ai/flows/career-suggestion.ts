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
  why: z.string().describe("A brief explanation of why this career is a good fit for the student's profile."),
  skillGaps: z.string().describe('A description of the skills the student needs to develop to pursue this career.'),
  starterRoles: z.string().describe('Entry-level roles for this career path.'),
  salaryRange: z.string().describe('The typical salary range for this career path in Indian Rupees (INR).'),
  futureOutlook: z.string().describe('A brief description of the future outlook for this career path.'),
  workLifeBalance: z.number().min(1).max(10).describe('A score from 1 (poor) to 10 (excellent) representing the typical work-life balance in this field.'),
  fiveYearTrajectory: z.string().describe("A description of a likely career trajectory over the next 5 years, starting from an entry-level role."),
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
  prompt: `You are an expert career counselor providing insightful, personalized career suggestions to students in India.

  Based on the student's background, skills, projects, and interests, suggest three potential career paths that align with their profile.

  For each suggestion, you MUST provide the following details:
  - career: The name of the career path.
  - fitScore: A score from 0-100 indicating how well the career matches the student's profile.
  - why: A concise, encouraging explanation of *why* this career is a good fit, referencing their specific background and interests.
  - skillGaps: A description of the key skills the student should focus on developing.
  - starterRoles: A few examples of entry-level job titles for this career path.
  - salaryRange: The typical starting salary range for this career path in Indian Rupees (INR). Format it as "X,XX,XXX - Y,YY,YYY".
  - futureOutlook: A brief, optimistic description of the future outlook for this career path in India.
  - workLifeBalance: A score from 1 (poor) to 10 (excellent) representing the typical work-life balance.
  - fiveYearTrajectory: A brief outline of a possible 5-year career progression.
  - jobListings: Use the getJobListings tool to find a few relevant, live job openings. Include these in your response.

  Student Profile:
  - Education: {{{education}}}
  - Skills: {{{skills}}}
  - Projects: {{{projects}}}
  - Interests: {{{interests}}}

  Format the output as a JSON array of three career suggestions.
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
