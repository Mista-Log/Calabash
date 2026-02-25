"use client";

/**
 * React Query Providers for Calabash
 * Wraps app with QueryClientProvider and DevTools
 */

import * as React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from '@/lib/query-client';

interface QueryProvidersProps {
  children: React.ReactNode;
}

// Create query client once per render on server, singleton on client
const queryClient = getQueryClient();

export function QueryProviders({ children }: QueryProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      
      {/* DevTools only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}
