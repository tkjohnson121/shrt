import { css } from '@emotion/core';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { easing, slideInLeft } from '../features/theme';
import { ComponentStyles } from '../features/theme/theme';

const styles: ComponentStyles = {
  container: (theme) => css`
    max-width: ${theme.space['2xl']};
    border-radius: ${theme.radii['lg']};
    margin: ${theme.space[16]} auto;
    padding: ${theme.space[8]} ${theme.space[8]};
    box-shadow: ${theme.shadows['2xl']};
    background-color: ${theme.name === 'light'
      ? theme.colors.blackAlpha[300]
      : theme.colors.whiteAlpha[300]};

    button {
      background-color: ${theme.colors['primary']};
      color: ${theme.colors.whiteAlpha[900]};
      font-weight: ${theme.fontWeights['semibold']};
      border-radius: ${theme.radii['md']};
      padding: ${theme.space[2]};
      margin-right: ${theme.space[2]};
    }

    a {
      margin-right: ${theme.space[2]};
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
  `,
  code: (theme) => css`
    font-size: ${theme.fontSizes['sm']};
    font-family: ${theme.fonts['mono']};
  `,
  message: (theme) => css`
    margin-top: ${theme.space[2]};
    margin-bottom: ${theme.space[4]};
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
  error?: Error | { [key: string]: any } | null;
}> = ({ title = 'Uh Oh!', error }) => {
  const router = useRouter();

  return !!error ? (
    <motion.section variants={slideInLeft} css={styles.container}>
      {title && <h2>{title}</h2>}

      <p css={styles.message}>{error.message}</p>

      <div css={{ display: 'flex', alignItems: 'center' }}>
        <button onClick={() => router.reload()}>Refresh</button>

        <Link href="/">
          <a>Go Home</a>
        </Link>
      </div>
    </motion.section>
  ) : null;
};

export default ErrorWrapper;
