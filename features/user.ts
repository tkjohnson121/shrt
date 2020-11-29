import firebase from 'firebase';
import { ShrtUser } from './../types/index';
import { FirebaseClient } from './firebase-client';

class User {
  // Methods to update attrs for the current signed-in user
  async updateEmail(email: string) {
    try {
      FirebaseClient.analytics?.logEvent('update_email');
      return FirebaseClient.auth.currentUser?.updateEmail(email);
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }

  async updatePassword(password: string) {
    try {
      FirebaseClient.analytics?.logEvent('update_password');
      return FirebaseClient.auth.currentUser?.updatePassword(password);
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }

  async updateProfile(profile: {
    displayName?: string | null;
    photoURL?: string | null;
  }) {
    try {
      FirebaseClient.analytics?.logEvent('update_profile');
      return FirebaseClient.auth.currentUser?.updateProfile(profile);
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }

  async getUserAvatarById(uid?: string) {
    try {
      if (!uid) throw new Error();

      FirebaseClient.analytics?.logEvent('get_user_avatar');

      return await FirebaseClient.storage
        .ref()
        .child(`users/${uid}/avatar`)
        .getDownloadURL();
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);

      return '/gvempire-logo.png';
    }
  }

  async getUserDocumentById(uid: string) {
    try {
      FirebaseClient.analytics?.logEvent('get_user_document');

      return (
        await FirebaseClient.db.collection('users').doc(uid).get()
      ).data();
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }

  async updateUserDocument(
    currentUser: ShrtUser,
    update: { [key: string]: any },
  ) {
    try {
      FirebaseClient.analytics?.logEvent('update_user_document', update);

      // make sure to keep the auth service in sync with the database

      if ('email' in update) {
        // update email
        await this.updateEmail(update.email);
      }

      if ('name' in update || 'displayName' in update) {
        // update displayName
        await this.updateProfile({ displayName: update.displayName });
      }

      if ('photoURL' in update || 'avatar' in update) {
        // update photoURL
        await this.updateProfile({
          photoURL: update.avatar || update.photoURL,
        });
      }

      FirebaseClient.db.collection('user').doc(currentUser.uid).update(update);
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);

      throw new Error(error);
    }
  }

  async uploadUserFile(
    currentUser: ShrtUser,
    file: File,
    options?: {
      name: string;
      metadata?: firebase.storage.UploadMetadata;
    },
  ) {
    try {
      FirebaseClient.analytics?.logEvent('upload_file', {
        name: options?.name || file.name,
      });

      const storageRef = FirebaseClient.storage.ref();

      return await storageRef
        .child(`users/${currentUser.uid}/${options?.name || file.name}`)
        .put(file, options?.metadata);
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);

      throw new Error(error);
    }
  }
}

export const UserService = new User();
