import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Prompt Refiner',
  description: 'Enhance your AI prompts for better results.',
  icons: {
    // Note: In a production environment, you would place your image in the public folder as favicon.png
    // For now, I'm using a placeholder that represents the intent to use your uploaded image.
    icon: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=100&h=100&auto=format&fit=crop',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
