import { Theme } from '../theme';
import theme from './base';

const dark: Theme = {
  ...theme,
  name: 'dark',
  colors: {
    ...theme.colors,
    text: '#FAFAFF',
    background: 'hsl(254, 25%, 15%)',
    primary: '#7928CA',
    secondary: '#79FFE1',
    highlight: '#FF0080',
    muted: '#888888',
    error: '#FF3333',
    success: '#37BE37',
    info: '#3291FF',
    warning: '#F7B955',
  },
};

export default dark;
