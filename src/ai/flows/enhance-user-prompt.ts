'use server';

/**
 * @fileOverview A flow to enhance user-provided prompts for better AI tool effectiveness.
 *
 * - enhanceUserPrompt - A function that takes a user prompt and returns an enhanced version.
 * - EnhanceUserPromptInput - The input type for the enhanceUserPrompt function.
 * - EnhanceUserPromptOutput - The return type for the enhanceUserPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceUserPromptInputSchema = z.object({
  userPrompt: z
    .string()
    .describe('The user-provided prompt that needs to be enhanced.'),
});
export type EnhanceUserPromptInput = z.infer<typeof EnhanceUserPromptInputSchema>;

const EnhanceUserPromptOutputSchema = z.object({
  enhancedPrompt: z
    .string()
    .describe('The enhanced and well-structured prompt for AI tools.'),
});
export type EnhanceUserPromptOutput = z.infer<typeof EnhanceUserPromptOutputSchema>;

export async function enhanceUserPrompt(input: EnhanceUserPromptInput): Promise<EnhanceUserPromptOutput> {
  return enhanceUserPromptFlow(input);
}

const enhanceUserPromptPrompt = ai.definePrompt({
  name: 'enhanceUserPromptPrompt',
  input: {schema: EnhanceUserPromptInputSchema},
  output: {schema: EnhanceUserPromptOutputSchema},
  prompt: `You are a world-class prompt engineer. Your purpose is to take a user's rough idea and transform it into a detailed, structured, and effective prompt for an AI model.

Your task is to rewrite the following user prompt, incorporating the elements below.

**User Prompt:**
"{{{userPrompt}}}"

**Rewrite the prompt with the following structure:**

### Role
Assign a clear and specific role to the AI. What persona should it adopt? (e.g., "You are a senior software architect specializing in cloud-native applications.")

### Background
Provide essential context and background information that the AI needs to understand the task fully. (e.g., "Our company is a mid-sized e-commerce business looking to migrate from a monolithic architecture to microservices.")

### Workflow
Break down the task into a step-by-step workflow using bullet points. Be explicit and thorough.
- Start with the primary objective.
- List out each step required to achieve the objective.
- Specify constraints, requirements, and any formats to follow.

### Output
Describe the expected output. What should the final result look like? (e.g., "The output should be a JSON object containing a list of recommended microservices, with each service having a name, a description of its responsibility, and a list of potential technologies to use.")

**Rules for Enhancement:**
- Preserve the user's original intent without introducing new, unsolicited requirements.
- Correct all grammar, spelling, and punctuation errors.
- Ensure the "Role", "Background", "Workflow", and "Output" sections are each on a new line.
- Clarify ambiguities and fill in logical gaps where necessary to create a complete prompt.
- Do NOT answer the prompt yourself. Your only output is the rewritten, enhanced prompt.
- Do not include any of your own explanations, notes, or meta-comments in the output.
- Output ONLY the enhanced prompt in professional, neutral English.`,
  config: {
    temperature: 0.3,
  },
});

const enhanceUserPromptFlow = ai.defineFlow(
  {
    name: 'enhanceUserPromptFlow',
    inputSchema: EnhanceUserPromptInputSchema,
    outputSchema: EnhanceUserPromptOutputSchema,
  },
  async input => {
    const {output} = await enhanceUserPromptPrompt(input);
    return output!;
  }
);
