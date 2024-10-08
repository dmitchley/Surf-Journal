import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps }: AppProps) {
  const { session, ...restProps } = pageProps;

  return (
    <SessionProvider session={session}>
      <Component {...restProps} />
    </SessionProvider>
  );
}
