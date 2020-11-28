import { ShrtUser } from './../types/index';
import { FirebaseClient } from './firebase-client';

class Shrten {
  async addLink(currentUser: ShrtUser, url: string) {
    try {
      FirebaseClient.analytics?.logEvent('add_link', {
        uid: currentUser.uid,
        url,
      });

      return await FirebaseClient.db
        .collection('users')
        .doc(currentUser.uid)
        .collection('shrten')
        .doc(url)
        .set({
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

  async deleteLink(currentUser: ShrtUser, url: string) {
    try {
      FirebaseClient.analytics?.logEvent('delete_link', {
        uid: currentUser.uid,
        url,
      });

      return await FirebaseClient.db
        .collection('users')
        .doc(currentUser.uid)
        .collection('shrten')
        .doc(url)
        .delete();
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }

  async getAnalyticsByLinkID() {}
}

export const ShrtenService = new Shrten();
