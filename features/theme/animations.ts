export const easing = [0.6, -0.05, 0.01, 0.99];

export const pageTransition = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: easing,
    },
  },
  exit: { opacity: 0 },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: easing,
    },
  },
  exit: { opacity: 0, y: 20 },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: easing,
    },
  },
  exit: { opacity: 0, y: -20 },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      ease: easing,
    },
  },
  exit: { opacity: 0, x: -20 },
};

export const listAnimation = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      ease: easing,
      when: 'beforeChildren',
      staggerChildren: 0.25,
    },
  },
  exit: { opacity: 0 },
};

export const listChildAnimation = {
  initial: { opacity: 0, x: -20, scale: 0.9 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      ease: easing,
    },
  },
  exit: { opacity: 0, x: -20 },
};

export const buttonAnimation = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1, transition: { ease: easing } },
  exit: { opacity: 0, scale: 0 },
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
};

export const addDelay = (
  animation: { initial: any; animate: any; exit: any },
  delay: number,
) => ({
  initial: animation.initial,
  animate: {
    ...animation.animate,
    transition: {
      ...animation.animate.transition,
      delay,
    },
  },
  exit: animation.exit,
});

export const svgFill = {
  initial: {
    pathLength: 0,
    fill: 'rgba(255, 255, 255, 0)',
  },
  animate: {
    pathLength: 1,
    fill: 'rgba(255, 255, 255, 1)',
    transition: { delay: 0.7, easing: easing },
  },
};
