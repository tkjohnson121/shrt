import firebase from 'firebase';
import React from 'react';
import { FetchState, ShrtUser } from 'types';
import { FirebaseClient } from './firebase-client';

class Authentication {
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

  async signIn(email: string, password: string) {
    try {
      FirebaseClient.analytics?.logEvent('sign_in');
      return await FirebaseClient.auth.signInWithEmailAndPassword(
        email,
        password,
      );
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }

  async signUp(email: string, password: string) {
    try {
      FirebaseClient.analytics?.logEvent('register');

      return await FirebaseClient.auth.createUserWithEmailAndPassword(
        email,
        password,
      );
    } catch (error) {
      // Account already exists with given email
      if (error.code === 'auth/email-already-in-use') {
        await AuthService.signIn(email, password);
      }

      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }

  async signOut() {
    try {
      FirebaseClient.analytics?.logEvent('sign_out');
      return await FirebaseClient.auth.signOut();
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }
}

export const AuthService = new Authentication();

type AuthState = FetchState<{
  isAuthenticated: boolean;
  currentUser?: ShrtUser;
}>;

const initialState = {
  loading: true,
  data: {
    isAuthenticated: false,
  },
};

const AuthContext = React.createContext<AuthState>(initialState);

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (typeof context === 'undefined') {
    throw new Error('useAuth must be used within a AuthContext Provider');
  }

  return context;
};

export const AuthProvider: React.FC = ({ children }) => {
  const [state, setState] = React.useState<AuthState>(initialState);

  React.useEffect(() => {
    let unsubscribe = AuthService.openAuthListener(
      (user) =>
        setState({
          loading: false,
          data: {
            isAuthenticated: true,
            currentUser: {
              token: user.getIdToken(),
              ...user,
            },
          },
        }),
      () => setState({ ...initialState, loading: false }),
    );

    return () => {
      !!unsubscribe && unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};
