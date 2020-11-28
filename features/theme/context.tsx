import { Global } from '@emotion/core';
import { ThemeProvider as EmotionTheming } from 'emotion-theming';
import React from 'react';
import { globalStyles } from './global-styles';
import { Theme } from './theme';
import * as themes from './themes';

export const GVThemeContext = React.createContext<{
  theme: Theme;
  changeTheme: (name: 'base' | 'dark' | 'light') => void | undefined;
}>({ theme: themes.base, changeTheme: () => {} });

export const useTheme = () => {
  const context = React.useContext(GVThemeContext);

  if (typeof context === 'undefined') {
    throw new Error('`useTheme` must be used within a `ThemeProvider`');
  }

  return context;
};

export const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = React.useState(themes.dark);

  const changeTheme = (name: 'base' | 'dark' | 'light') => {
    typeof window !== 'undefined' &&
      localStorage.setItem('Shrt-preferred-theme', JSON.stringify(name));

    return setTheme(themes[name]);
  };

  return (
    <GVThemeContext.Provider value={{ theme, changeTheme }}>
      <Global styles={() => globalStyles(theme)} />
      <EmotionTheming theme={theme}>{children}</EmotionTheming>
    </GVThemeContext.Provider>
  );
};
