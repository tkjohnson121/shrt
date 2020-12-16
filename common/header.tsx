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
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import React from 'react';
import { MdDashboard, MdHome, MdSettings } from 'react-icons/md';
import { FetchState } from 'types';
import ErrorWrapper from './error-wrapper';
import { useUserDocumentListener } from './use-user-document-listener';

const styles: ComponentStyles = {
  header: (theme) => css`
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-end;
    padding-top: ${theme.space[4]};
    padding-left: ${theme.space[2]};
    z-index: 9999;
    background-color: transparent;

    @media (min-width: ${theme.space['2xl']}) {
      justify-content: flex-start;
    }
  `,

  nav: (theme) => css`
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: flex-end;
    background-color: ${theme.colors.blackAlpha[300]};
    border-radius: ${theme.radii['md']};
    padding: ${theme.space[2]};
    box-shadow: ${theme.shadows['lg']};
    backdrop-filter: blur(3px);

    @media (min-width: ${theme.space['2xl']}) {
      flex-direction: column;
    }
  `,
  navLink: (theme) => css`
    margin: ${theme.space[1]} 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 150ms cubic-bezier(${easing.join(',')});

    &.active,
    &:hover,
    &:focus {
      color: ${theme.colors['primary']};
    }

    img,
    svg {
      height: ${theme.space[8]};
      width: ${theme.space[8]};
      border-radius: ${theme.radii['full']};
    }
  `,
};

const isLinkActive = (href: string, router: NextRouter, username?: string) =>
  router?.pathname === href.toLowerCase() ||
  router?.pathname.startsWith(`/user/${username}`)
    ? 'active'
    : 'inactive';

const defaultLinks = [{ text: 'Home', href: '/', icon: <MdHome /> }];
const authLinks = [
  { text: 'Home', href: '/', icon: <MdHome /> },
  { text: 'Dashboard', href: '/user/dashboard', icon: <MdDashboard /> },
  { text: 'Settings', href: '/user/settings', icon: <MdSettings /> },
];

export const Avatar: React.FC<{
  username?: string;
}> = ({ username }) => {
  const { data } = useAuth();

  const [state, setState] = React.useState<FetchState<{ avatar: string }>>({
    loading: true,
    data: { avatar: '/logo.svg' },
  });

  React.useEffect(() => {
    const getUserAvatar = async () => {
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

    getUserAvatar();
  }, [data?.currentUser]);

  if (state.error) {
    return <ErrorWrapper error={state.error} />;
  }

  return (
    <Link href={username ? `/user/${username}` : '/user/settings'} passHref>
      <motion.a
        css={styles.navLink}
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

export const Header: React.FC<{ headerRef: React.RefObject<HTMLElement> }> = ({
  headerRef,
}) => {
  const router = useRouter();

  const authState = useAuth();
  const { currentUser, isAuthenticated } = authState.data || {};

  const {
    state: { data: userDocument },
  } = useUserDocumentListener(currentUser?.uid);

  return (
    <header ref={headerRef} css={styles.header}>
      <motion.nav
        css={styles.nav}
        variants={addDelay(listAnimation, 1)}
        initial="initial"
        animate="animate"
        key="nav"
      >
        <Avatar username={userDocument?.username} />

        {(isAuthenticated ? authLinks : defaultLinks).map((link) => (
          <Link href={link.href} key={link.text} passHref>
            <motion.a
              key={link.href}
              css={styles.navLink}
              className={isLinkActive(
                link.href,
                router,
                userDocument?.username,
              )}
              variants={listChildAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {link.icon}
            </motion.a>
          </Link>
        ))}
      </motion.nav>
    </header>
  );
};

export default Header;
