import { ErrorWrapper, Loading } from 'common';
import { UserService } from 'features/user';
import { NextApiRequest, NextApiResponse } from 'next';
import React from 'react';
import { FaCalendar, FaPhone } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { ComponentStyles, css, easing } from 'theme';

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
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  `,
  headerImage: (theme) => css`
    flex: 1 1 100%;

    img {
      max-width: ${theme.space[32]};
      border-radius: ${theme.radii['full']};
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
};

export default function UserProfile({
  error,
  url,
}: {
  error?: Error;
  url?: string;
}) {
  if (typeof url === 'string' && typeof window !== 'undefined') {
    window.location.replace(url);

    return <Loading />;
  }

  if (error) {
    return (
      <ErrorWrapper
        title={('code' in error && error['code']) || '404: Not Found'}
        error={{
          message: error?.message,
        }}
      />
    );
  }

  return <Loading />;
}

export async function redirect(req: NextApiRequest, res: NextApiResponse) {
  const { shrt_id } = req.query;

  if (typeof shrt_id === 'undefined') {
    throw new Error('Shrt ID is required');
  }

  // - lookup shrt in shrts collection
  const shrt = await UserService.getShrtById(
    typeof shrt_id === 'string' ? shrt_id : shrt_id[0],
  );

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
    return { props: { url: shrt.url } };
  }
}

// server-side function calls firestore to match the username and
//  grab data corresponding to the username
export async function getServerSideProps(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    return await redirect(req, res);
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
