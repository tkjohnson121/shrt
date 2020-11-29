import { ShrtUrl, ShrtUser } from '../types/index';
import { FirebaseClient } from './firebase-client';

class Shrt {
  openShrtListener(
    uid: string,
    onSnapshot: (document: Array<ShrtUrl & { uid: string }>) => any,
  ) {
    FirebaseClient.analytics?.logEvent('open_shrt_listener');

    return FirebaseClient.db
      .collection('shrts')
      .where('created_by', '==', uid)
      .onSnapshot((snapshot) => {
        const documents = snapshot.docs
          .map((doc) => ({
            ...(doc.data() as ShrtUrl),
            uid: doc.id,
          }))
          .filter((doc) => doc.deleted !== true) as Array<
          ShrtUrl & { uid: string }
        >;

        onSnapshot(documents);
      });
  }

  async getShrtByUserID(uid: string) {
    try {
      FirebaseClient.analytics?.logEvent('get_shrt_by_user_id');

      const documents = await FirebaseClient.db
        .collection('shrts')
        .where('created_by', '==', uid)
        .get();

      return Promise.all(
        documents.docs.map(async (document) => document.data()),
      );
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }

  async getShrtByURL(url: string) {
    try {
      FirebaseClient.analytics?.logEvent('get_shrt_by_url');

      const documents = await FirebaseClient.db
        .collection('shrts')
        .where('url', '==', url)
        .get();

      return Promise.all(
        documents.docs.map(async (document) => document.data()),
      );
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }

  async addShrt(currentUser: ShrtUser, url: string) {
    try {
      FirebaseClient.analytics?.logEvent('add_link', {
        uid: currentUser.uid,
        url,
      });

      return await FirebaseClient.db.collection('shrts').add({
        url,
        shrt_url: '',
        created_on: Date.now(),
        created_by: currentUser.uid,
      });
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }

  async deleteShrt(currentUser: ShrtUser, linkID: string) {
    try {
      FirebaseClient.analytics?.logEvent('delete_link', {
        uid: currentUser.uid,
        linkID,
      });

      return await FirebaseClient.db
        .collection('shrts')
        .doc(linkID)
        .set({ deleted: true });
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }

  async getAnalyticsByLinkID() {}
}

export const ShrtService = new Shrt();
