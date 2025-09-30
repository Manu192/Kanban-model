'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryclient } from '@/lib/queryclient';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryclient}>
      {children}
    </QueryClientProvider>
  );
}
