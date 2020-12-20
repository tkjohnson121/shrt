import firebase from 'firebase';
import { customRandom, random, urlAlphabet } from 'nanoid';
import { ShrtDocument } from 'types/index';
import { FirebaseClient } from '../firebase-client';

class Shrt {
  getURLSafeRandomString = customRandom(urlAlphabet, 6, random);

  openShrtListener(
    uid: string,
    onSnapshotChange: (document: Array<ShrtDocument>) => any,
    onSnapshotError?: (error: firebase.firestore.FirestoreError) => void,
  ) {
    FirebaseClient.analytics?.logEvent('open_shrt_listener');

    return FirebaseClient.db
      .collection('shrts')
      .where('created_by', '==', uid)
      .where('isArchived', '!=', true)
      .onSnapshot((snapshot) => {
        const documents = snapshot.docs.map((doc) => ({
          ...(doc.data() as ShrtDocument),
          shrt_id: doc.id,
        })) as Array<ShrtDocument>;

        onSnapshotChange(documents);
      }, onSnapshotError);
  }

  async addShrt(url: string, id?: string) {
    const uid = FirebaseClient.auth.currentUser?.uid || 'unathenticated';

    const appUrl = /staging/gi.test(process.env.APP_NAME || '')
      ? 'https://staging.shrtme.app/'
      : process.env.NODE_ENV === 'production'
      ? 'https://shrtme.app/'
      : 'http://localhost:3000/';

    try {
      FirebaseClient.analytics?.logEvent('add_shrt', {
        uid,
        url,
        id,
      });

      if (
        !!id &&
        (typeof id !== 'string' || !/^([a-zA-Z0-9_-]){2,30}$/.test(id))
      ) {
        throw new Error('Invalid ID');
      }

      if (
        typeof url !== 'string' ||
        !/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
          url,
        )
      ) {
        throw new Error('Invalid URL');
      }

      const shrt_id =
        id?.replace(' ', '').trim() || this.getURLSafeRandomString();

      // const prevShrt = (
      //   await FirebaseClient.db.collection('shrts').doc(shrt_id).get()
      // ).data();

      // if (!!prevShrt) {
      //   console.log(prevShrt);
      //   throw new Error(`'${shrt_id}' is unavailable`);
      // }

      const newShrtDocument = {
        created_by: uid,
        created_on: Date.now(),
        isArchived: false,
        shrt_id: shrt_id,
        shrt_url: appUrl + shrt_id,
        url: url,
        clicks: 0,
      };

      await FirebaseClient.db
        .collection('shrts')
        .doc(shrt_id)
        .set(newShrtDocument);

      return newShrtDocument;
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }

  async getShrtById(shrtId: string) {
    try {
      FirebaseClient.analytics?.logEvent('get_shrt_by_id');

      const doc = await FirebaseClient.db.collection('shrts').doc(shrtId).get();

      return { ...doc.data(), shrt_id: doc.id } as ShrtDocument;
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);

      throw new Error(error);
    }
  }

  async getAnalyticsByShrtID() {}

  async archiveShrt(uid: string, shrtID: string) {
    try {
      FirebaseClient.analytics?.logEvent('delete_shrt', {
        uid,
        shrtID,
      });

      return await FirebaseClient.db
        .collection('shrts')
        .doc(shrtID)
        .update({ isArchived: true });
    } catch (error) {
      FirebaseClient.analytics?.logEvent('exception', error);
      throw new Error(error);
    }
  }

  async updateShrtAfterView(shrt: ShrtDocument) {
    try {
      // update view count
      return await FirebaseClient.db
        .collection('shrts')
        .doc(shrt.shrt_id)
        .update({
          clicks: (shrt.clicks || 0) + 1,
        });
    } catch (error) {
      throw new Error(error);
    }
  }
}

export const ShrtService = new Shrt();
