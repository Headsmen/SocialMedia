import { MantineProvider as MantineUIProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import type { ReactNode } from 'react';

const theme = createTheme({
  /** Здесь можно настроить тему Mantine */
  // primaryColor: 'blue',
  // fontFamily: 'Inter, sans-serif',
});

interface MantineProviderProps {
  children: ReactNode;
}

export function MantineProvider({ children }: MantineProviderProps) {
  return (
    <MantineUIProvider theme={theme} defaultColorScheme="dark">
      <Notifications position="top-right" />
      {children}
    </MantineUIProvider>
  );
}
