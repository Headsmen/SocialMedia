import type { ReactNode } from 'react';
import { MantineProvider } from './MantineProvider';
import { QueryProvider } from './QueryProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <MantineProvider>
        {children}
      </MantineProvider>
    </QueryProvider>
  );
}
