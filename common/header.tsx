import { css } from '@emotion/core';
import { easing, Theme } from 'features/theme';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const links = [{ text: 'Home', href: '/' }];

export const Header: React.FC<{
  heightRef: React.RefObject<HTMLElement>;
}> = ({ heightRef }) => {
  const router = useRouter();

  const isLinkActive = (href: string) =>
    router?.pathname === href.toLowerCase() ? 'active' : 'inactive';

  return (
    <header
      ref={heightRef}
      css={(theme: Theme) => css`
        padding: ${theme.space[4]} ${theme.space[8]};

        display: flex;
        align-items: stretch;
        justify-content: space-between;

        nav {
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
        }
      `}
    >
      <Image
        src="/gvempire-logo.png"
        alt="GVEMPIRE.dev logo"
        height="50px"
        width="50px"
      />

      <nav>
        {links.map((link) => (
          <Link href={link.href} key={link.text}>
            <a className={isLinkActive(link.href)}>{link.text}</a>
          </Link>
        ))}

        <a>
          <Image
            src="/gvempire-logo.png"
            alt="GVEMPIRE.dev logo"
            height="50px"
            width="50px"
          />
        </a>
      </nav>
    </header>
  );
};
export default Header;
