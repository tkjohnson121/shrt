import { Loading } from 'common';
import { AuthService } from 'features/authentication';
import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { MdClose } from 'react-icons/md';
import {
  AnimatePresence,
  ComponentStyles,
  css,
  fadeInDown,
  listAnimation,
  listChildAnimation,
  motion,
} from 'theme';
import { FetchState } from 'types';

const styles: ComponentStyles = {
  header: (theme) => css`
    margin-bottom: ${theme.space[8]};

    button {
      background-color: transparent;
      color: ${theme.colors.text};
      border-bottom: 2px solid ${theme.colors.primary};
    }
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

export function AuthForm() {
  const [state, setState] = useState<
    FetchState<{ email: string; password: string; isNewUser: boolean }>
  >({
    loading: false,
    data: {
      email: '',
      password: '',
      isNewUser: true,
    },
  });

  const onError = (error: Error) =>
    setState((prev) => ({ ...prev, loading: false, error }));
  const onErrorClose = () =>
    setState((prev) => ({ ...prev, loading: false, error: null }));

  const onInputChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) =>
    setState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [name]: value,
      } as { email: string; password: string; isNewUser: boolean },
    }));

  const toggleIsNewUser = () =>
    setState((prev) => ({
      ...prev,
      data: {
        ...(prev.data as { email: string; password: string }),
        isNewUser: !prev.data?.isNewUser,
      },
    }));

  const onFormSubmit = useCallback(
    async (evt: FormEvent<HTMLFormElement>) => {
      try {
        evt.preventDefault();
        setState((prev) => ({ ...prev, loading: true }));
        const { email, password } = state.data || {};

        if (typeof email !== 'string') {
          throw new Error('Email is incorrect');
        }

        if (typeof password !== 'string' || password.length < 6) {
          throw new Error('Password is incorrect');
        }

        if (state.data?.isNewUser) {
          await AuthService.signUp(email, password);
        } else {
          await AuthService.signIn(email, password);
        }

        setState((prev) => ({ ...prev, loading: false }));
      } catch (error) {
        onError(error);
      }
    },
    [state.data],
  );

  return (
    <AnimatePresence>
      {state.data?.isNewUser ? (
        <header css={styles.header} key="header">
          <h1 css={styles.title} className="display">
            Welcome to SHRT!
          </h1>

          <button onClick={toggleIsNewUser}>Need to sign-in?</button>
        </header>
      ) : (
        <header css={styles.header} key="header">
          <h1 css={styles.title} className="display">
            Welcome Back!
          </h1>
          <button onClick={toggleIsNewUser}>Need to sign-up?</button>
        </header>
      )}

      <motion.form
        css={styles.form}
        onSubmit={onFormSubmit}
        variants={listAnimation}
        initial="initial"
        animate="animate"
        exit="exit"
        key="form"
        className={`${state.loading ? 'disabled' : 'active'}`}
      >
        {!!state.loading ? (
          <Loading key="loading-email" />
        ) : (
          <motion.label
            htmlFor="email"
            variants={listChildAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            key="label-email"
          >
            Email
          </motion.label>
        )}

        <motion.input
          id="email"
          name="email"
          placeholder="Enter your email..."
          type="text"
          css={styles.input}
          onChange={onInputChange}
          value={state.data?.email}
          variants={listChildAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          key="input-email"
        />

        {!!state.loading ? (
          <Loading key="loading-password" />
        ) : (
          <motion.label
            htmlFor="password"
            variants={listChildAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            key="label-password"
          >
            Password
          </motion.label>
        )}

        <motion.input
          id="password"
          name="password"
          placeholder="Enter your password..."
          type="password"
          css={styles.input}
          onChange={onInputChange}
          value={state.data?.password}
          variants={listChildAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          key="input-password"
        />

        <motion.button
          type="submit"
          css={styles.button}
          variants={listChildAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          key="button-submit"
        >
          Submit
        </motion.button>
      </motion.form>

      {!!state.error && (
        <motion.section
          variants={fadeInDown}
          initial="initial"
          animate="animate"
          exit="exit"
          css={styles.error}
          key="error"
        >
          <h3>{state.error?.name}</h3>
          <p>{state.error?.message}</p>
          <button onClick={onErrorClose}>
            <MdClose />
          </button>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
