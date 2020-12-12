import { css } from '@emotion/core';
import { Theme } from 'features/theme';
import Link from 'next/link';
import React from 'react';

const styles = {
  section: (theme: Theme) => css`
    max-width: ${theme.space['2xl']};
    text-align: center;
    margin: 0 auto ${theme.space[8]};
    padding: ${theme.space[10]} 0;

    .tagline {
      font-weight: ${theme.fontWeights['light']};
      font-size: ${theme.fontSizes['xl']};
      max-width: 50ch;
      margin: 0 auto ${theme.space[4]};
      line-height: ${theme.lineHeights['tall']};
    }

    .features {
      max-width: 50ch;
      list-style-type: circle;
      text-align: left;
      margin: 0 auto;
      padding: 0;

      li {
        margin-bottom: ${theme.space[4]};

        a {
          border-bottom: 2px solid ${theme.colors['primary']};
          background-color: transparent;
          color: ${theme.colors.whiteAlpha[900]};
          font-weight: ${theme.fontWeights['semibold']};
        }
      }
    }
  `,
};

export default function LandingPage() {
  return (
    <section css={styles.section}>
      <h1 className="display">SHRT!</h1>
      <p className="tagline">Your Main Link, Forever.</p>

      <ul className="features">
        <li>
          <p>
            Keep all your side links in one place and connect with people on any
            platform with{' '}
            <Link href="/user/settings">
              <a>Personal Landing Pages (PLP)</a>
            </Link>
            .
          </p>
        </li>
        <li>
          <p>
            Share any link and easily track it's usage and analytics with{' '}
            <Link href="/user/dashboard">
              <a>Shrts</a>
            </Link>
            .
          </p>
        </li>
      </ul>
    </section>
  );
}
