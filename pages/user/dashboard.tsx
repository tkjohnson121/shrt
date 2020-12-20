import {
  AuthForm,
  ErrorWrapper,
  Loading,
  ShrtCard,
  useUserShrtListener,
} from 'common';
import { ShrtForm } from 'common/shrt-form';
import { useAuth } from 'features/authentication';
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
 */
export default function ShrtDashboard() {
  const authState = useAuth();
  const { state } = useUserShrtListener();

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
            <li>
              Most Visited:{' '}
              <ShrtCard as="span" shrt={state.data?.mostVisited} />
            </li>
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
