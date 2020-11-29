import 'firebase/analytics';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/messaging';
import 'firebase/storage';

/**
 * # Firebase-Client (Functions)
 * @packageDescription
 *
 * Client-side firebase tools and sdk.
 *
 * The admin tools below have no regard for the {@link firestore.rules}.
 * @note Be careful!
 */

export const defaultConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'api_key',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'auth_domain',
  databaseURL: process.env.FIREBASE_DATABASE_URL || 'database_url',
  projectId: process.env.FIREBASE_PROJECT_ID || 'proect_id',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'storage_bucket',
  messagingSenderId:
    process.env.FIREBASE_MESSAGING_SENDER_ID || 'messaging_sender_id',
  appId: process.env.FIREBASE_APP_ID || 'app_id',
};

/**
 * # enablePersistance
 *
 * If the app is in the live environment, this will enable offline access
 *    to firestore.
 * @see https://firebase.google.com/docs/firestore/manage-data/enable-offline
 */
export const enablePersistance = async () =>
  typeof window !== 'undefined' &&
  window.indexedDB &&
  process.env.NODE_ENV === 'production' &&
  firebase.firestore().enablePersistence({ synchronizeTabs: true });

/**
 * # initializefirebase
 *
 * You must have a default firebase instance initialized before
 *    using the library.
 *
 * By calling this function in the export file we ensure that every import
 *  comes with an initialized firebase instance
 *
 * @see https://firebase.google.com/docs/web/setup
 */
const initializeFirebase = (config = defaultConfig) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
};

initializeFirebase();

class Firebase {
  constructor(config = defaultConfig) {
    initializeFirebase(config);
    enablePersistance();
  }

  app = firebase;
  db = firebase.firestore();
  auth = firebase.auth();
  storage = firebase.storage();
  functions = firebase.functions();
  analytics =
    typeof window !== 'undefined' && process.env.NODE_ENV === 'production'
      ? firebase.analytics()
      : null;
}

export const FirebaseClient = new Firebase();
