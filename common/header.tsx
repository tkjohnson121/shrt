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
import { NextRouter, useRouter } from 'next/router';
import React from 'react';
import { FetchState } from 'types';
import ErrorWrapper from './error-wrapper';
import Loading from './loading';
import { useUserDocumentListener } from './use-user-document-listener';

const styles: ComponentStyles = {
  headerWrapper: (theme) => css`
    padding: ${theme.space[2]} ${theme.space[4]};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    background-color: ${theme.colors.background};
    box-shadow: ${theme.shadows['md']};
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    z-index: 9999;

    a {
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
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

const isLinkActive = (href: string, router: NextRouter, username?: string) =>
  router?.pathname === href.toLowerCase() ||
  router?.pathname.startsWith(`/${username}`)
    ? 'active'
    : 'inactive';

export const Avatar: React.FC<{
  uid?: string;
  username?: string;
  css?: ComponentStyles;
}> = ({ username, uid }) => {
  const router = useRouter();

  const { data } = useAuth();

  const [state, setState] = React.useState<FetchState<{ url?: string }>>({
    loading: false,
    data: { url: '/gvempire-logo.png' },
  });

  React.useEffect(() => {
    const getAvatar = async () => {
      if (uid && !state.data?.url) {
        const avatar = await UserService.getUserAvatarById(uid);

        setState((prev) => ({
          loading: false,
          data: { ...prev.data, avatar },
        }));
      }
    };

    getAvatar();
  }, [data?.isAuthenticated, data?.currentUser]);

  if (state.loading) return <Loading />;

  if (state.error) {
    return <ErrorWrapper error={state.error} />;
  }

  return (
    <Link href={username ? `/${username}` : '/user/settings'}>
      <motion.a
        className={
          isLinkActive('/user/settings', router) ||
          isLinkActive(`/${username}`, router)
        }
        css={css}
        variants={addDelay(fadeInUp, 0.7)}
        initial="initial"
        animate="animate"
        exit="exit"
        key="profile"
      >
        {username && state.data?.url ? (
          <img
            src={'/gvempire-logo.png'}
            alt={`${'GVEMPIRE.dev'} logo`}
            height="50px"
            width="50px"
          />
        ) : (
          'Profile'
        )}
      </motion.a>
    </Link>
  );
};

const defaultLinks = [{ text: 'Home', href: '/' }];
const authLinks = [
  { text: 'Home', href: '/' },
  { text: 'Dashboard', href: '/user/dashboard' },
];

export const Header: React.FC<{
  heightRef: React.RefObject<HTMLElement>;
}> = ({ heightRef }) => {
  const router = useRouter();

  const authState = useAuth();
  const { currentUser, isAuthenticated } = authState.data || {};

  const {
    state: { data: userDocument },
  } = useUserDocumentListener(currentUser?.uid);

  return (
    <header ref={heightRef} css={styles.headerWrapper}>
      <Link href="/">
        <motion.a
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
        {(isAuthenticated ? authLinks : defaultLinks).map((link) => (
          <Link href={link.href} key={link.text}>
            <motion.a
              className={isLinkActive(
                link.href,
                router,
                userDocument?.username,
              )}
              variants={listChildAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
              key={link.text}
            >
              {link.text}
            </motion.a>
          </Link>
        ))}

        <Avatar username={userDocument?.username} uid={currentUser?.uid} />
      </motion.nav>
    </header>
  );
};

export default Header;
