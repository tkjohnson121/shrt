import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/messaging';
import 'firebase/storage';

const firebaseConfig = {
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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);

  enablePersistance();
}

const app = firebase;
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();

export { app, db, auth, storage, functions };
