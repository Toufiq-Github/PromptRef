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
  prompt: `You are a prompt enhancement assistant.

Your task is to rewrite user-provided text into a clear, structured, and detailed prompt suitable for any AI platform.

Rules:
- Fix all grammar, spelling, and sentence structure issues.
- Preserve the original intent exactly.
- Clarify vague or incomplete instructions where necessary.
- Do NOT answer the prompt.
- Do NOT introduce new requirements or assumptions.
- Do NOT include explanations, notes, or formatting comments.
- Output ONLY the enhanced prompt in professional, neutral English.

User Prompt: {{{userPrompt}}}`,
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
