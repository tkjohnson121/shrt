import firebase from 'firebase';
import { ShrtUser } from './../types/index';
import { FirebaseClient } from './firebase-client';

class User {
  async updateUserDocument(
    currentUser: ShrtUser,
    update: { [key: string]: any },
  ) {
    try {
      FirebaseClient.analytics?.logEvent('update_user_document', update);

      FirebaseClient.db.collection('user').doc(currentUser.uid).update(update);
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);

      throw new Error(error);
    }
  }

  async uploadUserFile(
    currentUser: ShrtUser,
    file: File,
    metadata: firebase.storage.UploadMetadata,
  ) {
    try {
      FirebaseClient.analytics?.logEvent('upload_file');

      const storageRef = FirebaseClient.storage.ref();

      return await storageRef.child(`${currentUser.uid}`).put(file, metadata);
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);

      throw new Error(error);
    }
  }
}

export const UserService = new User();
