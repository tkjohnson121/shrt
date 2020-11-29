import { FirebaseClient } from 'features/firebase-client';
import { NextApiRequest } from 'next';
import React from 'react';
import { ShrtUser } from 'types';

export default function UserProfile({ user }: { user: ShrtUser | null }) {
  return (
    <div>
      <h1 className="display">User Profile</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

// server-side function calls firestore to match the username and
//  grab data corresponding to the username
export async function getServerSideProps(req: NextApiRequest) {
  try {
    const { username } = req.query;
    const user =
      (
        await FirebaseClient.db
          .collection('users')
          .where('username', '==', username)
          .get()
      ).docs.map((doc) => ({ ...doc.data(), uid: doc.id }))[0] || null;

    return {
      props: { user },
    };
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
