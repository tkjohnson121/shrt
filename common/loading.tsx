import { css } from '@emotion/core';
import { motion } from 'framer-motion';
import React from 'react';
import { fadeInDown } from '../features/theme';
import { ComponentStyles } from '../features/theme/theme';

const styles: ComponentStyles = {
  loadingContainer: (theme) => css`
    margin: ${theme.space[2]} auto;
    display: flex;
    justify-content: center;
  `,

  loadingCircle: (theme) => css`
    display: block;
    width: ${theme.space[2]};
    height: ${theme.space[2]};
    background-color: ${theme.colors['info']};
    border-radius: ${theme.radii['full']};
  `,
};

const loadingContainerVariants = {
  initial: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const loadingCircleVariants = {
  initial: {
    y: '0%',
  },
  animate: {
    y: '100%',
    transition: {
      duration: 0.5,
      yoyo: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * # Loading
 *
 * component to inform user of background activity
 */
export const Loading: React.FC<{ number?: number }> = ({
  children,
  number,
  ...props
}) => (
  <motion.div variants={fadeInDown} {...props}>
    {children && (
      <h6 css={{ textAlign: 'center', marginBottom: '1rem' }}>{children}</h6>
    )}
    <motion.span
      css={styles.loadingContainer}
      variants={loadingContainerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {Array.from({ length: number || 5 }).map((_, idx) => (
        <motion.span
          key={idx}
          css={styles.loadingCircle}
          variants={loadingCircleVariants}
        />
      ))}
    </motion.span>
  </motion.div>
);

export default Loading;
