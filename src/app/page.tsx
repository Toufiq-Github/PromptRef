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
          <h1 className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-4xl sm:text-6xl font-black tracking-tighter text-transparent">
            PromptRefiner
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground font-medium max-w-md">
            The professional standard for engineering high-performance AI prompts.
          </p>
        </header>

        <Card className="w-full border-primary/20 bg-card/40 backdrop-blur-md shadow-2xl">
          <CardHeader className="p-5 sm:p-8">
            <CardTitle className="text-xl sm:text-2xl font-bold">Input Prompt</CardTitle>
            <CardDescription className="text-sm">Enter your raw idea or rough draft below.</CardDescription>
          </CardHeader>
          <CardContent className="p-5 sm:p-8 pt-0 sm:pt-0">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Textarea
                placeholder="Example: Write a blog post about the benefits of solar energy..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={4}
                className="resize-none border-primary/20 bg-muted/20 focus-visible:ring-primary/50 text-white text-base p-4 sm:p-5"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98]" 
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
          <Card className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 border-accent/20 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-5 sm:p-8 border-b border-accent/10">
              <div className="space-y-1">
                <CardTitle className="text-xl sm:text-2xl font-bold text-accent">Output</CardTitle>
                <CardDescription className="hidden sm:block">Professionally structured result.</CardDescription>
              </div>
              {!isLoading && enhancedPrompt && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="hidden sm:flex border-accent/30 hover:bg-accent/10 hover:text-accent font-bold"
                    onClick={handleCopy}
                    disabled={isCopied}
                  >
                    {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {isCopied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button
                    className="bg-accent hover:bg-accent/90 text-white font-bold px-4"
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
                    'w-full border-none bg-transparent text-foreground leading-relaxed font-body text-sm sm:text-base p-6 sm:p-10 focus-visible:ring-0',
                    !isLoading && 'textarea-output'
                  )}
                />
              </div>
              
              {!isLoading && enhancedPrompt && (
                <div className="p-5 sm:hidden bg-muted/30 border-t border-accent/10">
                  <Button
                    variant="secondary"
                    className="w-full font-bold h-12"
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
          <p className="text-xs font-bold tracking-widest uppercase">
            PromptRefiner Enterprise v1.0
          </p>
          <p className="text-[10px]">
            Powered by Genkit & Gemini 2.5 Flash
          </p>
        </footer>
      </div>
    </main>
  );
}
