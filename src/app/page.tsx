'use client';

import { useState } from 'react';
import { Copy, Wand2, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { handleEnhancePrompt } from './actions';
import { cn } from '@/lib/utils';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt to enhance.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setEnhancedPrompt('');
    try {
      const result = await handleEnhancePrompt(prompt);
      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        setEnhancedPrompt(result.enhancedPrompt || '');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (enhancedPrompt && !isCopied) {
      navigator.clipboard.writeText(enhancedPrompt);
      toast({
        title: 'Copied!',
        description: 'The enhanced prompt has been copied to your clipboard.',
      });
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center">
          <h1 className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            PromptRefiner
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Transform your rough ideas into powerful, precise AI prompts.
          </p>
        </header>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Your Prompt</CardTitle>
            <CardDescription>Enter the prompt you want to enhance.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="e.g., make a picture of a cat in space, but make it cool"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                className="resize-none"
                disabled={isLoading}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Enhancing...' : 'Enhance Prompt'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {(isLoading || enhancedPrompt) && (
          <Card className="w-full animate-in fade-in duration-500">
            <CardHeader>
              <CardTitle>Enhanced Prompt</CardTitle>
              <CardDescription>Ready to copy and use with your favorite AI tool.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Textarea
                  value={isLoading ? 'Generating your enhanced prompt...' : enhancedPrompt}
                  readOnly
                  rows={8}
                  className={cn(
                    'resize-none',
                    !isLoading && 'textarea-output'
                  )}
                  placeholder="Your enhanced prompt will appear here..."
                />
                {!isLoading && enhancedPrompt && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 text-muted-foreground hover:text-foreground disabled:opacity-100"
                    onClick={handleCopy}
                    disabled={isCopied}
                    aria-label={isCopied ? 'Copied' : 'Copy to clipboard'}
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
