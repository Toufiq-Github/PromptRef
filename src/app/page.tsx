'use client';

import { useState } from 'react';
import { Copy, Wand2, Loader2, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <div className="w-full max-w-3xl space-y-12 sm:space-y-16">
        <header className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-foreground text-5xl sm:text-7xl font-black tracking-tighter uppercase">
            Prompt Refiner
          </h1>
          <p className="text-base sm:text-xl text-primary font-medium tracking-wide">
            Enhance your thoughts. Refine your intent.
          </p>
        </header>

        <Card className="w-full border-primary/20 bg-card shadow-[0_0_50px_-12px_rgba(255,255,255,0.05)] transition-all duration-500">
          <CardHeader className="p-6 sm:p-10">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground text-center sm:text-left">Input Prompt</CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-10 pt-0 sm:pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg blur opacity-30 group-focus-within:opacity-100 transition duration-500"></div>
                <Textarea
                  placeholder=""
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={6}
                  className="relative resize-none border-primary/20 bg-black/40 focus-visible:ring-primary/40 focus-visible:border-primary text-foreground text-lg p-6 sm:p-8 transition-all duration-300 min-h-[200px]"
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-14 sm:h-16 text-lg sm:text-xl font-black tracking-widest uppercase transition-all hover:bg-primary/90 active:scale-[0.98] shadow-lg" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                ) : (
                  <Wand2 className="mr-3 h-6 w-6" />
                )}
                {isLoading ? 'Refining...' : 'Refine'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {(isLoading || enhancedPrompt) && (
          <Card className="w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 border-primary/20 bg-card shadow-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-6 sm:p-10 border-b border-primary/10">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-tight">Output</CardTitle>
              {!isLoading && enhancedPrompt && (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="hidden sm:flex border-primary/30 hover:bg-primary/10 font-bold text-foreground h-11 px-6"
                    onClick={handleCopy}
                    disabled={isCopied}
                  >
                    {isCopied ? <Check className="mr-2 h-5 w-5" /> : <Copy className="mr-2 h-5 w-5" />}
                    {isCopied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-6 h-11 uppercase tracking-tighter"
                    onClick={handleOpenChatGPT}
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    ChatGPT
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0 bg-black/20">
              <div className="relative">
                <Textarea
                  value={isLoading ? 'Reconstructing your prompt with professional engineering patterns...' : enhancedPrompt}
                  readOnly
                  rows={16}
                  className={cn(
                    'w-full border-none bg-transparent text-foreground leading-relaxed font-body text-base sm:text-lg p-8 sm:p-12 focus-visible:ring-0 resize-none min-h-[400px]',
                    !isLoading && 'textarea-output'
                  )}
                />
              </div>
              
              {!isLoading && enhancedPrompt && (
                <div className="p-6 sm:hidden bg-primary/5 border-t border-primary/10">
                  <Button
                    variant="secondary"
                    className="w-full font-black h-14 text-foreground uppercase tracking-widest"
                    onClick={handleCopy}
                    disabled={isCopied}
                  >
                    {isCopied ? <Check className="mr-2 h-5 w-5" /> : <Copy className="mr-2 h-5 w-5" />}
                    {isCopied ? 'Copied' : 'Copy Result'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <footer className="text-center py-16 space-y-3 opacity-20 hover:opacity-50 transition-opacity duration-700">
          <p className="text-xs font-black tracking-[0.3em] uppercase text-foreground">
            Prompt Refiner v1.2
          </p>
          <p className="text-[10px] text-foreground font-medium">
            Powered by Genkit • Engineered for Intelligence
          </p>
        </footer>
      </div>
    </main>
  );
}
