import { ErrorWrapper, Loading, smItems } from 'common';
import { useAuth } from 'features/authentication';
import { UserService } from 'features/user';
import { NextApiRequest, NextApiResponse } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { FaCalendar, FaPhone } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
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
  { key: 'phone', href: 'telto:', Icon: FaPhone },
  { key: 'date_of_birth', href: null, Icon: FaCalendar },
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
    box-shadow: ${theme.shadows['lg']};
  `,
  headerImage: (theme) => css`
    flex: 1 1 100%;

    img {
      max-width: ${theme.space[32]};
    }
  `,
  display_name: () => css`
    flex: 1 1 100%;
  `,
  username: () => css`
    flex: 1 1 100%;
  `,
  bio: () => css`
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
    text-align: center;
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.space[2]};
    margin: ${theme.space[2]};

    a {
      display: inline-flex;
      align-items: center;
      justify-content: center;

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
    z-index: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: ${theme.space[8]};
    margin: ${theme.space[12]} 0;
    border-radius: ${theme.radii['md']};
    border: 2px solid ${theme.colors.secondary};
    box-shadow: ${theme.shadows['md']};

    span:first-of-type {
      display: block;
      width: 100%;
      height: 100%;
      font-size: ${theme.fontSizes['3xl']};
      z-index: -1;
    }

    span:nth-of-type(0n + 2) {
      line-height: ${theme.lineHeights['taller']};
      z-index: -1;
    }

    button {
      position: absolute;
      top: 50%;
      right: 2vw;
      padding: ${theme.space[2]};
      border-radius: ${theme.radii['md']};
      font-weight: ${theme.fontWeights['semibold']};
      font-size: ${theme.fontSizes['xl']};
      background-color: ${theme.colors['error']};
      color: ${theme.colors.whiteAlpha[900]};
      z-index: 5;
      transform: translate3d(0, -50%, 0);
      pointer-events: all;
    }
  `,
};

export default function UserProfile({
  user,
  plpLinks,
  error,
  url,
}: {
  user?: UserDocument;
  plpLinks?: PLPLinkDocument[];
  error?: Error;
  url?: string;
}) {
  const authState = useAuth();
  const {
    query: { username },
  } = useRouter();

  const { created_by, display_name, title, company, bio, city, state } =
    user || {};

  const isOwnProfile =
    !!created_by && authState.data?.currentUser?.uid === created_by;

  if (typeof url === 'string' && typeof window !== 'undefined') {
    window.location.replace(url);

    return <Loading />;
  }

  if (error || typeof user === 'undefined') {
    return (
      <ErrorWrapper
        title="404: Not Found"
        error={{
          message:
            error?.message ||
            `There was an error fetching data for ${username}`,
        }}
      />
    );
  }

  return (
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
            {title} {company && 'at ' + company}{' '}
            {city &&
              ' in ' +
                city +
                (state && ', ') +
                (city
                  ? state?.slice(0, 2)
                  : state
                  ? ' in ' + state?.slice(0, 2)
                  : null)}
          </motion.p>
        )}

        {(city || state) && (
          <motion.p
            variants={addDelay(fadeInUp, 0.5)}
            initial="initial"
            animate="animate"
            exit="exit"
          ></motion.p>
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

                  {href ? (
                    <a href={`${href}`}>{user[key as keyof UserDocument]}</a>
                  ) : (
                    <span>{user[key as keyof UserDocument]}</span>
                  )}
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
              key in user &&
              !!user[key as keyof UserDocument] && (
                <motion.li
                  key={key}
                  css={styles.statItem}
                  variants={addDelay(listChildAnimation, 1)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <a
                    href={
                      typeof href === 'string'
                        ? href + user[key as keyof UserDocument]
                        : href(user[key as keyof UserDocument])
                    }
                    target="_new"
                    rel="noreferrer noopener"
                  >
                    <span role="img" css={styles.icon}>
                      <Icon />
                    </span>
                    {/* {user[key as keyof UserDocument]} */}
                  </a>
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

        <motion.nav
          css={styles.plpLinks}
          variants={addDelay(listAnimation, 0.9)}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {plpLinks?.map((link) => (
            <motion.a
              key={link.link_id}
              href={link.url}
              target="_new"
              rel="noreferrer noopener"
              css={styles.plpLink}
              variants={addDelay(listChildAnimation, 1.2)}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <span>{link.name}</span>
              {link.description && <span>{link.description}</span>}
              {isOwnProfile && <button>X</button>}
            </motion.a>
          ))}
        </motion.nav>
      </div>
    </section>
  );
}

export async function redirect(req: NextApiRequest, res: NextApiResponse) {
  const { username, shrt_query } = req.query;
  const query = username || shrt_query;
  const shrt_id = typeof query === 'string' ? query : query[0];

  if (typeof shrt_id === 'undefined') {
    throw new Error('Shrt ID is required');
  }

  // - lookup shrt in shrts collection
  const shrt = await UserService.getShrtById(shrt_id);

  if (typeof shrt.url === 'undefined') {
    throw new Error('Shrt not Found');
  }

  // - add view and related data
  if (typeof window === 'undefined' && !!shrt) {
    await require('../features/user').UserService.updateShrtAfterView(shrt);
  }

  // redirect
  if (typeof window === 'undefined' && !!shrt.url) {
    res?.writeHead(301, {
      Location: shrt.url,
    });
    res?.end();

    return { props: { url: shrt.url } };
  } else {
    window.location.replace(shrt.url);
  }
}

// server-side function calls firestore to match the username and
//  grab data corresponding to the username
export async function getServerSideProps(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { username } = req.query;
    const user =
      typeof username === 'string'
        ? await UserService.getUserDocumentByUsername(username)
        : await UserService.getUserDocumentByUsername(username[0]);

    if (typeof user === 'undefined') {
      return await redirect(req, res);
    }

    const plpLinks = await UserService.getPLPLinksByUser(user.created_by);
    return { props: { user, plpLinks } };
  } catch (error) {
    return {
      props: {
        error: {
          message:
            error.message || 'There was an error fetching data for' + req.query,
        },
      },
    };
  }
}
