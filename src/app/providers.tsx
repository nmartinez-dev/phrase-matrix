"use client";

import type { ReactNode } from 'react';
import { PhraseProvider } from '@/contexts/phrase-context';
import { ThemeProvider } from 'next-themes';

type ProvidersProps = {
  children: ReactNode;
}

const Providers = (props: ProvidersProps) => {
  const { children } = props;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <PhraseProvider>
        {children}
      </PhraseProvider>
    </ThemeProvider>
  );
}

export default Providers;
