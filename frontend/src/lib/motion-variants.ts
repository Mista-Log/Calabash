// CSS-based motion variants for use with className
// These are now CSS class names that apply MD3 motion tokens

export const fadeIn = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -5 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const slideInRight = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
};

export const listEntry = {
  initial: { opacity: 0, x: -10 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
};

export const cardHover = {
  hover: {
    y: -2,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};
