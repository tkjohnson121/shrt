import { AuthService } from 'features/authentication';
import { ShrtSwal } from 'features/swal';
import React, { useState } from 'react';
import { ComponentStyles, css } from 'theme';
import { FetchState } from 'types';
import Form, { OnFormSubmit } from './form';

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
    background-color: ${theme.colors['primary']};
    color: ${theme.colors.whiteAlpha[900]};
    font-weight: ${theme.fontWeights['semibold']};
    border-radius: ${theme.radii['md']};
    padding: ${theme.space[2]};
  `,
};

const authFields = {
  email: {
    label: 'Email',
    type: 'email',
    width: 'small',
    placeholder: "What's your email?",
    config: {
      pattern: {
        value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
        message: "Hmm, that doesn't look like an email.",
      },
    },
  },
  password: {
    label: 'Password',
    type: 'password',
    width: 'small',
    placeholder: "What's your password?",
    config: {
      minLength: {
        value: 6,
        message: 'Too short (min 6).',
      },
      maxLength: {
        value: 24,
        message: 'Too long (min 24).',
      },
    },
  },
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
    try {
      setStatus('authenticating...');

      if (state.data?.isNewUser) {
        await AuthService.signUp(email, password);
      } else {
        await AuthService.signIn(email, password);
      }

      setStatus('Authentication Complete!');
      ShrtSwal.fire({ type: 'success', titleText: 'Success!' });
    } catch (error) {
      console.error(error);
      setStatus(error.message);
    }
  };

  return state.data?.isNewUser ? (
    <>
      <header css={styles.header} key="header">
        <h1 css={styles.title} className="display">
          Welcome to SHRT!
        </h1>
        <button onClick={toggleIsNewUser} css={styles.button}>
          Need to sign-up?
        </button>
      </header>

      <Form
        subtitle={'Sign-up to get all the greatest features.'}
        key="shrt"
        onFormSubmit={onAuthSubmit}
        fields={authFields}
        buttonText="Sign up"
      />
    </>
  ) : (
    <>
      <header css={styles.header} key="header">
        <h1 css={styles.title} className="display">
          Welcome Back!
        </h1>
        <button onClick={toggleIsNewUser} css={styles.button}>
          Need to sign-up?
        </button>
      </header>

      <Form
        subtitle={"It's nice to see you again!"}
        key="shrt"
        onFormSubmit={onAuthSubmit}
        fields={authFields}
        buttonText="Login"
      />
    </>
  );
}
