import '@mantine/core/styles.css';
import type { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';

const queryClient = new QueryClient();

interface Props {
  children?: ReactNode;
}

const Builder = lazy(() => import('./pages/Builder'));
const Render = lazy(() => import('./pages/Render'));

const App = ({ children }: Props) => {
  return (
    <MantineProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/builder/:id?" element={<Builder />} />
              <Route path="/render/:id" element={<Render />} />
            </Routes>
            {children}
          </Suspense>
        </QueryClientProvider>
      </BrowserRouter>
    </MantineProvider>
  );
};

export default App;
