import { css } from '@emotion/core';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { slideInLeft } from '../features/theme';
import { Theme } from '../features/theme/theme';

const styles = {
  container: (theme: Theme) => css`
    max-width: ${theme.space['2xl']};
    border-radius: ${theme.radii['lg']};
    margin: ${theme.space[16]} auto;
    padding: ${theme.space[8]} ${theme.space[8]};
    box-shadow: ${theme.shadows['2xl']};
    background-color: ${theme.name === 'light'
      ? theme.colors.blackAlpha[300]
      : theme.colors.whiteAlpha[300]};
  `,
  code: (theme: Theme) => css`
    font-size: ${theme.fontSizes['sm']};
    font-family: ${theme.fonts['mono']};
  `,
  message: () => css`
    margin: 2rem auto;
  `,
};

/**
 * # Error
 *
 * simple compenent to display when an error occurs.
 *
 * Displays a message[, code[, and title]]
 * Also, allows a user to refresh
 */
export const ErrorWrapper: React.FC<{
  title?: string;
  error?: Error | { [key: string]: any };
}> = ({ title = 'Uh Oh!', error }) => {
  const router = useRouter();

  return !!error ? (
    <motion.section variants={slideInLeft} css={styles.container}>
      {title && <h2>{title}</h2>}

      <p css={styles.message}>{error.message}</p>

      <div css={{ display: 'flex', flexDirection: 'column' }}>
        <button onClick={() => router.reload()} css={{ margin: '1rem auto' }}>
          Refresh
        </button>

        <Link href="/">
          <a>Go Home</a>
        </Link>
      </div>
    </motion.section>
  ) : null;
};

export default ErrorWrapper;
