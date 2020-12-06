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
} from 'theme';

const styles: ComponentStyles = {
  listWrapper: () => css`
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: space-around;
  `,
};

export default function ShrtDashboard() {
  const authState = useAuth();
  const { state } = useUserShrtListener();

  if (state.loading) return <Loading />;
  if (state.error) return <ErrorWrapper error={state.error} />;

  return authState.data?.isAuthenticated ? (
    <>
      <motion.h1
        className="display"
        variants={fadeInDown}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        User Dashboard
      </motion.h1>

      <ShrtForm />

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
