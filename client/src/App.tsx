import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Placeholder for Radix UI Provider (not installed)
// import { RadixProvider } from 'radix-ui';

const queryClient = new QueryClient();

interface Props {
  children?: ReactNode;
}

const App = ({ children }: Props) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {/* RadixProvider would go here if installed */}
        {children}
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
