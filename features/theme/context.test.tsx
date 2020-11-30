import React from 'react';
import { fireEvent, render, waitFor } from 'utils/setup-tests';
import { useTheme } from './context';

const WithThemeProvider = () => {
  const { theme, changeTheme } = useTheme();

  return (
    <div>
      <button
        onClick={() => changeTheme(theme.name === 'light' ? 'dark' : 'light')}
      >
        change theme
      </button>
      <span>{JSON.stringify(theme, null, 2)}</span>
    </div>
  );
};

describe('feat: theme -> useTheme()', () => {
  it('renders the correct theme and can toggle', async () => {
    const { getByText } = render(<WithThemeProvider />);

    const themeToggle = getByText(/change theme/gi);
    const isLightTheme = () => !!getByText(/"name": "light"/gi);
    const isDarkTheme = () => !!getByText(/"name": "dark"/gi);

    expect(themeToggle).toBeTruthy();
    expect(isDarkTheme()).toBeTruthy();

    fireEvent.click(themeToggle);

    await waitFor(() => getByText(/"name": "light"/gi), { timeout: 3000 });

    expect(isLightTheme()).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = render(<WithThemeProvider />);

    expect(container).toMatchSnapshot();
  });
});
