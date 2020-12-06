import { css } from '@emotion/core';
import { ShrtForm } from 'common';
import { Theme } from 'features/theme';
import React from 'react';

const styles = {
  section: (theme: Theme) => css`
    max-width: ${theme.space['2xl']};
    text-align: center;
    margin: 0 auto ${theme.space[8]};
    padding: ${theme.space[10]} 0;

    .tagline {
      font-weight: ${theme.fontWeights['light']};
      font-size: ${theme.fontSizes['2xl']};
      max-width: 50ch;
      margin: 0 auto;
    }
  `,
};

export default function LandingPage() {
  return (
    <>
      <section css={styles.section}>
        <h1 className="display">Welcome to SHRT!</h1>
        <p className="tagline">
          Personal Landing Page (PLP) and URL-Shortner that allows you to
          connect faster and network more efficiently.
        </p>

        <ShrtForm />
      </section>
    </>
  );
}
