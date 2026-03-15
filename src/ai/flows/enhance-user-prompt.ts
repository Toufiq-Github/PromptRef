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
Assign a clear and specific role to the AI.

### Background
Provide essential context and background information.

### Workflow
Break down the task into a step-by-step workflow using bullet points.
- Step 1...
- Step 2...

### Output
Describe the expected output format and style.

**Rules for Enhancement:**
- Every section (Role, Background, Workflow, Output) MUST start on a NEW line.
- You MUST insert a BLANK LINE between each section.
- Preserve the user's original intent.
- Ensure the output is professional and neutral.
- Do NOT answer the prompt yourself. Output ONLY the rewritten prompt.`,
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
