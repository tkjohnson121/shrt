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

interface AuthState {
  isAuthenticated: boolean;
  currentUser?: ShrtUser;
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
    let unsubscribe = AuthService.openAuthListener(
      (user) =>
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
              photoURL: user.photoURL,
            },
          },
        }),
      () => setState({ loading: false, data: initialState }),
    );

    return () => {
      !!unsubscribe && unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};
