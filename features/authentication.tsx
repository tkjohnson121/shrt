import firebase from 'firebase';
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
import FirebaseClient from './firebase-client';

export class AuthService {
  openAuthListener = (
    withUser: (user: firebase.User) => any,
    withoutUser?: () => any,
  ) =>
    FirebaseClient.auth.onAuthStateChanged((user) => {
      if (user) {
        return withUser(user);
      }

      return withoutUser && withoutUser();
    });

  signIn = async (email: string, password: string) => {
    FirebaseClient.analytics?.logEvent('sign_in');
    return await FirebaseClient.auth.signInWithEmailAndPassword(
      email,
      password,
    );
  };

  signUp = async (email: string, password: string) => {
    FirebaseClient.analytics?.logEvent('register');
    return await FirebaseClient.auth.createUserWithEmailAndPassword(
      email,
      password,
    );
  };

  signOut = async () => {
    FirebaseClient.analytics?.logEvent('sign_out');
    return await FirebaseClient.auth.signOut();
  };

  // Methods to update attrs for the current signed-in user
  updateEmail = (email: string) =>
    FirebaseClient.auth.currentUser?.updateEmail(email);
  updatePassword = (password: string) =>
    FirebaseClient.auth.currentUser?.updatePassword(password);
  updatePhone = (phone: firebase.auth.AuthCredential) =>
    FirebaseClient.auth.currentUser?.updatePhoneNumber(phone);
  updateProfile = (profile: {
    displayName?: string | null;
    photoURL?: string | null;
  }) => FirebaseClient.auth.currentUser?.updateProfile(profile);
}

interface AuthState {
  isAuthenticated: boolean;
  currentUser?: {
    token?: string | Promise<string>;
    email: string | null;
    emailVerified: boolean;
    displayName: string | null;
    uid: string;
  };
}

const initialState = {
  isAuthenticated: false,
};

const AuthContext = React.createContext<FetchState<AuthState>>({
  loading: true,
  data: initialState,
});

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (typeof context === 'undefined') {
    throw new Error('useAuth must be used within a AuthContext Provider');
  }

  return context;
};

export const AuthProvider: React.FC = ({ children }) => {
  const [state, setState] = React.useState<FetchState<AuthState>>({
    loading: true,
  });

  React.useEffect(() => {
    let unsubscribe = FirebaseClient.auth.onAuthStateChanged((user) => {
      // user is signed-in
      if (user) {
        setState({
          loading: false,
          data: {
            isAuthenticated: true,
            currentUser: {
              token: user.getIdToken(),
              email: user.email,
              emailVerified: user.emailVerified,
              displayName: user.displayName,
              uid: user.uid,
            },
          },
        });
        // No user is signed-in
      } else {
        setState({ loading: false, data: initialState });
      }
    });

    return () => {
      !!unsubscribe && unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

const styles: ComponentStyles = {
  title: () => css``,
  form: () => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
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

      if (state.data?.isNewUser) {
        await new AuthService().signUp(email, password);
      } else {
        await new AuthService().signIn(email, password);
      }

      setState({ loading: false });
    } catch (error) {
      onError(error);
    }
  };

  return (
    <AnimatePresence>
      {state.data?.isNewUser ? (
        <header>
          <h1 css={styles.title} className="display">
            Welcome to SHRT!
          </h1>

          <button onClick={toggleIsNewUser}>Need to sign-in?</button>
        </header>
      ) : (
        <header>
          <h1 css={styles.title} className="display">
            Welcome back! It's nice to see you again.
          </h1>
          <button onClick={toggleIsNewUser}>Need to sign-up?</button>
        </header>
      )}

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
}
