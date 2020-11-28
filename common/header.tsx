import { css } from '@emotion/core';
import { useAuth } from 'features/authentication';
import {
  addDelay,
  easing,
  fadeInDown,
  fadeInUp,
  listAnimation,
  listChildAnimation,
  motion,
  Theme,
} from 'features/theme';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const defaultLinks = [{ text: 'Home', href: '/' }];
const authLinks = [
  { text: 'Home', href: '/' },
  { text: 'Settings', href: '/user/settings' },
];

export const Header: React.FC<{
  heightRef: React.RefObject<HTMLElement>;
}> = ({ heightRef }) => {
  const authState = useAuth();
  const router = useRouter();

  const isLinkActive = (href: string) =>
    router?.pathname === href.toLowerCase() ? 'active' : 'inactive';

  return (
    <motion.header
      variants={fadeInDown}
      initial="initial"
      animate="animate"
      exit="exit"
      ref={heightRef}
      css={(theme: Theme) => css`
        padding: ${theme.space[4]} ${theme.space[8]};

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
        }
      `}
    >
      <Link href="/">
        <motion.a
          variants={addDelay(fadeInUp, 0.5)}
          initial="initial"
          animate="animate"
          exit="exit"
          key="home"
        >
          <Image
            src="/gvempire-logo.png"
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

        <Link href="/user">
          <motion.a
            variants={addDelay(fadeInUp, 0.7)}
            initial="initial"
            animate="animate"
            exit="exit"
            key="profile"
          >
            <Image
              src={
                authState.data?.currentUser?.photoURL || '/gvempire-logo.png'
              }
              alt={`${
                authState.data?.currentUser?.displayName || 'GVEMPIRE.dev'
              } logo`}
              height="50px"
              width="50px"
            />
          </motion.a>
        </Link>
      </motion.nav>
    </motion.header>
  );
};
export default Header;
