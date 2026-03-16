'use client';

import { useState, useRef, useEffect } from 'react';
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
  
  const outputRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll logic when enhanced prompt arrives
  useEffect(() => {
    if (enhancedPrompt && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [enhancedPrompt]);

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
        <header className="flex flex-col items-center text-center space-y-6">
          <h1 className="text-foreground text-4xl sm:text-6xl font-extralight tracking-[0.2em] uppercase">
            Prompt Refiner
          </h1>
          <div className="w-12 h-px bg-primary/30" />
          <p className="text-sm sm:text-base text-primary/70 font-light tracking-[0.3em] uppercase">
            Enhance your thoughts.
          </p>
        </header>

        <div className="w-full space-y-8">
          <Card className="w-full border-primary/20 bg-card/30 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all duration-500 rounded-xl overflow-hidden">
            <CardContent className="p-6 sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="relative group">
                  <div className="absolute -inset-px bg-gradient-to-b from-primary/30 to-transparent rounded-lg opacity-20 group-focus-within:opacity-100 transition duration-700 pointer-events-none"></div>
                  <Textarea
                    placeholder="Input Prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={8}
                    className="relative resize-none border-primary/20 bg-black/80 focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/50 text-foreground text-lg p-8 transition-all duration-500 min-h-[250px] font-light leading-relaxed placeholder:text-primary/40 shadow-inner rounded-lg"
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-14 sm:h-16 text-sm font-light tracking-[0.4em] uppercase transition-all bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] rounded-none shadow-2xl" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  ) : (
                    <Wand2 className="mr-3 h-5 w-5" />
                  )}
                  {isLoading ? 'Refining...' : 'Refine'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {(isLoading || enhancedPrompt) && (
            <div ref={outputRef} className="pt-4 scroll-mt-8">
              <Card className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 border-primary/10 bg-card/40 shadow-2xl overflow-hidden rounded-xl border-t-primary/20">
                <CardHeader className="flex flex-row items-center justify-between p-6 sm:p-8 border-b border-primary/5">
                  <CardTitle className="text-xs font-light text-primary/60 uppercase tracking-[0.3em]">Refined Output</CardTitle>
                  {!isLoading && enhancedPrompt && (
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        className="hidden sm:flex hover:bg-primary/10 font-light text-primary/80 h-10 px-4 text-xs tracking-widest uppercase transition-all"
                        onClick={handleCopy}
                        disabled={isCopied}
                      >
                        {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        {isCopied ? 'Copied' : 'Copy'}
                      </Button>
                      <Button
                        variant="default"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-6 h-10 uppercase tracking-widest text-[10px] sm:text-xs transition-all hover:scale-105 active:scale-95 shadow-lg"
                        onClick={handleOpenChatGPT}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        ChatGPT
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-0 bg-black/40">
                  <div className="relative">
                    <Textarea
                      value={isLoading ? 'Architecting your prompt...' : enhancedPrompt}
                      readOnly
                      rows={18}
                      className={cn(
                        'w-full border-none bg-transparent text-foreground/90 leading-relaxed font-light text-base sm:text-lg p-8 sm:p-12 focus-visible:ring-0 resize-none min-h-[450px]',
                        !isLoading && 'textarea-output'
                      )}
                    />
                  </div>
                  
                  {!isLoading && enhancedPrompt && (
                    <div className="p-6 sm:hidden border-t border-primary/5 bg-black/20 space-y-3">
                      <Button
                        variant="secondary"
                        className="w-full font-light h-14 text-foreground uppercase tracking-[0.2em] text-xs"
                        onClick={handleCopy}
                        disabled={isCopied}
                      >
                        {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        {isCopied ? 'Copied' : 'Copy Result'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <footer className="text-center py-12 opacity-30">
          <p className="text-[10px] font-light tracking-[0.5em] uppercase text-primary">
            Prompt Refiner • Professional Series
          </p>
        </footer>
      </div>
    </main>
  );
}
