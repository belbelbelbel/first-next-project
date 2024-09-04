"use client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react'

export const ReactQueryProvider = ({children}: {children:React.ReactNode}) => {
    const [queryClient] = useState(() => new QueryClient());
  return (
    <div>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    </div>
  )
}
