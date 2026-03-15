'use client';

import { useState } from 'react';
import { Copy, Wand2, Loader2, Check, ExternalLink } from 'lucide-react';
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

  const performEnhancement = async () => {
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    performEnhancement();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      performEnhancement();
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

  const handleOpenChatGPT = () => {
    if (enhancedPrompt) {
      const url = `https://chatgpt.com/?q=${encodeURIComponent(enhancedPrompt)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8 md:p-12 lg:p-16">
      <div className="w-full max-w-3xl space-y-8 sm:space-y-12">
        <header className="flex flex-col items-center text-center space-y-3">
          <h1 className="text-foreground text-4xl sm:text-6xl font-black tracking-tighter uppercase">
            PromptRefiner
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground font-medium max-w-md">
            Professional engineering for high-performance AI prompts.
          </p>
        </header>

        <Card className="w-full border-border bg-card shadow-2xl">
          <CardHeader className="p-5 sm:p-8">
            <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">Input Prompt</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Enter your raw idea or rough draft below.</CardDescription>
          </CardHeader>
          <CardContent className="p-5 sm:p-8 pt-0 sm:pt-0">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Textarea
                placeholder="Example: Write a blog post about the benefits of solar energy..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={4}
                className="resize-none border-border bg-muted/30 focus-visible:ring-primary text-foreground text-base p-4 sm:p-5"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold transition-all hover:bg-primary/90 active:scale-[0.98]" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-5 w-5" />
                )}
                {isLoading ? 'Processing...' : 'Refine Prompt'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {(isLoading || enhancedPrompt) && (
          <Card className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 border-border bg-card shadow-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-5 sm:p-8 border-b border-border/50">
              <div className="space-y-1">
                <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">Output</CardTitle>
                <CardDescription className="hidden sm:block text-muted-foreground">Professionally structured result.</CardDescription>
              </div>
              {!isLoading && enhancedPrompt && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="hidden sm:flex border-border hover:bg-accent font-bold text-foreground"
                    onClick={handleCopy}
                    disabled={isCopied}
                  >
                    {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {isCopied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4"
                    onClick={handleOpenChatGPT}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    ChatGPT
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative group">
                <Textarea
                  value={isLoading ? 'Refining logic and applying engineering templates...' : enhancedPrompt}
                  readOnly
                  rows={14}
                  className={cn(
                    'w-full border-none bg-transparent text-foreground leading-relaxed font-body text-sm sm:text-base p-6 sm:p-10 focus-visible:ring-0 resize-none',
                    !isLoading && 'textarea-output'
                  )}
                />
              </div>
              
              {!isLoading && enhancedPrompt && (
                <div className="p-5 sm:hidden bg-muted/30 border-t border-border">
                  <Button
                    variant="secondary"
                    className="w-full font-bold h-12 text-foreground"
                    onClick={handleCopy}
                    disabled={isCopied}
                  >
                    {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {isCopied ? 'Copied to Clipboard' : 'Copy Refined Prompt'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <footer className="text-center py-12 space-y-2 opacity-40">
          <p className="text-xs font-bold tracking-widest uppercase text-foreground">
            PromptRefiner Enterprise v1.1
          </p>
          <p className="text-[10px] text-foreground">
            Powered by Genkit & Gemini 2.5 Flash
          </p>
        </footer>
      </div>
    </main>
  );
}
