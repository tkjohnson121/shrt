import Firebase from './firebase-client';

export class Authentication {
  signIn = async (email: string, password: string) => {
    Firebase.analytics?.logEvent('sign_in');
    return await Firebase.auth.signInWithEmailAndPassword(email, password);
  };

  signUp = async (email: string, password: string) => {
    Firebase.analytics?.logEvent('register');
    return await Firebase.auth.createUserWithEmailAndPassword(email, password);
  };

  signOut = async () => {
    Firebase.analytics?.logEvent('sign_out');
    return await Firebase.auth.signOut();
  };
}

export default Authentication;
