import { ShrtUser } from './../types/index';
import { FirebaseClient } from './firebase-client';

class Shrten {
  async getLinkByUserID(uid: string) {
    try {
      FirebaseClient.analytics?.logEvent('get_link');

      const documents = await FirebaseClient.db
        .collection('shrten')
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

  async getLinkByURL(url: string) {
    try {
      FirebaseClient.analytics?.logEvent('get_link');

      const documents = await FirebaseClient.db
        .collection('shrten')
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

  async addLink(currentUser: ShrtUser, url: string) {
    try {
      FirebaseClient.analytics?.logEvent('add_link', {
        uid: currentUser.uid,
        url,
      });

      return await FirebaseClient.db.collection('shrten').add({
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

  async deleteLink(currentUser: ShrtUser, linkID: string) {
    try {
      FirebaseClient.analytics?.logEvent('delete_link', {
        uid: currentUser.uid,
        linkID,
      });

      return await FirebaseClient.db.collection('shrten').doc(linkID).delete();
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }

  async getAnalyticsByLinkID() {}
}

export const ShrtenService = new Shrten();
