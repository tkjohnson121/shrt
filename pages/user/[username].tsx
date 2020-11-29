import { useAuth } from 'features/authentication';
import { FirebaseClient } from 'features/firebase-client';
import { NextApiRequest } from 'next';
import Link from 'next/link';
import React from 'react';
import { ComponentStyles, css } from 'theme';
import { ShrtUserDocument } from 'types';

const styles: ComponentStyles = {
  profileWrapper: (theme) => css``,
};

export default function UserProfile({
  user,
}: {
  user: ShrtUserDocument | null;
}) {
  const authState = useAuth();

  const isOwnUser = user?.uid && authState.data?.currentUser?.uid === user?.uid;

  return !!user ? (
    <section css={styles.profileWrapper}>
      {isOwnUser && (
        <Link href="/user/settings">
          <a>Edit</a>
        </Link>
      )}

      <header css={styles.header}>
        <div css={styles.headerImage}>
          <img
            src={'/gvempire-logo.png'}
            alt={user.display_name || `${user.username} from SHRT`}
          />
        </div>
        <h1 className="display" css={styles.title}>
          {user.display_name}
        </h1>
        <p css={styles.tagline}>@{user.username}</p>
        <p css={styles.tagline}>{user.bio}</p>
        <hr />
        <p css={styles.tagline}>{user.email}</p>
        <p css={styles.tagline}>
          Member Since {new Date(user.created_on).toLocaleDateString()}
        </p>
        <p css={styles.tagline}>Birthday {user.date_of_birth}</p>
      </header>

      <ul>
        {[
          'twitter',
          'twitch',
          'youtube',
          'instagram',
          'linkedin',
          'github',
          'website',
        ].map(
          (key) =>
            key in user && (
              <li key={key}>
                {key.toUpperCase()}: {user[key as keyof ShrtUserDocument]}
              </li>
            ),
        )}
      </ul>
    </section>
  ) : (
    <section css={styles.profileWrapper}>
      <h1 className="display">User Not Found</h1>
      <Link href="/">
        <a>Go Home</a>
      </Link>
    </section>
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
