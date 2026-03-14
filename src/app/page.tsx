'use client';

import { useState, useMemo } from 'react';
import { Copy, Wand2, Loader2, Check, History, LogOut, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { handleEnhancePrompt } from './actions';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import Link from 'next/link';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const db = useFirestore();

  // Fetch history if logged in
  const historyQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'users', user.uid, 'history'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
  }, [db, user]);

  const { data: historyItems } = useCollection(historyQuery);

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
        const enhanced = result.enhancedPrompt || '';
        setEnhancedPrompt(enhanced);
        
        // Save to history if logged in
        if (user && db) {
          addDoc(collection(db, 'users', user.uid, 'history'), {
            originalPrompt: prompt,
            enhancedPrompt: enhanced,
            createdAt: serverTimestamp(),
          });
        }
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await performEnhancement();
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

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
              PromptRefiner
            </h1>
            <p className="mt-2 text-muted-foreground">
              Refined. Precise. Powerful.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="hidden text-sm text-muted-foreground md:inline-block">
                  {user.email}
                </span>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </header>

        <Card className="w-full border-primary/20 bg-card/50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Input Prompt</CardTitle>
            <CardDescription>Press Enter to enhance instantly.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Describe your idea here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={5}
                className="resize-none border-primary/10 bg-muted/30 focus-visible:ring-primary/50"
                disabled={isLoading}
              />
              <Button type="submit" className="w-full shadow-lg shadow-primary/10" disabled={isLoading}>
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
          <Card className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 border-accent/20 bg-background/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-accent">Enhanced Prompt</CardTitle>
              <CardDescription>The final, refined output.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Textarea
                  value={isLoading ? 'Refining your prompt...' : enhancedPrompt}
                  readOnly
                  rows={15}
                  className={cn(
                    'resize-none border-accent/30 bg-black/40 text-foreground/90 leading-relaxed font-body',
                    !isLoading && 'textarea-output'
                  )}
                  placeholder="Your enhanced prompt will appear here..."
                />
                {!isLoading && enhancedPrompt && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 text-muted-foreground hover:text-accent disabled:opacity-100"
                    onClick={handleCopy}
                    disabled={isCopied}
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

        {user && historyItems && historyItems.length > 0 && (
          <Card className="w-full border-muted-foreground/10 bg-card/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-medium flex items-center">
                  <History className="mr-2 h-4 w-4" />
                  Recent History
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {historyItems.map((item: any) => (
                <div 
                  key={item.id} 
                  className="group cursor-pointer rounded-md border border-muted p-3 hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setPrompt(item.originalPrompt);
                    setEnhancedPrompt(item.enhancedPrompt);
                  }}
                >
                  <p className="line-clamp-1 text-sm text-muted-foreground">
                    {item.originalPrompt}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/50">
                    {item.createdAt?.toDate().toLocaleString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {!user && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              <Link href="/signup" className="text-primary hover:underline">Create an account</Link> to save your history.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
