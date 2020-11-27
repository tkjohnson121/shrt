/**
 * # Firebase-Server
 * @packageDescription
 *
 * Server-side admin client for firebase.
 *
 * The admin tools below have no regard for the {@link firestore.rules}.
 * @note Be careful!
 */
import * as admin from 'firebase-admin';
import 'firebase-functions';
import * as functions from 'firebase-functions';
import { defaultConfig } from './firebase-client';

export class FirebaseServer {
  constructor(config = defaultConfig) {
    if (!admin.apps.length) {
      admin.initializeApp(config);
    }
  }

  admin = admin;
  functions = functions;
  db = admin.firestore();
  messaging = admin.messaging();
  storage = admin.storage();
}

export default new FirebaseServer();
