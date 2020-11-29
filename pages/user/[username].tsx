import { useAuth } from 'features/authentication';
import { FirebaseClient } from 'features/firebase-client';
import { NextApiRequest } from 'next';
import Link from 'next/link';
import React from 'react';
import {
  FaBirthdayCake,
  FaEnvelope,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaPortrait,
  FaTwitch,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import { ComponentStyles, css, easing } from 'theme';
import { ShrtUserDocument } from 'types';

const smItems = [
  { key: 'twitter', href: 'https://twitter.com/', Icon: FaTwitter },
  { key: 'twitch', href: 'https://twitch.com/', Icon: FaTwitch },
  { key: 'youtube', href: 'https://youtube.com/', Icon: FaYoutube },
  {
    key: 'instagram',
    href: 'https://instagram.com/',
    Icon: FaInstagram,
  },
  {
    key: 'linkedin',
    href: 'https://linkedin.com/',
    Icon: FaLinkedin,
  },
  { key: 'github', href: 'https://github.com/', Icon: FaGithub },
  { key: 'website', href: 'https://website.com/', Icon: FaPortrait },
];

const styles: ComponentStyles = {
  profileWrapper: (theme) => css``,
  edit: (theme) => css`
    background-color: ${theme.colors['primary']};
    color: ${theme.colors.whiteAlpha[900]};
    font-weight: ${theme.fontWeights['semibold']};
    border-radius: ${theme.radii['md']};
    padding: ${theme.space[2]};
  `,
  header: (theme) => css`
    background-color: ${theme.colors.whiteAlpha[200]};
    padding: ${theme.space[4]};
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-evenly;
    text-align: center;

    p {
      line-height: ${theme.lineHeights['taller']};
    }

    a {
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      padding: ${theme.space[2]} ${theme.space[4]} ${theme.space[2]} 0;

      &::after {
        content: '';
        transition: left 150ms cubic-bezier(${easing.join(',')});
        position: absolute;
        bottom: 0;
        left: -100%;
        width: 100%;
        height: 2px;
        background-color: ${theme.colors['primary']};
      }

      &.active::after,
      &:hover::after {
        left: 0;
      }
    }

    & > *:not(img) {
      margin: ${theme.space[2]};
      display: inline-flex;
      align-items: center;
      justify-content: space-evenly;
    }

    @media (max-width: 420px) {
      flex-direction: column;
    }
  `,
  headerImage: (theme) => css`
    flex: 1 1 100%;

    img {
      max-width: ${theme.space[32]};
    }
  `,
  display_name: (theme) => css`
    flex: 1 1 100%;
  `,
  title: (theme) => css``,
  company: (theme) => css``,
  username: (theme) => css``,
  bio: (theme) => css`
    flex: 1 1 100%;
  `,
  email: (theme) => css``,
  created: (theme) => css``,
  dob: (theme) => css``,
  icon: (theme) => css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.space[1]};

    svg {
      color: ${theme.colors.secondary};
      height: 100%;
      width: 100%;
    }
  `,
};

export default function UserProfile({
  user,
}: {
  user: ShrtUserDocument | null;
}) {
  const authState = useAuth();
  const {
    display_name,
    username,
    title,
    company,
    bio,
    email,
    date_of_birth,
    phone,
  } = user || {};

  const isOwnUser = user?.uid && authState.data?.currentUser?.uid === user?.uid;

  return !!user ? (
    <section css={styles.profileWrapper}>
      <header css={styles.header}>
        <div css={styles.headerImage}>
          <img
            src={'/gvempire-logo.png'}
            alt={display_name || `${username} from SHRT`}
          />
        </div>

        <h1 className="display" css={styles.display_name}>
          {display_name || 'Display Name'}
        </h1>

        {username && <p css={styles.username}>@{username}</p>}

        {title && (
          <p css={styles.title}>
            {title} {company && 'at ' + company}
          </p>
        )}

        {bio && <p css={styles.bio}>{bio}</p>}

        <p css={styles.email}>
          <span role="img" css={styles.icon}>
            <FaEnvelope />
          </span>{' '}
          <a href={`mailto:${email}`}>{email}</a>
        </p>

        {phone && (
          <p css={styles.phone}>
            <span role="img" css={styles.icon}>
              <FaPhone />
            </span>{' '}
            {phone}
          </p>
        )}

        {date_of_birth && (
          <p css={styles.dob}>
            <span role="img" css={styles.icon}>
              <FaBirthdayCake />
            </span>{' '}
            {new Date(date_of_birth).toLocaleDateString()}
          </p>
        )}

        {smItems.map(
          ({ key, href, Icon }) =>
            key in user && (
              <p key={key} css={styles.smItem}>
                <span role="img" css={styles.icon}>
                  <Icon />
                </span>
                <a href={`${href}`}>{user[key as keyof ShrtUserDocument]}</a>
              </p>
            ),
        )}
      </header>

      {isOwnUser && (
        <Link href="/user/settings">
          <a css={styles.edit}>Edit</a>
        </Link>
      )}
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
