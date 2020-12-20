import firebase from 'firebase';
import { LinkConfig, PLPLinkDocument, UserDocument } from 'types/index';
import { FirebaseClient } from '../firebase-client';

class User {
  openUserDocumentListener(
    uid: string,
    onSnapshotChange: (document: UserDocument) => any,
    onSnapshotError?: (error: firebase.firestore.FirestoreError) => void,
  ) {
    FirebaseClient.analytics?.logEvent('open_user_document_listener');

    return FirebaseClient.db
      .collection('users')
      .doc(uid)
      .onSnapshot((snapshot) => {
        onSnapshotChange(snapshot.data() as UserDocument);
      }, onSnapshotError);
  }

  // Methods to update attrs for the current signed-in user
  async updateEmail(email: string) {
    try {
      FirebaseClient.analytics?.logEvent('update_email');
      return await FirebaseClient.auth.currentUser?.updateEmail(email);
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }

  async updatePassword(password: string) {
    try {
      FirebaseClient.analytics?.logEvent('update_password');
      return await FirebaseClient.auth.currentUser?.updatePassword(password);
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
      return await FirebaseClient.auth.currentUser?.updateProfile(profile);
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }

  async getUserFileByPath(uid: string, path: string) {
    try {
      FirebaseClient.analytics?.logEvent('get_user_file');

      return (await FirebaseClient.storage
        .ref()
        .child('users/' + uid + '/' + path)
        .getDownloadURL()) as string;
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);

      return '/logo.svg';
    }
  }
  async getUserBackgroundById(uid: string) {
    try {
      FirebaseClient.analytics?.logEvent('get_user_background');

      return (await FirebaseClient.storage
        .ref()
        .child(`users/${uid}/profile/background`)
        .getDownloadURL()) as string;
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);

      return '/logo.svg';
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

  async getUserDocumentByUsername(username: string) {
    try {
      FirebaseClient.analytics?.logEvent('get_user_document');

      return (
        await FirebaseClient.db
          .collection('users')
          .where('username', '==', username)
          .get()
      ).docs.map((doc) => doc.data())[0] as UserDocument;
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }

  async updateUserDocument(uid: string, update: { [key: string]: any }) {
    try {
      FirebaseClient.analytics?.logEvent('update_user_document', update);

      // make sure to keep the auth service in sync with the database

      if ('email' in update) {
        // update email
        await this.updateEmail(update.email);
      }

      if (
        'name' in update ||
        'displayName' in update ||
        'display_name' in update
      ) {
        // update displayName
        await this.updateProfile({
          displayName: update['name' || 'displayName' || 'display_name'],
        });
      }

      if ('photoURL' in update || 'avatar' in update) {
        // update photoURL
        await this.updateProfile({
          photoURL: update.avatar || update.photoURL,
        });
      }

      return await FirebaseClient.db
        .collection('users')
        .doc(uid)
        .update(update);
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);

      throw new Error(error);
    }
  }

  async uploadUserFile(
    uid: string,
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
        .child(`users/${uid}/${options?.name || file.name}`)
        .put(file, options?.metadata);
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);

      throw new Error(error);
    }
  }

  async addPLPLink(uid: string, linkConfig: LinkConfig) {
    try {
      FirebaseClient.analytics?.logEvent('add_link_to_plp', {
        uid,
        linkConfig,
      });

      return await FirebaseClient.db.collection('plps').add({
        ...linkConfig,
        created_by: uid,
        created_on: Date.now(),
        isArchived: false,
        order: 0,
      });
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }

  async updatePLPLink(
    uid: string,
    link_id: string,
    update: {
      updated_by?: string;
      updated_on?: number;
      isArchived?: boolean;
      order?: number;
    } & { [key: string]: any },
  ) {
    try {
      FirebaseClient.analytics?.logEvent('update_link_on_plp', {
        uid,
        link_id,
      });

      return await FirebaseClient.db
        .collection('plps')
        .doc(link_id)
        .update(update);
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }

  async archivePLPLink(uid: string, link_id: string) {
    try {
      FirebaseClient.analytics?.logEvent('remove_link_from_plp', {
        uid,
        link_id,
      });

      return await FirebaseClient.db.collection('plps').doc(link_id).update({
        isArchived: true,
      });
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }

  async getPLPLinksByUser(uid: string) {
    try {
      FirebaseClient.analytics?.logEvent('get_plp_link_by_user', {
        uid,
      });

      const documents = await FirebaseClient.db
        .collection('plps')
        .where('created_by', '==', uid)
        .where('isArchived', '!=', true)
        .get();

      return Promise.all(
        documents.docs.map(
          async (document) =>
            ({
              ...document.data(),
              link_id: document.id,
            } as PLPLinkDocument),
        ),
      );
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }
}

export const UserService = new User();
