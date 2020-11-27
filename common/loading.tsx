import { css } from '@emotion/core';
import { motion } from 'framer-motion';
import React from 'react';
import { fadeInDown } from '../features/theme';
import { Theme } from '../features/theme/theme';

const loadingContainer = () => css`
  margin: 0 auto;
  display: flex;
  justify-content: center;
`;

const loadingCircle = (theme: Theme) => css`
  display: block;
  width: ${theme.space[2]};
  height: ${theme.space[2]};
  background-color: ${theme.colors['info']};
  border-radius: ${theme.radii['full']};
`;

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
  <motion.section variants={fadeInDown} {...props}>
    <h6 css={{ textAlign: 'center', marginBottom: '1rem' }}>{children}</h6>
    <motion.div
      css={loadingContainer}
      variants={loadingContainerVariants}
      initial="initial"
      animate="animate"
    >
      {Array.from({ length: number || 5 }).map((_, idx) => (
        <motion.span
          key={idx}
          css={loadingCircle}
          variants={loadingCircleVariants}
        />
      ))}
    </motion.div>
  </motion.section>
);

export default Loading;
