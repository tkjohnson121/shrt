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
import { FetchState, UserDocument } from 'types';
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
    background-color: ${theme.colors.blackAlpha[700]};
    display: flex;
    align-items: stretch;
    justify-content: space-between;

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

const defaultLinks = [{ text: 'Home', href: '/' }];
const authLinks = [
  { text: 'Home', href: '/' },
  { text: 'Dashboard', href: '/user/dashboard' },
];

export const Header: React.FC<{
  heightRef: React.RefObject<HTMLElement>;
}> = ({ heightRef }) => {
  const authState = useAuth();
  const { currentUser, isAuthenticated } = authState.data || {};

  const {
    state: { data: userDocument, error: userDocumentError },
  } = useUserDocumentListener(currentUser?.uid);

  const router = useRouter();
  const isLinkActive = (href: string) =>
    router?.pathname === href.toLowerCase() ? 'active' : 'inactive';

  const [state, setState] = React.useState<
    FetchState<{ userData?: UserDocument; avatar?: string }>
  >({ loading: false });

  React.useEffect(() => {
    const getAvatar = async () => {
      const avatar = (await UserService.getUserAvatarById(
        currentUser?.uid,
      )) as string;

      setState((prev) => ({ loading: false, data: { ...prev.data, avatar } }));
    };

    if (isAuthenticated && currentUser && !state.data?.avatar) {
      getAvatar();
    }
  }, [isAuthenticated]);

  if (state.loading) return <Loading />;

  if (state.error || userDocumentError) {
    return <ErrorWrapper error={state.error || userDocumentError} />;
  }

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
        ))}

        <Link
          href={
            userDocument?.username
              ? `/user/${userDocument?.username}`
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
              alt={`${userDocument?.username || 'GVEMPIRE.dev'} logo`}
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
