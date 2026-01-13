'use server';

import { enhanceUserPrompt } from '@/ai/flows/enhance-user-prompt';

export async function handleEnhancePrompt(userPrompt: string): Promise<{ enhancedPrompt?: string; error?: string }> {
  if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim().length === 0) {
    return { error: 'Prompt cannot be empty.' };
  }
  
  if (userPrompt.trim().length > 5000) {
    return { error: 'Prompt is too long. Please keep it under 5000 characters.' };
  }

  try {
    const result = await enhanceUserPrompt({ userPrompt });
    return { enhancedPrompt: result.enhancedPrompt };
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    // Return a generic error to the user
    return { error: 'Failed to enhance prompt due to a server error. Please try again later.' };
  }
}
