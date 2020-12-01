import { ErrorWrapper } from 'common';
import { useAuth } from 'features/authentication';
import { UserService } from 'features/user';
import { NextApiRequest } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import {
  FaCalendar,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaPortrait,
  FaTwitch,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import { MdDelete, MdEmail } from 'react-icons/md';
import {
  addDelay,
  ComponentStyles,
  css,
  easing,
  fadeInDown,
  fadeInUp,
  listAnimation,
  listChildAnimation,
  motion,
  slideInLeft,
} from 'theme';
import { PLPLinkDocument, UserDocument } from 'types';

const contactItems = [
  { key: 'email', href: 'mailto:', Icon: MdEmail },
  { key: 'tel', href: 'telto:', Icon: FaPhone },
  { key: 'date_of_birth', href: null, Icon: FaCalendar },
];
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
  profileWrapper: (theme) => css`
    margin: 0 auto;

    p {
      line-height: ${theme.lineHeights['taller']};
    }
  `,
  edit: (theme) => css`
    position: absolute;
    top: 2vh;
    right: 5vw;
    background-color: ${theme.colors['primary']};
    color: ${theme.colors.whiteAlpha[900]};
    font-weight: ${theme.fontWeights['semibold']};
    border-radius: ${theme.radii['md']};
    padding: ${theme.space[2]};
  `,
  header: (theme) => css`
    position: relative;
    background-color: ${theme.colors.whiteAlpha[200]};
    padding: ${theme.space[4]};
    text-align: center;
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
  username: (theme) => css`
    flex: 1 1 100%;
  `,
  bio: (theme) => css`
    flex: 1 1 100%;
    max-width: 80ch;
    margin: 0 auto;
  `,
  statList: (theme) => css`
    margin: ${theme.space[2]};
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  `,
  statItem: (theme) => css`
    // min-width: ${theme.space[32]};
    text-align: center;
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: ${theme.space[2]};
    margin: ${theme.space[2]};

    a {
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
  `,
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

  plpLinks: (theme) => css`
    padding-top: ${theme.space[12]};
  `,
  plpLink: (theme) => css`
    padding: ${theme.space[8]};
    margin: ${theme.space[12]} 0;
    border-radius: ${theme.radii['md']};
    border: 2px solid ${theme.colors.secondary};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  `,
};

export default function UserProfile({
  user,
  plpLinks,
  error,
}: {
  user?: UserDocument;
  plpLinks?: PLPLinkDocument[];
  error: Error;
}) {
  const authState = useAuth();
  const {
    query: { username },
  } = useRouter();

  const { created_by, display_name, title, company, bio } = user || {};

  const isOwnProfile =
    !!created_by && authState.data?.currentUser?.uid === created_by;

  if (error) {
    return (
      <ErrorWrapper
        title="Server Error"
        error={{
          message: `User ${JSON.stringify(
            user,
          )} was not found in our servers or there was an error fetching their data`,
        }}
      />
    );
  }

  return !!user ? (
    <section css={styles.profileWrapper}>
      <header css={styles.header}>
        <motion.div
          css={styles.headerImage}
          variants={addDelay(fadeInDown, 0.5)}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <img
            src={'/gvempire-logo.png'}
            alt={display_name || `${username} from SHRT`}
          />
        </motion.div>

        <motion.h1
          className="display"
          css={styles.display_name}
          variants={addDelay(fadeInDown, 0.5)}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {display_name || 'Display Name'}
        </motion.h1>

        {username && (
          <motion.p
            css={styles.username}
            variants={addDelay(fadeInDown, 0.5)}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            @{username}
          </motion.p>
        )}

        {title && (
          <motion.p
            variants={addDelay(fadeInUp, 0.5)}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {title} {company && 'at ' + company}
          </motion.p>
        )}

        {bio && (
          <motion.p
            css={styles.bio}
            variants={addDelay(slideInLeft, 0.5)}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {bio}
          </motion.p>
        )}

        <motion.ul
          css={styles.statList}
          variants={addDelay(listAnimation, 0.5)}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {contactItems.map(
            ({ key, href, Icon }) =>
              key in user && (
                <motion.li
                  key={key}
                  css={styles.statItem}
                  variants={addDelay(listChildAnimation, 1)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <span role="img" css={styles.icon}>
                    <Icon />
                  </span>
                  <a href={`${href}`}>{user[key as keyof UserDocument]}</a>
                </motion.li>
              ),
          )}
        </motion.ul>

        <motion.ul
          css={styles.statList}
          variants={addDelay(listAnimation, 0.5)}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {smItems.map(
            ({ key, href, Icon }) =>
              key in user && (
                <motion.li
                  key={key}
                  css={styles.statItem}
                  variants={addDelay(listChildAnimation, 1)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <span role="img" css={styles.icon}>
                    <Icon />
                  </span>
                  <a href={`${href}`}>{user[key as keyof UserDocument]}</a>
                </motion.li>
              ),
          )}
        </motion.ul>

        {isOwnProfile && (
          <Link href="/user/settings">
            <motion.a
              css={styles.edit}
              variants={addDelay(fadeInDown, 2)}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              Edit Profile
            </motion.a>
          </Link>
        )}
      </header>

      <div css={{ position: 'relative' }}>
        {isOwnProfile && (
          <Link href="/user/links">
            <motion.a
              css={styles.edit}
              variants={addDelay(fadeInDown, 2)}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              Edit Links
            </motion.a>
          </Link>
        )}

        <nav css={styles.plpLinks}>
          {plpLinks?.map((link) => (
            <a key={link.link_id} href={link.url} css={styles.plpLink}>
              {link.title}
              <span>{link.description}</span>
              <button>
                <MdDelete />
              </button>
            </a>
          ))}
        </nav>
      </div>
    </section>
  ) : (
    <section css={styles.profileWrapper}>
      <ErrorWrapper
        title="Server Error"
        error={{
          message: `User ${username} was not found in our servers or there was an error fetching their data`,
        }}
      />
    </section>
  );
}

// server-side function calls firestore to match the username and
//  grab data corresponding to the username
export async function getServerSideProps(req: NextApiRequest) {
  try {
    const { username } = req.query;
    const user =
      typeof username === 'string'
        ? await UserService.getUserDocumentByUsername(username)
        : await UserService.getUserDocumentByUsername(username[0]);

    const plpLinks = await UserService.getPLPLinksByUser(user.created_by);
    return { props: { user, plpLinks } };
  } catch (error) {
    console.error(error);

    return { props: { error: true } };
  }
}
