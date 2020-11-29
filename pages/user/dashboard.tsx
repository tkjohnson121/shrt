import { AuthForm, ErrorWrapper, Loading } from 'common';
import { ShrtForm } from 'common/shrt-form';
import { useAuth } from 'features/authentication';
import { ShrtService } from 'features/shrt';
import React from 'react';
import { MdDelete } from 'react-icons/md';
import {
  addDelay,
  AnimatePresence,
  ComponentStyles,
  css,
  easing,
  fadeInDown,
  listAnimation,
  listChildAnimation,
  motion,
} from 'theme';
import { FetchState, ShrtUrl } from 'types';

const styles: ComponentStyles = {
  listWrapper: (theme) => css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-evenly;

    li {
      position:relative;
      flex: 0 1 10%;
      border: 2px solid ${theme.colors.whiteAlpha[700]};
      border-radius: ${theme.radii['md']};
      padding: ${theme.space[6]};
      padding-bottom: ${theme.space[8]}
      margin: ${theme.space[8]};

      & > * {
        line-height: ${theme.lineHeights['taller']};
      }

      a {
        position: relative;
        overflow: hidden;
        display: inline-flex;
        align-items: start;
        padding: ${theme.space[1]} ${theme.space[2]};

        &::after {
          content: '';
          transition: left 150ms cubic-bezier(${easing.join(',')});
          position: absolute;
          bottom: 0;
          left: -100%;
          width: 100%;
          height: 2px;
          background-color: ${theme.colors['primary']};
        }

        &.active::after,
        &:hover::after {
          left: 0;
        }
      }

      button {
        position: absolute;
        bottom: 0;
        right: 0;
        border-top-right-radius: ${theme.radii['md']};
        border-top-left-radius: ${theme.radii['md']};
        border-bottom-left-radius: ${theme.radii['md']};
        background-color: ${theme.colors['error']};
        color: ${theme.colors.whiteAlpha[900]};
        font-size: ${theme.fontSizes.xl};
        margin: 0;
        padding: 0;
        display: flex;
        align-items: stretch;
        justify-content: center;
      }
  `,
};

export default function UserDashboard() {
  const authState = useAuth();

  const [state, setState] = React.useState<
    FetchState<{ links: Array<ShrtUrl & { uid: string }> }>
  >({
    loading: true,
  });

  const onError = (error: Error) => setState({ loading: false, error });

  const onLinkDelete = async (shrt: ShrtUrl & { uid: string }) => {
    try {
      if (!authState.data?.currentUser) {
        throw new Error('Please Login.');
      }

      await ShrtService.deleteShrt(authState.data?.currentUser, shrt.uid);
    } catch (error) {
      onError(error);
    }
  };

  React.useEffect(() => {
    const currentUser = authState.data?.currentUser;
    let unsubscribe: () => void;

    if (currentUser) {
      unsubscribe = ShrtService.openShrtListener(currentUser.uid, (documents) =>
        setState({ loading: false, data: { links: documents } }),
      );
    }

    return () => {
      !!unsubscribe && unsubscribe();
    };
  }, [authState.data?.currentUser]);

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
          {state.data?.links
            .sort((a, b) =>
              new Date(a.created_on).getTime() >
              new Date(b.created_on).getTime()
                ? 1
                : -1,
            )
            .map((shrt) => (
              <motion.li
                key={shrt.shrt_url}
                variants={addDelay(listChildAnimation, 0.5)}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <pre>
                  URL:{' '}
                  <a
                    href={shrt.url || ''}
                    target="_new"
                    rel="noreferrer noopener"
                  >
                    {shrt.url}
                  </a>
                </pre>

                <pre>
                  SHRT URL:{' '}
                  <a
                    href={shrt.shrt_url || ''}
                    target="_new"
                    rel="noreferrer noopener"
                  >
                    {shrt.shrt_url}
                  </a>
                </pre>

                <pre>
                  Created on: {new Date(shrt.created_on).toLocaleDateString()}
                </pre>

                <button onClick={() => onLinkDelete(shrt)}>
                  <MdDelete />
                </button>
              </motion.li>
            ))}
        </AnimatePresence>
      </motion.ul>
    </>
  ) : (
    <AuthForm />
  );
}
