import { css } from '@emotion/core';
import { useAuth } from 'features/authentication';
import {
  addDelay,
  ComponentStyles,
  easing,
  fadeInUp,
  listAnimation,
  listChildAnimation,
  motion,
} from 'features/theme';
import { UserService } from 'features/user';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { FetchState, ShrtUserDocument } from 'types';
import ErrorWrapper from './error-wrapper';
import Loading from './loading';

const styles: ComponentStyles = {
  headerWrapper: (theme) => css`
    padding: ${theme.space[4]} ${theme.space[8]};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    background-color: ${theme.colors.blackAlpha[700]};
    display: flex;
    align-items: stretch;
    justify-content: space-between;

    a {
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      padding: ${theme.space[2]} ${theme.space[4]};

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

    nav {
      display: flex;
      align-items: stretch;
      justify-content: space-between;

      img {
        border-radius: ${theme.radii['full']};
      }
    }
  `,
};

const defaultLinks = [{ text: 'Home', href: '/' }];
const authLinks = [
  { text: 'Home', href: '/' },
  { text: 'Dashboard', href: '/user/dashboard' },
];

export const Header: React.FC<{
  heightRef: React.RefObject<HTMLElement>;
}> = ({ heightRef }) => {
  const authState = useAuth();
  const router = useRouter();

  const isLinkActive = (href: string) =>
    router?.pathname === href.toLowerCase() ? 'active' : 'inactive';

  const [state, setState] = React.useState<
    FetchState<{ userData?: ShrtUserDocument; avatar?: string }>
  >({ loading: false });

  React.useEffect(() => {
    const getAvatar = async () => {
      const avatar = (await UserService.getUserAvatarById(
        authState.data?.currentUser?.uid,
      )) as string;

      setState((prev) => ({ loading: false, data: { ...prev.data, avatar } }));
    };

    if (
      authState.data?.isAuthenticated &&
      authState.data?.currentUser &&
      !state.data?.avatar
    ) {
      getAvatar();
    }
  }, [authState.data?.isAuthenticated]);

  React.useEffect(() => {
    let unsubscribe: () => void;

    if (authState.data?.isAuthenticated && authState.data?.currentUser) {
      unsubscribe = UserService.openUserDocumentListener(
        authState.data?.currentUser?.uid,
        (document) =>
          setState((prev) => ({
            loading: false,
            data: { ...prev.data, userData: document },
          })),
      );
    }

    return () => {
      !!unsubscribe && unsubscribe();
    };
  }, [authState.data?.isAuthenticated]);

  if (state.loading) return <Loading />;

  if (state.error) return <ErrorWrapper error={state.error} />;

  return (
    <header ref={heightRef} css={styles.headerWrapper}>
      <Link href="/">
        <motion.a
          className={isLinkActive('/')}
          variants={addDelay(fadeInUp, 0.5)}
          initial="initial"
          animate="animate"
          exit="exit"
          key="home"
        >
          <Image
            src={'/gvempire-logo.png'}
            alt="GVEMPIRE.dev logo"
            height="50px"
            width="50px"
            style={{ cursor: 'pointer' }}
          />
        </motion.a>
      </Link>

      <motion.nav
        variants={addDelay(listAnimation, 1)}
        initial="initial"
        animate="animate"
        key="nav"
      >
        {(authState.data?.isAuthenticated ? authLinks : defaultLinks).map(
          (link) => (
            <Link href={link.href} key={link.text}>
              <motion.a
                className={isLinkActive(link.href)}
                variants={listChildAnimation}
                initial="initial"
                animate="animate"
                exit="exit"
                key={link.text}
              >
                {link.text}
              </motion.a>
            </Link>
          ),
        )}

        <Link
          href={
            state.data?.userData?.username
              ? `/user/${state.data?.userData?.username}`
              : '/user/settings'
          }
        >
          <motion.a
            className={isLinkActive('/user/settings')}
            variants={addDelay(fadeInUp, 0.7)}
            initial="initial"
            animate="animate"
            exit="exit"
            key="profile"
          >
            <img
              src={state.data?.avatar || '/gvempire-logo.png'}
              alt={`${
                authState.data?.currentUser?.displayName || 'GVEMPIRE.dev'
              } logo`}
              height="50px"
              width="50px"
            />
          </motion.a>
        </Link>
      </motion.nav>
    </header>
  );
};

export default Header;
