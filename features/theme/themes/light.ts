import { Theme } from '../theme';
import theme from './base';

const light: Theme = {
  ...theme,
  name: 'light',
  colors: {
    ...theme.colors,
    background: 'hsl(275, 90%, 100%)',
    text: 'hsl(275, 0%, 10%)',
    primary: 'hsl(275, 100%, 80%)',
    secondary: 'hsl(275, 100%, 80%)',
    highlight: 'hsl(275, 20%, 40%)',
    muted: 'hsl(275, 20%, 0%)',
    error: '#ff0000',
    success: '#50e3c2',
    info: '#0070f3',
    warning: '#f5a623',
    modes: {
      dark: {
        text: '#fff',
        background: '#000',
        primary: '#0fc',
        secondary: '#0cf',
        highlight: '#f0c',
        muted: '#011',
      },
    },
  },
};

export default light;
