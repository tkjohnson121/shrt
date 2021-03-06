import { ErrorWrapper, Loading } from 'common';
import { AuthForm, useAuth } from 'features/auth';
import { ShrtCard, ShrtForm, useShrtListener } from 'features/shrt';
import React from 'react';
import {
  AnimatePresence,
  ComponentStyles,
  css,
  fadeInDown,
  listAnimation,
  motion,
  Theme,
} from 'theme';

const styles: ComponentStyles = {
  listWrapper: (theme) => css`
    padding: ${theme.space[4]};
    max-width: ${theme.space['6xl']};
    margin: 0 auto;
  `,

  header: (theme: Theme) => css`
    max-width: ${theme.space['6xl']};
    margin: 0 auto;
  `,
};

/**
 * # ShrtDashboard
 * @packageDescription
 *
 * @todo add sort by: clicks, date created (asc, desc)
 * @todo add share, QR code to action
 */
export default function ShrtDashboard() {
  const authState = useAuth();
  const [state] = useShrtListener();

  if (state.loading) return <Loading />;

  if (/login/gi.test(state.error?.message)) return <AuthForm />;
  else if (state.error) return <ErrorWrapper error={state.error} />;

  return authState.data?.isAuthenticated ? (
    <>
      <header css={styles.header}>
        <motion.h1
          className="display"
          variants={fadeInDown}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          User Dashboard
        </motion.h1>

        {state.data && (
          <ul>
            <li>Total Clicks: {state.data?.totalClicks}</li>
            <li>Most Visited: {state.data.mostVisited.shrt_id}</li>
          </ul>
        )}

        <ShrtForm withId />
      </header>

      <motion.ul
        css={styles.listWrapper}
        variants={listAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <AnimatePresence>
          {state.data?.shrts
            .sort((a, b) =>
              new Date(a.created_on).getTime() <
              new Date(b.created_on).getTime()
                ? 1
                : -1,
            )
            .map((shrt) => (
              <ShrtCard key={shrt.shrt_id} as="li" shrt={shrt} />
            ))}
        </AnimatePresence>
      </motion.ul>
    </>
  ) : (
    <AuthForm />
  );
}
