import { css } from '@emotion/core';
import { useAuth } from 'features/authentication';
import { pageTransition } from 'features/theme';
import { AnimatePresence, motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import ErrorWrapper from './error-wrapper';
import Header from './header';

export const Layout = ({
  children,
  title = 'Shrt | A GVEMPIRE Product',
}: {
  children?: ReactNode;
  title?: string;
}) => {
  const router = useRouter();
  const { error } = useAuth();

  const menuRef = React.useRef<HTMLElement>(null);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Header heightRef={menuRef} />

      {error ? (
        <ErrorWrapper error={error} />
      ) : (
        <AnimatePresence exitBeforeEnter>
          <motion.main
            variants={pageTransition}
            css={css`
              min-height: 100vh;
              padding: 0 5%;
              padding-top: ${menuRef.current?.clientHeight || 15 * 2}px;
            `}
            initial={'initial'}
            animate={'animate'}
            exit={'exit'}
            key={router?.route}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      )}

      <footer css={{ margin: '2rem auto', textAlign: 'center' }}>
        <span>
          Built with 💜 by{' '}
          <a href="https://gvempire.dev" target="_new">
            GVEMPIRE
          </a>{' '}
        </span>
      </footer>
    </>
  );
};

export default Layout;
