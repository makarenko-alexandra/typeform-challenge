import '@mantine/core/styles.css';
import type { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

interface Props {
  children?: ReactNode;
}

const App = ({ children }: Props) => {
  return (
    <MantineProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </BrowserRouter>
    </MantineProvider>
  );
};

export default App;
