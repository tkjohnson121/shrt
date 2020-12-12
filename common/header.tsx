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
  router?.pathname.startsWith(`/user/${username}`)
    ? 'active'
    : 'inactive';

export const Avatar: React.FC<{
  username?: string;
  css?: ComponentStyles;
}> = ({ username }) => {
  const router = useRouter();

  const { data } = useAuth();

  const [state, setState] = React.useState<FetchState<{ avatar: string }>>({
    loading: true,
    data: { avatar: '/logo.svg' },
  });

  React.useEffect(() => {
    const getAvatar = async () => {
      if (data?.currentUser && state.loading === true) {
        try {
          const avatar = await UserService.getUserFileByPath(
            data.currentUser.uid,
            'profile/avatar',
          );

          setState((prev) => ({
            ...prev,
            loading: false,
            data: { avatar },
          }));
        } catch (error) {
          setState({ loading: false, error });
        }
      }
    };

    getAvatar();
  }, [data?.currentUser]);

  if (state.error) {
    return <ErrorWrapper error={state.error} />;
  }

  return (
    <Link href={username ? `/user/${username}` : '/user/settings'}>
      <motion.a
        className={
          isLinkActive('/user/settings', router) ||
          isLinkActive(`/user/${username}`, router)
        }
        css={css}
        variants={addDelay(fadeInUp, 0.7)}
        initial="initial"
        animate="animate"
        exit="exit"
        key="profile"
      >
        <img
          src={state.data?.avatar}
          alt={`${username} user avatar`}
          height="50px"
          width="50px"
        />
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
            src={'/logo.svg'}
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

        <Avatar username={userDocument?.username} />
      </motion.nav>
    </header>
  );
};

export default Header;
