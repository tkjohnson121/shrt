import { Form, formFields, OnFormSubmit } from 'common';
import { AuthService } from 'features/auth';
import React, { useState } from 'react';
import { ComponentStyles, css } from 'theme';
import { FetchState } from 'types';

const styles: ComponentStyles = {
  header: (theme) => css`
    margin-bottom: ${theme.space[8]};
  `,
  title: () => css``,
  error: (theme) => css`
    position: relative;
    background-color: ${theme.colors.error};
    border-radius: ${theme.radii['md']};
    padding: ${theme.space[2]};
    margin: ${theme.space[4]} 0;
    display: inline-block;

    button {
      position: absolute;
      top: 0;
      right: 0;
      border-radius: ${theme.radii['md']};
      background-color: ${theme.colors.whiteAlpha[300]};
      color: ${theme.colors.whiteAlpha[900]};
      font-size: ${theme.fontSizes.xl};
      margin: 0;
      padding: 0;
      display: flex;
      align-items: stretch;
      justify-content: center;
    }
  `,
  form: () => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    &.disabled {
      pointer-events: none;
    }
  `,
  label: () => css``,
  input: (theme) => css`
    margin-bottom: ${theme.space[4]};
    border-radius: ${theme.radii['md']};
    padding: ${theme.space[2]};
  `,
  button: (theme) => css`
    border-bottom: 2px solid ${theme.colors['primary']};
    background-color: transparent;
    color: ${theme.colors.whiteAlpha[900]};
    font-weight: ${theme.fontWeights['semibold']};
    border-radius: ${theme.radii['md']};
    padding: ${theme.space[2]};
  `,
};

export function AuthForm() {
  const [state, setState] = useState<FetchState<{ isNewUser: boolean }>>({
    loading: false,
    data: {
      isNewUser: true,
    },
  });

  const toggleIsNewUser = () =>
    setState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        isNewUser: !prev.data?.isNewUser,
      },
    }));

  const onAuthSubmit: OnFormSubmit = async ({ email, password }, setStatus) => {
    setStatus({ message: 'authenticating...', type: 'info' });

    if (state.data?.isNewUser) {
      await AuthService.signUp(email, password);
    } else {
      await AuthService.signIn(email, password);
    }
  };

  return state.data?.isNewUser ? (
    <>
      <header css={styles.header} key="header">
        <h1 css={styles.title} className="display">
          Welcome to SHRT!
        </h1>

        <p>
          Already have an account?{' '}
          <button onClick={toggleIsNewUser} css={styles.button}>
            Welcome back!
          </button>
        </p>

        <p>Sign-up below to create an account and start editing your PLP.</p>
      </header>

      <Form
        key="shrt"
        onFormSubmit={onAuthSubmit}
        fields={formFields.authFields}
        buttonText="Sign up"
      />
    </>
  ) : (
    <>
      <header css={styles.header} key="header">
        <h1 css={styles.title} className="display">
          Welcome Back!
        </h1>

        <p>
          Don't have an account?
          <button onClick={toggleIsNewUser} css={styles.button}>
            Create one!
          </button>
        </p>

        <p>
          Sign-in below to access your user dashboard and see how your shrts are
          connecting.
        </p>
      </header>

      <Form
        key="shrt"
        onFormSubmit={onAuthSubmit}
        fields={formFields.authFields}
        buttonText="Login"
      />
    </>
  );
}
