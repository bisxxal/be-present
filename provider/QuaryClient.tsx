'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
type Props = {
  children: React.ReactNode,
}
const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      staleTime: Infinity
    }
  }
})

const ReactQueryProvider = ({ children, ...props }: Props) => {
  return (<QueryClientProvider client={client}>
    <SessionProvider>
      <NextThemesProvider {...props}>
        {children}
      </NextThemesProvider>
    </SessionProvider>
  </QueryClientProvider>)
}

export default ReactQueryProvider
