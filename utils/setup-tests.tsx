/**
 * # Setup Tests
 * @packageDescription
 *
 * This file creates a env for the test suite to run close to
 *  production but not so heavy for lightweight but accurate tests.
 *
 * It also has a couple fixes for weird errors and the like.
 */

import '@testing-library/jest-dom/extend-expect';
import { render, RenderOptions } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from '../features/theme';

/**
 * Component Wrapper
 */
const AllProviders: React.FC = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

const customRender = (ui: any, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options });

/**
 * Custom Error Handling
 */
const originalError = console.error;

beforeAll(() => {
  console.error = (...args: any) => {
    if (/Warning.*overlapping act/.test(args[0])) {
      return;
    }
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    if (/IDB requires a browser environment/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

export * from '@testing-library/react';
export { customRender as render };
