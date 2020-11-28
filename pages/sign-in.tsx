import Authentication from 'features/authentication';
import React, { ChangeEvent, FormEvent, useState } from 'react';
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
  title: (theme) => css``,
  form: (theme) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  `,
  label: (theme) => css``,
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

export const SignInPage = () => {
  const [state, setState] = useState<
    FetchState<{ email: string; password: string }>
  >({
    loading: false,
    data: { email: '', password: '' },
  });

  const onError = (error: Error) =>
    setState((prev) => ({ ...prev, loading: false, error }));

  const onInputChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) =>
    setState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [name]: value,
      } as { email: string; password: string },
    }));

  const onFormSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    try {
      evt.preventDefault();
      const { email, password } = state.data || {};

      if (typeof email !== 'string') {
        throw new Error('Email is incorrect');
      }

      if (typeof password !== 'string' || password.length < 6) {
        throw new Error('Password is incorrect');
      }

      await Authentication.signIn(email, password);

      setState({ loading: false });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <AnimatePresence>
      <h1 css={styles.title} className="display">
        Sign In
      </h1>

      {state.error && (
        <motion.section variants={fadeInDown}>
          <h3>{state.error?.name}</h3>
          <p>{state.error?.message}</p>
        </motion.section>
      )}

      <motion.form
        css={styles.form}
        onSubmit={onFormSubmit}
        variants={listAnimation}
      >
        <motion.label
          htmlFor="email"
          variants={listChildAnimation}
          key="label-email"
        >
          Email
        </motion.label>
        <motion.input
          id="email"
          name="email"
          placeholder="Enter your email..."
          type="text"
          css={styles.input}
          onChange={onInputChange}
          value={state.data?.email}
          variants={listChildAnimation}
          key="input-email"
        />

        <motion.label
          htmlFor="password"
          variants={listChildAnimation}
          key="label-password"
        >
          Password
        </motion.label>
        <motion.input
          id="password"
          name="password"
          placeholder="Enter your password..."
          type="password"
          css={styles.input}
          onChange={onInputChange}
          value={state.data?.password}
          variants={listChildAnimation}
          key="input-password"
        />

        <motion.button
          type="submit"
          css={styles.button}
          variants={listChildAnimation}
          key="button-submit"
        >
          Submit
        </motion.button>
      </motion.form>
    </AnimatePresence>
  );
};

export default SignInPage;
