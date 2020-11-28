import { Layout } from 'common';
import { AppProps } from 'next/app';
import Head from 'next/head';
import * as React from 'react';
import { ThemeProvider } from '../features/theme';

/**
 * # App
 *
 * A wrapper for our client-side app.
 * Implemented with Next.JS, this is out custom verison.
 *
 * - Installs and registers service-worker in {@link public/service-worker.js}
 * - Open and maintains a listener for authentication
 * - Opens, maintains, and passes down userData
 * - Determines the layout to give based on the route and user's auth level
 *
 * @note The last two points above would be the first place to start
 *  for state-management
 */
export default function App({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js', {
            scope: '/',
          })
          .then(function (registration) {
            console.info('SW: registered -> ', registration);
          })
          .catch(function (registrationError) {
            console.info('SW: failed -> ', registrationError);
          });
      });
    }
  }, []);

  return (
    <ThemeProvider>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />
      </Head>

      <Layout title="Shrt | A GVEMPIRE product">
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
